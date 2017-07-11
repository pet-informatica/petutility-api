const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const nodemailer = require('nodemailer');
const PigPET = app.get('models').PigPET;

router.get('/', function(req, res) {
	PigPET
	.findById(1)
	.then(function(result) {
		res.status(200).json(result);
	})
	.catch(function(err) {
		res.status(500).json({message:err.message});
	});
});

router.put('/', function(req, res) {
	var newPigpet = req.body.pigpet;
	var reason = req.body.reason;
	var pigpet;
	PigPET
	.findById(1)
	.then(function(p) {
		pigpet = p;
		pigpet.set('Balance', newPigpet.Balance);
		pigpet.save()
		.then(function(result) {
			var transporter = app.get('mailTransporter');
			if(transporter && process.env.EMAIL_DESTINY && process.env.EMAIL) {
				transporter.sendMail({
					from: '"PETUtility" <' + process.env.EMAIL + '>',
					to: process.env.EMAIL_DESTINY,
					subject: 'PETUtility - Valor do PigPET alterado',
					text: 'Aviso do PETUtility!\nO valor do PigPET foi alterado para: ' + newPigpet.Balance + '.\nMotivo da alteração manual: ' + reason + '.'
				}, function(err, info) {
					if(err) console.log(err);
				});
			}
			res.status(200).json(result.toJSON());
		})
		.catch(function(err) {
			res.status(500).json({message:err.message});
		});
	})
	.catch(function(err) {
		res.status(500).json({message:err.message});
	});
});

module.exports = router;
