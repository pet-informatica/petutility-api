const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const parallel = require('async/parallel');
const htmlPdf = require('html-pdf');
const nodemailer = require('nodemailer');
const sequelize = require('sequelize');
const RecordOfMeeting = app.get('models').RecordOfMeeting;

router.get('/search', function(req, res) {
	var year = parseInt(req.query.year);
	if(!year)
		return res.status(403).send('Campo de ano necessário');
	var query = {
		attributes: ['Id', 'Date', 'Status'],
		where: {
			Date: {
				$and: {
					$gte: new Date(year, 0, 1, 0, 0, 0, 0),
					$lt: new Date(year+1, 0, 1, 0, 0, 0, 0)
				}
			}
		}
	};
	RecordOfMeeting
		.findAll(query)
		.then((result) => {
			var ret = [];
			for(var i = 0; i < result.length; ++i)
				ret.push(result[i].toJSON());
			ret.reverse();
			res.status(200).json(ret);
		})
		.catch((err) => {
			res.status(500).json({message: err.message});
		});
});

router.get('/open', function(req, res) {
	RecordOfMeeting
		.count({
			where: {Status: 1}
		})
		.then(function(result) {
			res.send({open: (result === 0)});
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
});

router.get('/:recordOfMeetingId', function(req, res) {
	RecordOfMeeting
		.findById(req.params.recordOfMeetingId, {
			include: [
				{model: app.get('models').PETiano, as: 'Ateiro'},
				{model: app.get('models').PETiano, as: 'President'},
				{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
				{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
					{model: app.get('models').PETiano, as: 'PETiano'}
				]}
			]
		})
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
});

router.get('/', function(req, res) {
	RecordOfMeeting
		.findOne({
			include: [
				{model: app.get('models').PETiano, as: 'Ateiro'},
				{model: app.get('models').PETiano, as: 'President'},
				{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
				{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
					{model: app.get('models').PETiano, as: 'PETiano'}
				]}
			],
			order: [['Id', 'DESC']]
		})
		.then(function(result) {
			res.json(result.toJSON());
		})
		.catch(function(result) {
			res.status(500).send('Internal server error');
		});
});

router.post('/updateAteiroOrPresident', function(req, res) {
	RecordOfMeeting
		.update({AteiroId: req.body.AteiroId, PresidentId: req.body.PresidentId}, {where: {Id: req.body.Id}})
		.then((result) => {
			if(!result[0])
				res.status(500).send({message: 'Erro interno'});
			else
				res.end();
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		});
});

router.post('/save/:recordOfMeetingId', function(req, res) {
	RecordOfMeeting
		.update({Status: 2}, {
			where: {Id: req.params.recordOfMeetingId, Status: 1}
		})
		.then((result) => {
			if(result[0]) {
				res.end();
				RecordOfMeeting
					.findById(req.params.recordOfMeetingId, {
						include: [
							{model: app.get('models').PETiano, as: 'Ateiro'},
							{model: app.get('models').PETiano, as: 'President'},
							{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
							{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
								{model: app.get('models').PETiano, as: 'PETiano'}
							]}
						]
					})
					.then((result) => {
						var transp = app.get('mailTransporter');
						if(transp && process.env.EMAIL_DESTINY && process.env.EMAIL) {
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
											if(err)
												console.log(err);
										});
								});
						}
						var penaltys = [];
						result.AbsentsOrLates.forEach((i) => {
							if(!i.IsJustified)
								penaltys.push({
									Value: 15.0,
									Date: result.Date,
									PenaltyJustification: (i.Type == 1 ? 'Ausência não justificada' : 'Atraso não justificado') + ' em ' + result.Date.toLocaleDateString('en-GB') + '.',
									PETianoId: i.PETianoId
								});
						});
						app
							.get('models')
							.Penalty
							.bulkCreate(penaltys);
					});
			} else {
				res.status(403).json({message: 'Nada a alterar'});
			}
		})
		.catch((err) => {
			res.status(500).json({message: err.message});
		});
});

