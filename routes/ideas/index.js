var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var Idea = app.get('models').Idea;

router.get('/', function(req, res) {
	Idea
		.findAll({})
		.then((ideas) => {
			res.status(200).json(ideas);
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		});
});

router.post('/', function(req, res) {
	Idea
		.create(req.body)
		.then((data) => {
			res.status(200).json(data.toJSON());
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		});
});

router.put('/:ideaId', function(req, res) {
	if(req.body.Title && req.body.Title === '')
		return res.status(403).send({message: 'Título exigido'});
	Idea
		.update(req.body, {
			where: {
				Id: req.params.ideaId
			},
			returning: true
		}).then((data) => {
			res.json(data[1][0].toJSON());
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		})
});

router.delete('/:ideaId', function(req, res) {
	Idea
		.destroy({where: {Id: req.params.ideaId}})
		.then((data) => {
			res.end();
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		});
});

module.exports = router;
