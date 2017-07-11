const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const nodemailer = require('nodemailer');
const Pocket = app.get('models').Pocket;

router.get('/', function(req, res) {
	Pocket
	.findAll()
	.then(function(result) {
		res.json(result);
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	});
});

router.use(function(req, res, next) {
	if(req.user.Profile == 2)
		next();
	else
		res.status(500).json({message: "Usuário não pode realizar operação."});
});

router.post('/', function(req, res) {
	var pocket = req.body;
	Pocket
	.create(pocket)
	.then(function(data) {
		var transporter = app.get('mailTransporter');
		if(transporter && process.env.EMAIL_DESTINY && process.env.EMAIL) {
			transporter.sendMail({
				from: '"PETUtility" <' + process.env.EMAIL + '>',
				to: process.env.EMAIL_DESTINY,
				subject: 'PETUtility - Saiu uma bolsa!',
				text: 'Aviso do PETUtility!\nSaiu a bolsa referente a ' + pocket.Month + '/' + pocket.Year + '.'
			}, function(err, info) {
				if(err) console.log(err);
			});
		}
		res.stats(201).json(data.toJSON());
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	});
});

router.put('/:pocketId', function(req, res) {
	var newPocket = req.body;
	Pocket
	.findById(req.params.pocketId)
	.then(function(p) {
		var pocket = p;
		if(newPocket.Month)
			pocket.set('Month', newPocket.Month);
		if(newPocket.Year)
			pocket.set('Year', newPocket.Year);
		if(newPocket.Date)
			pocket.set('Date', newPocket.Date);
		pocket
		.save()
		.then(function(result) {
			res.json(result.toJSON());
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	});
});

router.delete('/:pocketId', function(req, res) {
	Pocket
	.destroy({where: {Id: req.params.pocketId}})
	.then(function(data) {
		res.end();
	})
	.catch(function(err) {
		res.status(500).json({message: err.message});
	});
});

module.exports = router;
