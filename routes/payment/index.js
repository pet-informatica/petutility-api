const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const Payment = app.get('models').Payment;
const PigPET = app.get('models').PigPET;

//parser for cloudinary
const parser = multer({
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

router.get('/', function(req, res) {
	var userType = req.user.Profile;
	var query = {where: {}};
	if(userType !== 2)
		query.where.PETianoId = req.user.Id;
	Payment
		.findAll(query)
		.then(function(result) {
			res.status(200).json(result);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

router.get('/:paymentId', function(req, res) {
	var userType = req.user.Profile;
	var query = {where: {Id: req.params.paymentId}};
	if(userType !== 2)
		query.where.PETianoId = req.user.Id;
	Payment
		.findOne(query)
		.then(function(result) {
			res.status(200).json(result);
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
});

router.post('/', function(req, res) {
	var uploader = parser.single('Photo');
	uploader(req, res, function(err) {
		if(err) {
			res.status(500).send(err.message);
		} else {
			var payment = req.body;
			if(req.file && req.file.secure_url)
				payment.Photo =  req.file.secure_url + '?f=auto';
			Payment
				.create(payment)
				.then(function(data) {
					res.status(201).json(data.toJSON());
				})
				.catch(function(err) {
					res.status(500).json({message: err.message});
				});
		}
	})

});

router.post('/:paymentId/accept', function(req, res) {
	var newPayment = req.body;
	var payment;
	var userType = req.user.Profile;
	if(userType == 2) {
		Payment
			.findById(req.params.paymentId)
			.then(function(re) {
				payment = re;
				payment.set('Status', 1);
				var value = payment.Value;
				payment
					.save()
					.then(function(result) {
						var pigpet;
						PigPET
							.findAll()
							.then(function(p) {
								pigpet = p[0];
								pigpet.set('Balance', parseFloat(pigpet.Balance) + parseFloat(value));
								pigpet
									.save()
									.then(function(r) {
										res.status(200).json({'pigpet': r, 'payment': result});
									})
									.catch(function(err) {
										res.status(500).json({message: err.message});
									});
							})
							.catch(function(err) {
								res.status(500).json({message: err.message});
							});
					})
					.catch(function(err) {
						res.status(500).json({message: err.message});
					});
			})
			.catch(function(err){
				res.status(500).json({message: err.message});
			});
	} else {
		res.status(500).json({message: "Usuário não tem acesso."});
	}
});

router.put('/:paymentId', function(req, res) {
	var uploader = parser.single('Photo');
	uploader(req, res, function(err) {
		if(err) {
			res.status(500).send(err.message);
		} else {
			var newPayment = req.body;
			var payment;
			Payment
			.findById(req.params.paymentId)
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
					else if(req.user.Profile !== 2)
						payment.set('Status', 4);
					if(req.file && req.file.secure_url)
						payment.set('Photo', req.file.secure_url + '?f=auto');
					payment.save()
					.then(function(result) {
						res.json(result.toJSON());
					})
					.catch(function(err) {
						res.status(500).json({message: err.message});
					});
				}
			})
			.catch(function(err) {
				res.status(500).json({message: err.message});
			});
		}
	});
});

router.delete('/:paymentId', function(req, res) {
	var query = {where: {Id: req.params.paymentId}};
	if(userType !== 2)
		query.where.PETianoId = req.user.Id;
	Payment
		.destroy(query)
		.then(function(data) {
			res.end();
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
})

module.exports = router;
