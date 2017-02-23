var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();

//gets

router.get('/getSpendings', function(req, res) {
	app.get('models')
		.Spending
		.findAll()
		.then(function(result) {
			res.json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

//posts

router.post('/createSpending', function(req, res) {
	var spending = req.body;
	app.get('models').Spending.create(spending)
	.then(function(data) {
		if(spending.Status == 1) {
			var pigpet;
			app.get('models').PigPET.findAll()
			.then(function(p) {
				pigpet = p[0];
				pigpet.set('Balance', parseFloat(pigpet.Balance) - parseFloat(spending.Value));
				pigpet.save()
				.then(function(result) {
					res.json({'pigpet': result, 'spending': r});
				})
				.catch(function(err) {
					res.status(500).send(err.message);
				})
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			});
		}
		res.json(data.toJSON());
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
});

router.post('/updateSpending', function(req, res) {
	var newSpending = req.body;
	var spending;
	app.get('models').Spending.findById(newSpending.Id)
	.then(function(s) {
		spending = s;
		if(newSpending.Description)
			spending.set('Description', newSpending.Description);
		if(newSpending.Value)
			spending.set('Value', newSpending.Value);
		if(newSpending.Date)
			spending.set('Date', newSpending.Date);
		spending.save()
		.then(function(result) {
			res.json(result.toJSON);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		})
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
});

router.post('/acceptSpending', function(req, res) {
	var newSpending = req.body;
	var spending;
	if(req.user.Profile == 2) {
		app.get('models').Spending.findById(newSpending.Id)
		.then(function(s) {
			spending = s;
			spending.set('Status', 1);
			var value = spending.Value;
			spending.save()
			.then(function(r) {
				var pigpet;
				app.get('models').PigPET.findAll()
				.then(function(p) {
					pigpet = p[0];
					pigpet.set('Balance', parseFloat(pigpet.Balance) - parseFloat(value));
					pigpet.save()
					.then(function(result) {
						res.json({'pigpet': result, 'spending': r});
					})
					.catch(function(err) {
						res.status(500).send(err.message);
					})
				})
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			});
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		})
	} else {
		res.status(500).send("Usuário não pode realizar operação.");
	}
});

//deletes

router.delete('/deleteSpending', function(req, res) {
	var spending = req.query;
	app.get('models')
	.Spending
	.destroy({where: {Id: spending.Id}})
	.then(function(data) {
		if(spending.Status == 1) {
			var pigpet;
			app.get('models').PigPET.findAll()
				.then(function(p) {
					pigpet = p[0];
					pigpet.set('Balance', parseFloat(pigpet.Balance) + parseFloat(spending.Value));
					pigpet.save()
					.then(function(result) {
						res.end();
					})
					.catch(function(err) {
						res.status(500).send(err.message);
					})
				})
			.catch(function(err) {
				res.status(500).send(err.message);
			});
		}
		res.end();
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
});

module.exports = router;
