const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const AgendaPoint = app.get('models').AgendaPoint;

router.delete('/:agendaPointId', function(req, res) {
	AgendaPoint
		.destroy({where: {Id: req.params.agendaPointId}})
		.then(function(data) {
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		});
});

router.post('/', function(req, res) {
	if(!req.body.Title)
		return res.status(403).send('Título exigido');
	req.body.PETianoId = req.user.Id;
	AgendaPoint
		.create(req.body)
		.then(function(data) {
			res.json(data.toJSON());
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		});
});

router.put('/:agendaPointId', function(req, res) {
	if(req.body.Title && req.body.Title === '')
	{
		res.status(403);
		return res.send({message: 'Título exigido'});
	}
	AgendaPoint
		.update(req.body, {where: {Id: req.params.agendaPointId}, returning: true})
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
