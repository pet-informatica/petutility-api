const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const Sequelize = require('sequelize');
const Event = app.get('models').Event;

router.get('/', function(req, res) {
	Event
		.findAll({
			where:{
				start:{
					$between: [req.query.s, req.query.e]
				}
			}
		})
		.then(function(result) {
				res.send(result);
			}
		)
		.catch(function(result) {
				res.status(500);
				res.send('Internal server error');
			}
		);
});

router.post('/', function(req, res) {
	Event
		.create({
			title: req.body.title,
			start: req.body.start,
			time: req.body.time,
			PETianoId: req.user.Id
		})
		.then(function(result) {
			res.send(result.toJSON());
		})
		.catch(function(result) {
			res.status(500);
			res.send('Internal server error');
		});
});

router.put('/:eventId', function(req, res) {
	Event
		.update({
			title: req.body.eventTitle,
			start: req.body.start,
			time: req.body.time
		},
		{
			where: {Id: req.params.eventId}, returning: true
		})
		.then(function(result) {
			res.status(200).end();
		})
		.catch(function(result) {
			res.status(500);
			res.send('Internal server error');
		});
});

router.delete('/:eventId', function(req, res) {
	Event
		.destroy({
			where: {Id: req.query.Id}
		})
		.then(function(result) {
			res.status(200).end();
		})
		.catch(function(result) {
				res.status(500);
				res.send('Internal server error');
		});
});

module.exports = router;
