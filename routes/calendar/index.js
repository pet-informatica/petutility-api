var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var Sequelize = require('sequelize');


router.get('/', function(req, res)
{
	app
		.get('models')
		.Event
		.findAll({
			where:{
				start:{
					$between: [req.query.s, req.query.e]
				}
			}
		})
		.then(function(result)
			{
				res.send(result);
			}
		)
		.catch(function(result)
			{
				res.status(500);
				res.send('Internal server error');
			}
		);
});

router.post('/save', function(req, res)
{
	app
		.get('models')
		.Event
		.create(
			{
				title: req.body.title,
				start: req.body.start,
				time: req.body.time,
				PETianoId: req.user.Id
			}
			)
		.then((result) => {
			res.send(result.toJSON());
		})
		.catch(function(result)
			{
				res.status(500);
				res.send('Internal server error');
			}
		);
});

router.put('/update/:eventId', function(req, res)
{
	app
		.get('models')
		.Event
		.update(
			{
				title: req.body.eventTitle,
				start: req.body.start,
				time: req.body.time
			},
			{
				where: {Id: req.params.eventId}, returning: true
			}
			)
		.then((result) => {
			res.status(200).end();
		})
		.catch(function(result)
			{
				res.status(500);
				res.send('Internal server error');
			}
		);
});

router.delete('/delete/:eventId', function(req, res)
{
	app
		.get('models')
		.Event
		.destroy(
			{
				where: {Id: req.query.Id}
			}
			)
		.then((result) => {
			res.status(200).end();
		})
		.catch(function(result)
			{
				res.status(500);
				res.send('Internal server error');
			}
		);
});

module.exports = router;