router.get('/:id/download', (req, res) => {
	RecordOfMeeting
		.findOne({
			include: [
				{model: app.get('models').PETiano, as: 'Ateiro'},
				{model: app.get('models').PETiano, as: 'President'},
				{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
				{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
					{model: app.get('models').PETiano, as: 'PETiano'}
				]}
			],
			where: {
				Status: 2,
				Id: req.params.id
			}
		})
		.then((result) => {
			if(!result)
			{
				res.status(404);
				res.send('<h1>Ata inexistente ou ainda não salva</h1>');
				return;
			}
			var html = app.get('recordOfMeetingRender')(result.toJSON());
			htmlPdf.create(html, {format: 'Letter', timeout: 60000}).toStream((err, result) => {
				if(err)
				{
				console.log(err);
					res.status(500);
					res.send('Erro interno');
					return;
				}
				res.contentType('application/pdf');
				result.pipe(res);
			});
		})
		.catch((err) => {
			res.status(500);
			res.send('Erro interno');
			console.log(err);
		});
});

router.post('/', function(req, res) {
	RecordOfMeeting
		.findOne({
			include: [
				{model: app.get('models').PETiano, as: 'Ateiro'},
				{model: app.get('models').PETiano, as: 'President'},
				{model: app.get('models').AgendaPoint, as: 'AgendaPoints'}
			],
			order: [['Id', 'DESC']]
		})
		.then(function(result) {
			if(result.Status != 2)
				 return res.status(403).json({message: 'Ata ainda aberta.'});
			RecordOfMeeting
				.create({
					Status: 1,
					AteiroId: result.AteiroId,
					PresidentId: result.PresidentId
				}, {
					include: [
						{model: app.get('models').PETiano, as: 'Ateiro'},
						{model: app.get('models').PETiano, as: 'President'},
						{model: app.get('models').AgendaPoint, as: 'AgendaPoints'}
					]
				})
				.then((result1) => {
					parallel([
						(callback) => {
							var toDos = [];
							for(var i = 0; i < result.AgendaPoints.length; ++i)
							{
								var agendaPoint = result.AgendaPoints[i];
								toDos.push({
									RecordOfMeetingId: result1.Id,
									PETianoId: agendaPoint.PETianoId,
									Title: agendaPoint.Title,
									Description: agendaPoint.Description,
									Status: (agendaPoint.Status == 2) ? 2 : 3
								});
							}
							app
								.get('models')
								.AgendaPoint
								.bulkCreate(toDos, {returning: true})
								.then((results) => {
									for(var i = 0; i < results.length; ++i)
										results[i] = results[i].toJSON();
									callback(null, results);
								})
								.catch((err) => {
									callback(err);
								});
						},
						(callback) => {
							app
								.get('models')
								.AgendaPoint
								.update({
									RecordOfMeetingId: result1.Id,
									Status: 4,
								}, {
									where: {
										Status: 1
									},
									returning: true
								})
								.then((result) => {
									var results = result[1];
									for(var i = 0; i < result[0]; ++i)
										results[i] = result[1][i].toJSON();
									callback(null, results);
								})
								.catch((err) => {
									callback(err);
								});
						}
					], (err, results) => {
						if(err)
							return res.status(500).send({message: 'Erro interno'});
						var ret = result1.toJSON();
						ret.AgendaPoints = results[0].concat(results[1]);
						ret.AbsentsOrLates = [];
						ret.Ateiro = result.Ateiro.toJSON();
						ret.President = result.President.toJSON();
						res.json(ret);
					});
				})
				.catch((err) => {
					return res.status(500).send({message: 'Erro interno'});
				});
		})
		.catch(function(err) {
			return res.status(500).send({message: 'Erro interno'});
		});
})

module.exports = router;
