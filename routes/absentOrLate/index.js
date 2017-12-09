const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const parallel = require('async/parallel');
const AbsentOrLate = app.get('models').AbsentOrLate;

router.post('/', (req, res) => {
	parallel([
		(callback) => {
			AbsentOrLate
				.destroy({
					where: {
						RecordOfMeetingId: req.body.RecordOfMeetingId,
						PETianoId: req.body.PETianoId
					}
				})
				.then(function(result) {
					callback(null, result);
				})
				.catch(function(err) {
					callback(err);
				});
		},
		(callback) => {
			AbsentOrLate
				.create(req.body)
				.then(function(result) {
					callback(null, result);
				})
				.catch(function(err) {
					callback(err);
				});
		}
	], (err, results) => {
		if (err) {
			res.status(500).json({message: 'Erro interno'});
			return;
		}
		res.status(201).json(results[1].toJSON());
	});

});

router.put('/:id', (req, res) => {
	AbsentOrLate
		.update(
			req.body,
			{where: {Id: req.params.id}, returning: true})
		.then(function(result) {
			res.status(200).json(result[1][0].toJSON());
		})
		.catch(function(err) {
			res.status(500).json({message: 'Erro interno'});
		})
});

router.delete('/:id', (req, res) => {
	AbsentOrLate
		.destroy({where: {Id: req.params.id}})
		.then(function() {
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.end();
		})
});

module.exports = router
