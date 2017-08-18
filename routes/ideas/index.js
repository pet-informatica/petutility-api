const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const Idea = app.get('models').Idea;

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
		.create({
			Title: req.body.Title,
			Description: req.body.Description,
			PETianoId: req.user.Id,
		})
		.then((data) => {
			res.status(200).json(data.toJSON());
		})
		.catch((err) => {
			res.status(500).send({message: 'Erro interno'});
		});
});

router.put('/:ideaId', function(req, res) {
	if(req.body.Title === undefined || req.body.Title === '')
		return res.status(403).send({message: 'Título exigido'});
	Idea
		.update({
			Title: req.body.Title,
			Description: req.body.Description
		}, 
		{
			where: {
				Id: req.params.ideaId
			},
			returning: true
		}).then(idea => res.json(idea[1][0]))
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
