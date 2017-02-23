var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();

router.get('/', function(req, res) {
	app.get('models')
		.Idea
		.findAll()
		.then((result) => {
			res.json({ideas: result}).end();
		})
		.catch((err) => {
			res.status(500).send('Erro interno');
		})
})

router.post('/create', function(req, res) {
	app.get('models')
		.Idea
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

router.post('/:ideaId/update', function(req, res) {
	if(req.body.Title && req.body.Title === '')
	{
		res.status(403);
		return res.send({message: 'Título exigido'});
	}
	app.get('models')
		.Idea
		.update(
			req.body,
			{where: {Id: req.params.ideaId}, returning: true})
		.then((data) => {
			res.json(data[1][0].toJSON());
			return res.end();
		})
		.catch((err) => {
			res.status(500);
			return res.send({message: 'Erro interno'});
		})
});

router.delete('/:ideaId/delete', function(req, res) {
	app.get('models')
		.Idea
		.destroy({where: {Id: req.params.ideaId}})
		.then(function(data) {
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		});
});

module.exports = router;
