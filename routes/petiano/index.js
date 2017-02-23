// /api/petiano

var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
var multer = require('multer');

var parser = multer({
	storage: cloudinaryStorage({
		cloudinary: cloudinary,
		folder: function(req, file, cb){
			if(file.fieldname == 'Photo'){
				cb(undefined, 'userProfile');
			}
			else if(file.fieldname == 'CoverPhoto'){
				cb(undefined, 'userCover');
			}
		},
		filename: function(req, file, cb) {
			cb(undefined, req.user.Login);
		}
	})
});

router.get('/', function(req, res) {
	var query = {
		where: { }
	};
	if(req.body.Profile)
		query.where.Profile = req.body.Profile;
	app
		.get('models')
		.PETiano
		.findAll(query)
		.then(function(result) {
			res.json(result);
			res.end();
		}, function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		})
})

router.get('/login', function(req, res)
{
	res.json(req.user.toJSON());
	res.end();
});

router.get("/:petianoId", function(req, res) {
	if(req.user.Id === req.params.petianoId)
	{
		res.json(req.user);
		res.end();
		return;
	}
	app
		.get('models')
		.PETiano
		.findById(req.params.petianoId)
		.then(function(result) {
			res.json(result[0].toJSON());
			res.end();
		})
		.catch(function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		})
})


router.post('/update', function(req, res) {

	var uploader = parser.fields([
		{name:'Photo', maxCount:1},
		{name: 'CoverPhoto', maxCount:1}
	]);

	uploader(req, res, function(error){
		if(error){
			return res.status(500).end();
		}
		var user = req.user,
		newUser = req.body;
		if(req.files.Photo)
			user.set('Photo', req.files.Photo[0].secure_url + '?f=auto');
		if(req.files.CoverPhoto)
			user.set('CoverPhoto', req.files.CoverPhoto[0].secure_url + '?f=auto');
		if(newUser.Name)
			user.set('Name', newUser.Name);
		if(newUser.Email)
			user.set('Email', newUser.Email);
		if(newUser.Cpf)
			user.set('Cpf', newUser.Cpf);
		if(newUser.Rg)
			user.set('Rg', newUser.Rg);
		user
			.save()
			.then(function(result) {
				res.json(result);
				res.end();
			})
			.catch((err) => {
				res.status(500);
				res.send({message: 'Erro interno'});
		});

	})

});

router.post('/updatePassword', function(req, res) {
	if(req.user.comparePassword(req.body.oldPassword)) {
		req.user.set('Password', req.body.newPassword);
		req.user.save().then((result) => {
			res.end();
		})
	} else {
		res.status(304);
		res.send('Senha incorreta');
	}
});

module.exports = router;
