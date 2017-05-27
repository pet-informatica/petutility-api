const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const parallel = require('async/parallel');
const each = require('async/each');
const htmlPdf = require('html-pdf');
const nodemailer = require('nodemailer');
const sequelize = require('sequelize');
const RecordOfMeeting = app.get('models').RecordOfMeeting;
const AgendaPoint = app.get('models').AgendaPoint;
const Penalty = app.get('models').Penalty;
const PETiano = app.get('models').PETiano;
const AbsentOrLate = app.get('models').AbsentOrLate;

router.get('/', (req, res) => {
	var query = {
		attributes: ['Id', 'Date', 'Status'],
		order: [['Id', 'DESC']]
	};
	if(req.query.yer) {
		var year = parseInt(req.query.year);
		query.where = {
			Date: {
				$and: {
					$gte: new Date(year, 0, 1, 0, 0, 0, 0),
					$lt: new Date(year+1, 0, 1, 0, 0, 0, 0)
				}
			}
		}
	}
	RecordOfMeeting
		.findAll(query)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json({message: err.message});
		});
});

router.get('/:recordOfMeetingId', (req, res) => {
	RecordOfMeeting
		.findById(req.params.recordOfMeetingId, {
			include: [
				{model: PETiano, as: 'Ateiro'},
				{model: PETiano, as: 'President'},
				{model: AgendaPoint, as: 'AgendaPoints'},
				{model: AbsentOrLate, as: 'AbsentsOrLates', include: [
					{model: PETiano, as: 'PETiano'}
				]}
			]
		})
		.then(function(result) {
			res.status(200).json(result);
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
});

router.get('/:recordOfMeetingId/download', (req, res) => {
	RecordOfMeeting
		.findOne({
			include: [
				{model: PETiano, as: 'Ateiro'},
				{model: PETiano, as: 'President'},
				{model: AgendaPoint, as: 'AgendaPoints'},
				{model: AbsentOrLate, as: 'AbsentsOrLates', include: [
					{model: PETiano, as: 'PETiano'}
				]}
			],
			where: {
				Status: 2,
				Id: req.params.recordOfMeetingId
			}
		})
		.then((result) => {
			if(!result) {
				res.status(404).json({message: 'Ata inexistente ou ainda não salva'});
				return;
			}
			var html = app.get('recordOfMeetingRender')(result.toJSON());
			htmlPdf.create(html, {format: 'Letter', timeout: 60000}).toStream((err, result) => {
				if(err) {
					res.status(500).json({message: 'Erro interno'});
				} else {
					res.contentType('application/pdf');
					result.pipe(res);
				}
			});
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

var locker = false;

var lockerFunction = function(req, res, next) {
	if (locker)
		res.status(400).json({message: 'Ata bloqueada no momento'});
	else
		next();
};

router.put('/:recordOfMeetingId', lockerFunction, function(req, res) {
	var data = {};
	if (req.body.AteiroId)
		data.AteiroId = req.body.AteiroId;
	if (req.body.PresidentId)
		data.PresidentId = req.body.PresidentId;
	RecordOfMeeting
		.update(data, {where: {Id: req.params.recordOfMeetingId, Status: 1}})
		.then((result) => {
			if(result[0] === 1)
				res.end();
			else
				res.status(404).json({message: 'Ata nao encontrada'});
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

router.post('/:recordOfMeetingId', lockerFunction, function(req, res) {
	locker = true;
	RecordOfMeeting
		.update({Status: 2}, {where: {Id: req.params.recordOfMeetingId, Status: 1}})
		.then((result) => {
			locker = false;
			if (result[0] === 1) {
				res.end();
				RecordOfMeeting
					.findById(req.params.recordOfMeetingId, {
						include: [
							{model: PETiano, as: 'Ateiro'},
							{model: PETiano, as: 'President'},
							{model: AgendaPoint, as: 'AgendaPoints'},
							{model: AbsentOrLate, as: 'AbsentsOrLates', include: [
								{model: PETiano, as: 'PETiano'}
							]}
						]
					})
					.then((result) => {
						var transp = app.get('mailTransporter');
						if (transp && process.env.EMAIL_DESTINY && process.env.EMAIL) {
							var html = app.get('recordOfMeetingRender')(result.toJSON());
							htmlPdf.create(html, {format: 'Letter'}).toBuffer((err, pdfStream) => {
									transp
										.sendMail({
											from: '"PETUtility" <' + process.env.EMAIL + '>',
											to: process.env.EMAIL_DESTINY,
											subject: 'Atas PETUtility',
											text: 'Ata referente ao dia ' + result.Date.toLocaleDateString('en-GB') + '.',
											attachments: [
												{
													filename: (result.Date.toLocaleDateString('en-GB') + '.pdf'),
													content: pdfStream,
													contentType: 'application/pdf'
												}
											]
										}, function(err, info) {
											if (err)
												console.log(err);
										});
								});
						}
						var penaltys = [];
						each(result.AbsentsOrLates, (i, done) => {
							if(!i.IsJustified)
								penaltys.push({
									Value: 15.0,
									Date: result.Date,
									PenaltyJustification: (i.Type == 1 ? 'Ausência não justificada' : 'Atraso não justificado') + ' em ' + result.Date.toLocaleDateString('en-GB') + '.',
									PETianoId: i.PETianoId
								});
							done();
						}, () => {
							Penalty.bulkCreate(penaltys);
						})
					});
			} else {
				res.status(400).json({message: 'Nao ha nenhuma ata aberta com esse id'});
			}
		})
		.catch((err) => {
			locker = false;
			res.status(500).json({message: err.message});
		});
});

router.post('/', lockerFunction, function(req, res) {
	locker = true;
	RecordOfMeeting
		.findOne({
			include: [
				{model: PETiano, as: 'Ateiro'},
				{model: PETiano, as: 'President'},
				{model: AgendaPoint, as: 'AgendaPoints'}
			],
			order: [['Id', 'DESC']]
		})
		.then((lastRecord) => {
			if(lastRecord.Status !== 2) {
				locker = false;
				return res.status(403).json({message: 'Ata ainda aberta.'});
			}
			RecordOfMeeting
			  .create({
			    Status: 1,
			    AteiroId: lastRecord.AteiroId,
			    PresidentId: lastRecord.PresidentId
			  }, {
			    include: [
			      {model: AgendaPoint, as: 'AgendaPoints'}
			    ]
			  })
				.then((newRecord) => {
					parallel([
						(cb) => {
							var toDos = [];
							each(lastRecord.AgendaPoints, (a, done) => {
								toDos.push({
									RecordOfMeetingId: newRecord.Id,
									PETianoId: a.PETianoId,
									Title: a.Title,
									Description: a.Description,
									Status: (a.Status == 2) ? 2 : 3
								});
								done();
							}, () => {
								AgendaPoint
									.bulkCreate(toDos, {returning: true})
									.then((agendaPoints) => {
										for(var i = 0; i < agendaPoints.length; ++i)
											agendaPoints[i] = agendaPoints[i].toJSON();
										cb(null, agendaPoints);
									})
									.catch(cb);
							});
						},
						(cb) => {
							AgendaPoint
					      .update({
					        RecordOfMeetingId: newRecord.Id,
					        Status: 4,
					      }, {
					        where: {
					          Status: 1
					        },
					        returning: true
					      })
					      .then((result) => {
					        var agendaPoints = result[1];
					        for(var i = 0; i < agendaPoints.length; ++i)
					          agendaPoints[i] = agendaPoints[i].toJSON();
					        cb(null, agendaPoints);
					      })
					      .catch(cb);
						}
					], (err, results) => {
						locker = false;
						if (err)
							return res.status(500).json({message: 'Erro interno'});
						var ret = newRecord.toJSON();
						ret.Ateiro = lastRecord.Ateiro.toJSON();
						ret.President = lastRecord.President.toJSON();
						ret.AgendaPoints = [];
					  ret.AgendaPoints = results[0].concat(results[1]);
						ret.AbsentsOrLates = [];
						res.status(201).json(ret);
					});
				})
				.catch((err) => {
					locker = false;
					res.status(500).send({message: 'Erro interno'});
				});
		})
		.catch((err) => {
			locker = false;
			res.status(500).send({message: 'Erro interno'});
		});
});

module.exports = router;
