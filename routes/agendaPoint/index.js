const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const AgendaPoint = app.get('models').AgendaPoint;
const RecordOfMeeting = app.get('models').RecordOfMeeting;

router.get('/', (req, res) => {
	AgendaPoint
		.findAll({where: {PETianoId: req.user.Id, Status: 1, RecordOfMeetingId: null}})
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

router.post('/', (req, res) => {
	var data = {
		Title: req.body.Title,
		Description: req.body.Description,
		Status: req.body.Status,
		PETianoId: req.user.Id
	}
	if (data.Title === undefined || data.Title === '')
		return res.status(403).send('Titulo exigido');
	RecordOfMeeting
		.findOne({where: {Status: 1}})
		.then((record) => {
			if (record && record.Id)
				data.RecordOfMeetingId = record.Id;
			AgendaPoint
				.create(data)
				.then((a) => {
					res.status(201).json(a);
				})
				.catch((err) => {
					res.status(500).json({message: 'Erro interno'});
				});
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

router.put('/:agendaPointId', (req, res) => {
	var data = {
		Title: req.body.Title,
		Description: req.body.Description,
		Status: req.body.Status,
		RecordOfMeetingId: req.body.RecordOfMeetingId,
		PETianoId: req.user.Id
	}
	if (!(Number.isInteger(Number(data.RecordOfMeetingId))))
		return res.status(400).json({message: 'RecordOfMeetingId exigido'});
	for (var param in data)
		if (data.hasOwnProperty(param))
			if (data[param] === undefined || data[param] === '' || data[param] === null)
				delete data[param];
	RecordOfMeeting
		.findOne({where: {Id: Number(data.RecordOfMeetingId), Status: 1}})
		.then((record) => {
			if (record && record.Id) {
				AgendaPoint
					.update(data, {where: {Id: req.params.agendaPointId}, returning: true})
					.then((data) => {
						if(data[0] === 1) {
							res.status(200).json(data[1][0].toJSON());
						} else {
							res.status(404).json({message: 'Ponto de ata nao encontrado'});
						}
					})
					.catch((err) => {
						res.status(500).json({message: 'Erro interno'});
					});
			} else {
				res.status(400).json({message: 'Não existe ata aberta com esse id'});
			}
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

router.delete('/:agendaPointId', (req, res) => {
	RecordOfMeeting
		.findOne({where: {Status: 1}})
		.then((record) => {
			if (record && record.Id) {
				AgendaPoint
					.destroy({where: {Id: req.params.agendaPointId, RecordOfMeetingId: record.Id}})
					.then((data) => {
						if (data === 1)
							res.end();
						else
							res.status(400).json({message: 'Ponto não encontrado'});
					})
					.catch((err) => {
						res.status(500).json({message: 'Erro interno'});
					});
			} else {
				res.status(400).json({message: 'Não existe ata aberta'});
			}
		})
		.catch((err) => {
			res.status(500).json({message: 'Erro interno'});
		});
});

module.exports = router;
