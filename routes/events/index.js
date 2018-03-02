const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const Event = app.get('models').Event;

router.get('/', (req, res) => {
	Event
		.findAll()
		.then(events => res.status(200).json(events))
		.catch(err => res.status(500).send('Internal server error'));
});

router.post('/', (req, res) => {
	Event
		.create({
			Title: req.body.Title,
			Start: req.body.Start,
			End: req.body.End,
			PETianoId: req.user.Id
		})
		.then(event => res.status(201).json(event))
		.catch(err => res.status(500).send('Internal server error'));
});

router.put('/:eventId', (req, res) => {
	Event
		.update({
			Title: req.body.Title,
			Start: req.body.Start,
			End: req.body.End
		},
		{
			where: {
				Id: req.params.eventId
			},
			returning: true
		})
		.then(event => res.status(200).json(event[1][0]))
		.catch(err => res.status(500).send('Internal server error'));
});

router.delete('/:eventId', (req, res) => {
	Event
		.destroy({
			where: {
				Id: req.params.eventId
			}
		})
		.then(result => res.end())
		.catch(err => res.status(500).send('Internal server error'));
});

module.exports = router;
