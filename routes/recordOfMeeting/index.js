var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var parallel = require('async/parallel');
var htmlPdf = require('html-pdf');
var nodemailer = require('nodemailer');
var sequelize = require('sequelize');

router.get('/search', function(req, res) {
	var year = parseInt(req.query.year);
	if(!year)
		return res.status(403).send('Campo de ano necessário');
	var dateA = new Date(year, 0, 1, 0, 0, 0, 0),
		dateB = new Date(year+1, 0, 1, 0, 0, 0, 0);
	app
		.get('models')
		.RecordOfMeeting
		.findAll({
			attributes: ['Id', 'Date'],
			where: {
				Date: {
					$and: {
						$gte: dateA,
						$lt: dateB
					}
				}
			}
		})
		.then((result) => {
			var ret = [];
			for(var i = 0; i < result.length; ++i)
				ret.push(result[i].toJSON());
			ret.reverse();
			res.json(ret).end();
		})
		.catch((err) => {
			res.status(500).send('Erro interno');
		});
});

router.get('/open', function(req, res) {
	app
		.get('models')
		.RecordOfMeeting
		.count({
			where: {Status: 1}
		})
		.then(function(result) {
			res.send({open: (result === 0)});
		})
		.catch(function(err) {
			res.status(500);
			return res.send({message: 'Erro interno'});
		})
});

router.get('/:recordOfMeetingId', function(req, res)
{
	app.get('models')
		.RecordOfMeeting
		.findById(req.params.recordOfMeetingId,
			{
				include: [
					{model: app.get('models').PETiano, as: 'Ateiro'},
					{model: app.get('models').PETiano, as: 'President'},
					{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
					{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
						{model: app.get('models').PETiano, as: 'PETiano'}
					]}
				]
			}
		)
		.then(function(result)
		{
			res.json(result);
		})
		.catch(function(result) {
				res.status(500);
				return res.send('Internal server error');
		});
});

router.get('/', function(req, res)
{
	app
		.get('models')
		.RecordOfMeeting
		.findOne(
			{
				include: [
					{model: app.get('models').PETiano, as: 'Ateiro'},
					{model: app.get('models').PETiano, as: 'President'},
					{model: app.get('models').AgendaPoint, as: 'AgendaPoints'},
					{model: app.get('models').AbsentOrLate, as: 'AbsentsOrLates', include: [
						{model: app.get('models').PETiano, as: 'PETiano'}
					]}
				],
				order: [['Id', 'DESC']]
			}
		)
		.then(function(result)
			{
				return res.json(result.toJSON());
			}
		)
		.catch(function(result)
			{
				res.status(500);
				return res.send('Internal server error');
			}
		);
});

router.post('/updateAteiroOrPresident', function(req, res) {
	app
		.get('models')
		.RecordOfMeeting
		.update({AteiroId: req.body.AteiroId, PresidentId: req.body.PresidentId}, {where: {Id: req.body.Id}})
		.then((result) => {
			if(!result[0])
			{
				res.status(500);
				return res.send({message: 'Erro interno'});
			}
			return res.end();
		})
		.catch((err) => {
			res.status(500);
			return res.send({message: 'Erro interno'});
		});
});

router.post('/save/:recordOfMeetingId', function(req, res) {
	app
		.get('models')
		.RecordOfMeeting
		.update(
			{Status: 2},
			{
				where: {Id: req.params.recordOfMeetingId, Status: 1}
			})
		.then((result) => {
			if(result[0])
			{
					res.end();
					app
						.get('models')
						.RecordOfMeeting
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
						.then((result)=>{
							var transp = app.get('mailTransporter')
							if(transp && process.env.EMAIL_DESTINY
								&& process.env.EMAIL)
							{
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
			}
			else
			{
				res.status(403);
				res.send({message: 'Nada a alterar'});
			}
		})
		.catch((err) => {
			res.status(500);
			return res.send({message: 'Erro interno'});
		});
});

router.get('/:id/download', (req, res) => {
	app
		.get('models')
		.RecordOfMeeting
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
	app
		.get('models')
		.RecordOfMeeting
		.findOne(
			{
				include: [
					{model: app.get('models').PETiano, as: 'Ateiro'},
					{model: app.get('models').PETiano, as: 'President'},
					{model: app.get('models').AgendaPoint, as: 'AgendaPoints'}
				],
				order: [['Id', 'DESC']]
			}
		)
		.then(function(result) {
			if(result.Status != 2)
				 return res.status(403).json({message: 'Ata ainda aberta.'});
			app
				.get('models')
				.RecordOfMeeting
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
