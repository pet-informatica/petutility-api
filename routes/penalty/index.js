var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var nodemailer = require('nodemailer');

//gets

router.get('/getPenalties', function(req, res) {
	app.get('models')
		.Penalty
		.findAll({where: {PETianoId: req.user.Id}})
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

router.get('/getAllPenalties', function(req, res) {
	app.get('models')
		.Penalty
		.findAll()
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

//posts

router.post('/createPenalty', function(req, res) {
	var penalty = req.body.penalty;
	var email = req.body.PETianoEmail;
	app.get('models').Penalty.create(penalty)
	.then(function(data) {
		var transp = app.get('mailTransporter');
		if(transp && process.env.EMAIL)
			transp
				.sendMail({
					from: '"PETUtility" <' + process.env.EMAIL + '>',
					to: email,
					subject: 'PETUtility - Multa',
					text: 'Aviso do PETUtility!\nVocê recebeu uma multa com valor R$' + penalty.Value + ' (Motivo: ' + penalty.PenaltyJustification + ').'
				}, function(err, info) {
					if(err)
						console.log(err);
				});
		res.json(data.toJSON());
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
});

router.post('/updatePenalty', function(req, res) {
	var newPenalty = req.body;
	app.get('models').Penalty.findById(newPenalty.Id)
	.then(function(penalty) {
		if(newPenalty.Value)
			penalty.set('Value', newPenalty.Value);
		if(newPenalty.Date)
			penalty.set('Date', newPenalty.Date);
		if(newPenalty.PenaltyJustification)
			penalty.set('PenaltyJustification', newPenalty.PenaltyJustification);
		penalty.save()
		.then(function(result) {
			res.json(result.toJSON());
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		})
	})
});

router.post('/changePenaltyStatus', function(req, res) {
	var penalty = req.body;
	var userType = req.user.Profile;
	if(userType == 2) {
		app.get('models').Penalty.findById(penalty.Id)
		.then(function(p) {
			if(penalty.Status)
			p.set('Status', penalty.Status);
			p.save()
			.then(function(result) {
				res.json(result.toJSON());
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			})
		})
	} else {
		res.status(500).send("Usuário não tem acesso.");
	}
});

//deletes

router.delete('/deletePenalty', function(req, res) {
	var penalty = req.query;
	app.get('models')
	.Penalty
	.destroy({where: {Id: penalty.Id}})
	.then(function(data) {
		res.end();
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
});

module.exports = router;
