const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const parallel = require('async/parallel');

router.post('/', function(req, res) {
	parallel([
		(callback) => {
			app
				.get('models')
				.AbsentOrLate
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
			app
				.get('models')
				.AbsentOrLate
				.create(req.body)
				.then(function(result) {
					callback(null, result);
				})
				.catch(function(err) {
					callback(err);
				});
		}
	], (err, results) => {
		if(err)
		{
			res.status(500);
			res.send({message: 'Erro interno'});
			return;
		}
		res.json(results[1].toJSON());
		res.end();
	});

});

router.put('/:id', function(req, res) {
	app
		.get('models')
		.AbsentOrLate
		.update(
			req.body,
			{where: {Id: req.params.id}, returning: true})
		.then(function(result) {
			res.json(result[1][0].toJSON());
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		})
});

router.delete('/:id', function(req, res) {
	app
		.get('models')
		.AbsentOrLate
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
