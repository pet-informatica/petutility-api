var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var nodemailer = require('nodemailer');

//gets

router.get('/getPockets', function(req, res) {
	app.get('models')
		.Pocket
		.findAll()
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

//posts

router.post('/createPocket', function(req, res) {
	var pocket = req.body;
	var userType = req.user.Profile;
	if(userType == 2) {
		app.get('models').Pocket.create(pocket)
		.then(function(data) {
			var transp = app.get('mailTransporter');
			if(transp && process.env.EMAIL_DESTINY
				&& process.env.EMAIL)
				transp
					.sendMail({
						from: '"PETUtility" <' + process.env.EMAIL + '>',
						to: process.env.EMAIL_DESTINY,
						subject: 'PETUtility - Saiu uma bolsa!',
						text: 'Aviso do PETUtility!\nSaiu a bolsa referente a ' + pocket.Month + '/' + pocket.Year + '.'
					}, function(err, info) {
						if(err)
							console.log(err);
					});
			res.json(data.toJSON());
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
	} else {
		res.status(500).send("Usuário não tem acesso.")
	}
});

router.post('/updatePocket', function(req, res) {
	var newPocket = req.body;
	var pocket;
	if(req.user.Profile == 2) {
		app.get('models').Pocket.findById(newPocket.Id)
		.then(function(p) {
			pocket = p;
			if(newPocket.Month)
			pocket.set('Month', newPocket.Month);
			if(newPocket.Year)
			pocket.set('Year', newPocket.Year);
			if(newPocket.Date)
			pocket.set('Date', newPocket.Date);
			pocket.save()
			.then(function(result) {
				res.json(result.toJSON());
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			})
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
	} else {
		res.status(500).send("Usuário não pode realizar operação.");
	}
});

//deletes

router.delete('/deletePocket', function(req, res) {
	var pocket = req.query;
	if(req.user.Profile == 2) {
		app.get('models')
		.Pocket
		.destroy({where: {Id: pocket.Id}})
		.then(function(data) {
			res.end();
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
	} else {
		res.status(500).send("Usuário não pode realizar operação.");
	}
});

module.exports = router;
