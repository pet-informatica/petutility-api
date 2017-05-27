const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const nodemailer = require('nodemailer');
const Penalty = app.get('models').Penalty;

router.get('/', function(req, res) {
	var query = {};
	if(req.user.Profile !== 2)
		query.where = {PETianoId: req.user.Id};
	Penalty
		.findAll(query)
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
});

router.post('/', function(req, res) {
	var penalty = req.body.penalty;
	var email = req.body.PETianoEmail;
	Penalty
	.create(penalty)
	.then(function(data) {
		var transp = app.get('mailTransporter');
		if(transp && process.env.EMAIL) {
			transp.sendMail({
				from: '"PETUtility" <' + process.env.EMAIL + '>',
				to: email,
				subject: 'PETUtility - Multa',
				text: 'Aviso do PETUtility!\n'+
							'Você recebeu uma multa com valor R$' + penalty.Value +
							' (Motivo: ' + penalty.PenaltyJustification + ').'
			}, function(err, info) {
				if(err)
					console.log(err);
			});
		}
		res.json(data.toJSON());
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	});
});

router.put('/:penaltyId', function(req, res) {
	var newPenalty = req.body;
	Penalty
	.findById(req.params.penaltyId)
	.then(function(penalty) {
		if(newPenalty.Value)
			penalty.set('Value', newPenalty.Value);
		if(newPenalty.Date)
			penalty.set('Date', newPenalty.Date);
		if(newPenalty.PenaltyJustification)
			penalty.set('PenaltyJustification', newPenalty.PenaltyJustification);
		if(newPenalty.Status && req.user.Profile === 2)
			penalty.set('Status', newPenalty.Status);
		penalty
		.save()
		.then(function(result) {
			res.json(result.toJSON());
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		})
	})
});

router.delete('/:penaltyId', function(req, res) {
	Penalty
	.destroy({where: {Id: req.params.penaltyId}})
	.then(function(data) {
		res.end();
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	})
});

module.exports = router;
