const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const Spending = app.get('models').Spending;
const PigPET = app.get('models').PigPET;

router.get('/', function(req, res) {
	Spending
		.findAll()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
});

router.post('/', function(req, res) {
	var spending = req.body;
	Spending
		.create(spending)
		.then(function(data) {
			if(spending.Status == 1) {
				var pigpet;
				PigPET
					.findAll()
					.then((p) => {
						pigpet = p[0];
						pigpet.set('Balance', parseFloat(pigpet.Balance) - parseFloat(spending.Value));
						pigpet
							.save()
							.then((result) => {
								res.status(201).json({'pigpet': result, 'spending': r});
							})
							.catch((err) => {
								res.status(500).send(err.message);
							});
					})
					.catch((err) => {
						res.status(500).send(err.message);
					});
			} else {
				res.status(201).json(data.toJSON());
			}
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
});

router.put('/:spendingId', function(req, res) {
	var newSpending = req.body;
	var spending;
	Spending
		.findById(req.params.spendingId)
		.then(function(s) {
			spending = s;
			if(newSpending.Description)
				spending.set('Description', newSpending.Description);
			if(newSpending.Value)
				spending.set('Value', newSpending.Value);
			if(newSpending.Date)
				spending.set('Date', newSpending.Date);
			spending
				.save()
				.then(function(result) {
					res.json(result.toJSON);
				})
				.catch(function(err) {
					res.status(500).send(err.message);
				});
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

router.post('/:spendingId/accept', function(req, res) {
	var newSpending = req.body;
	var spending;
	if(req.user.Profile == 2) {
		Spending
			.findById(req.params.spendingId)
			.then(function(s) {
				spending = s;
				spending.set('Status', 1);
				var value = spending.Value;
				spending
				.save()
				.then(function(r) {
					var pigpet;
					PigPET
					.findAll()
					.then(function(p) {
						pigpet = p[0];
						pigpet.set('Balance', parseFloat(pigpet.Balance) - parseFloat(value));
						pigpet.save()
						.then((result) => {
							res.status(200).json({'pigpet': result, 'spending': r});
						})
						.catch((err) => {
							res.status(500).send(err.message);
						});
					});
				})
				.catch((err) => {
					res.status(500).send(err.message);
				});
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	} else {
		res.status(500).json({message: "Usuário não pode realizar operação."});
	}
});

router.delete('/:spendingId', function(req, res) {
	var spending = req.query;
	Spending
		.destroy({where: {Id: req.params.spendingId}})
		.then(function(data) {
			if(spending.Status == 1) {
				var pigpet;
				PigPET.findAll()
					.then(function(p) {
						pigpet = p[0];
						pigpet.set('Balance', parseFloat(pigpet.Balance) + parseFloat(spending.Value));
						pigpet.save()
						.then((result) => {
							res.end();
						})
						.catch((err) => {
							res.status(500).send(err.message);
						})
					})
				.catch((err) => {
					res.status(500).send(err.message);
				});
			}
			res.end();
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
});

module.exports = router;
