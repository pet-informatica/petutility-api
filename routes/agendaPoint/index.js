var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();


router.delete('/:agendaPointId/delete', function(req, res) {
	app.get('models')
		.AgendaPoint
		.destroy({where: {Id: req.params.agendaPointId}})
		.then(function(data) {
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		});
});

router.post('/create', function(req, res) {
	if(!req.body.Title)
		return res.status(403).send('Título exigido');
	req.body.PETianoId = req.user.Id;
	app.get('models')
		.AgendaPoint
		.create(req.body)
		.then(function(data) {
			res.json(data.toJSON());
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		});
})

router.get('/users', function(req, res) {
	app.get('models')
		.AgendaPoint
		.findAll({where: {PETianoId: req.user.Id, Status: 1}})
		.then((result) => {
			res.json(result).end();
		})
		.catch((err) => {
			res.status(500).send('Erro interno');
		})
})

router.post('/:agendaPointId/update', function(req, res) {
	if(req.body.Title && req.body.Title === '')
	{
		res.status(403);
		return res.send({message: 'Título exigido'});
	}
	app.get('models')
		.AgendaPoint
		.update(
			req.body,
			{where: {Id: req.params.agendaPointId}, returning: true})
		.then((data) => {
			res.json(data[1][0].toJSON());
			return res.end();
		})
		.catch((err) => {
			res.status(500);
			return res.send({message: 'Erro interno'});
		})
});

module.exports = router;
