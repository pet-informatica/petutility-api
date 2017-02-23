var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var nodemailer = require('nodemailer');

//gets

router.get('/getPigPetBalance', function(req, res) {
	app.get('models')
		.PigPET
		.findById(1)
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

//posts

router.post('/updatePigPetBalance', function(req, res) {
	var newPigpet = req.body.pigpet;
	var reason = req.body.reason;
	var pigpet;
	app.get('models').PigPET.findById(newPigpet.Id)
	.then(function(p) {
		pigpet = p;
		pigpet.set('Balance', newPigpet.Balance);
		pigpet.save()
		.then(function(result) {
			var transp = app.get('mailTransporter');
			if(transp && process.env.EMAIL_DESTINY
				&& process.env.EMAIL)
				transp
					.sendMail({
						from: '"PETUtility" <' + process.env.EMAIL + '>',
						to: process.env.EMAIL_DESTINY,
						subject: 'PETUtility - Valor do PigPET alterado',
						text: 'Aviso do PETUtility!\nO valor do PigPET foi alterado para: ' + newPigpet.Balance + '.\nMotivo da alteração manual: ' + reason + '.'
					}, function(err, info) {
						if(err)
							console.log(err);
					});
			res.json(result.toJSON());
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	});
});

module.exports = router;
