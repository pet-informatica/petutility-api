var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
var multer = require('multer');

//parser for cloudinary
var parser = multer({
	storage: cloudinaryStorage({
		cloudinary: cloudinary,
		folder: 'payments',
		filename: function(req, file, cb) {
			var date = new Date();
			cb(undefined, file.originalname + "_" + date.getDate() + "_" + date.getMonth() + "_"
					+ date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds());
		}
	})
});

//gets

router.get('/getPendingPaymentsPigPet', function(req, res) {
	var userType = req.user.Profile;
	if(userType == 2) {
		app.get('models')
			.Payment
			.findAll({where: {Status: 3}})
			.then(function(result) {
				res.json(result);
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			});
	} else {
		res.status(500).send('Usuário não tem acesso');
	}
});

router.get('/getPayments', function(req, res)
{
	app.get('models')
		.Payment
		.findAll(
			{where : {PETianoId: req.user.Id}})
		.then(function(result)
		{
			var ret = {arr: result};
			res.json(ret);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

//posts

router.post('/createPayment', function(req, res){
	var uploader = parser.single('Photo');
	uploader(req, res, function(err) {
		if(err) {
			res.status(500).send(err.message);
		} else {
			var payment = req.body;
			if(req.file.secure_url)
				payment.Photo =  req.file.secure_url + '?f=auto';
			var createdPayment = app.get('models').Payment.create(payment)
			.then(function(data) {
				res.json(data.toJSON());
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err.message);
			});
		}
	})

});

router.post('/acceptPayment', function(req, res) {
	var newPayment = req.body;
	var payment;
	var userType = req.user.Profile;
	if(userType == 2) {
		app.get('models').Payment.findById(newPayment.Id)
		.then(function(re) {
			payment = re;
			payment.set('Status', 1);
			var value = payment.Value;
			payment.save()
			.then(function(result) {
				var pigpet;
				app.get('models').PigPET.findAll()
				.then(function(p) {
					pigpet = p[0];
					console.log("balanceeeeeee " + pigpet.Balance + " valueee " + value);
					pigpet.set('Balance', parseFloat(pigpet.Balance) + parseFloat(value));
					pigpet.save()
					.then(function(r) {
						res.json({'pigpet': r, 'payment': result});
					})
					.catch(function(err) {
						res.status(500).send(err.message);
					})
				})
			})
			.catch(function(err) {
				res.status(500).send(err.message);
			})
		})
		.catch(function(err){
			res.status(500).send(err.message);
		})
	} else {
		res.status(500).send("Usuário não tem acesso.")
	}
});

router.post('/updatePayment', function(req, res) {
	var uploader = parser.single('Photo');
	uploader(req, res, function(err) {
		if(err) {
			res.status(500).send(err.message);
		} else {
			var newPayment = req.body;
			var payment;
			app.get('models').Payment.findById(newPayment.Id)
			.then(function(p) {
				payment = p;
				if(payment.Status == 1) {
					res.status(500).send("Pagamento já foi aceito e não pode ser modificado");
				} else {
					if(newPayment.Type)
						payment.set('Type', newPayment.Type);
					if(newPayment.Value)
						payment.set('Value', newPayment.Value);
					if(newPayment.Date)
						payment.set('Date', newPayment.Date);
					if(newPayment.Notes)
						payment.set('Notes', newPayment.Notes);
					if(newPayment.Instrument)
						payment.set('Instrument', newPayment.Instrument);
					if(newPayment.Ids)
						payment.set('Ids', newPayment.Ids);
					if(newPayment.PenaltyJustification)
						payment.set('PenaltyJustification', newPayment.PenaltyJustification);
					if(newPayment.RefusedJustification)
						payment.set('RefusedJustification', newPayment.RefusedJustification);
					if(newPayment.Status)
						payment.set('Status', newPayment.Status);
					else {
						if(req.user.Profile != 2)
						payment.set('Status', 4);
					}
					if(req.file.secure_url)
						payment.set('Photo', req.file.secure_url + '?f=auto');

					payment.save()
					.then(function(result) {
						res.json(result.toJSON());
					})
					.catch(function(err) {
						console.log("in1");
						res.status(500).send(err.message);
					});
				}
			})
			.catch(function(err) {
				console.log("in2");
				res.status(500).send(err.message);
			});
		}
	});
});

//deletes

router.delete('/deletePayment', function(req, res) {
	var payment = req.query;
	app.get('models')
	.Payment
	.destroy({where: {Id : payment.Id}})
	.then(function(data) {
		res.end();
	})
	.catch(function(err) {
		res.status(500).send(err.message);
	})
})

module.exports = router;
