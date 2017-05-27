// /api/candidato
const path = require('path');
const router = require('express').Router();
const Sequelize = require('sequelize');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

const app = require(path.join(__dirname, '../../index')).app;
const candidatoAuthentication = require(path.join(__dirname, '../../services/candidatoAuthentication.js'));

const Candidato = app.get('models').Candidato;
const Etapa = app.get('models').Etapa;
const PETiano = app.get('models').PETiano;

const parser = multer({
	storage: cloudinaryStorage({
		cloudinary: cloudinary,
		folder: function(req, file, cb) {
			if(file.fieldname === 'Photo')
				cb(undefined, 'candidatoPhoto');
			else
				cb(undefined, 'candidatoFile');
		},
		allowedFormats: ['pdf', 'doc', 'docx', 'jpg'],
		filename: function(req, file, cb) {
			cb(undefined, file.originalname);
		}
	})
});

// Creates new candidato
router.post('/signup', function(req, res)
{
	if(req.body.Password != req.body.ConfirmPassword) {
		res.status(400);
		res.json({message: 'Senhas não batem'});
		return;
	} else {
		var uploader = parser.single('Photo');
		uploader(req, res, function(err) {
			if(err) {
				console.log(err);
				res.status(500);
				res.json(err);
			} else {
				PETiano
				.find({where: {Login: req.body.Login}})
				.then((result) => {
					if(result) {
						res.status(409);
						res.json({message: 'Login já existente'});
					} else {
						var photoUrl = '';
						if(req.file) photoUrl = req.file.secure_url + '?f=auto';
						Candidato
						.create({
							Login: req.body.Login,
							Password: req.body.Password,
							Name: req.body.Name,
							Photo: photoUrl,
							Email: req.body.Email
						})
						.then(function(candidato) {
							req.user = candidato;
							res.cookie('candidato', candidato.Id, {signed: true, maxAge: 3*24*60*60*1000});
							res.logout = function() {
								res.clearCookie('candidato');
							};
							res.status(201);
							var ret = req.user;
							delete ret.Evaluations;
							delete ret.Password;
							res.json(ret);
						})
						.catch(function(err) {
							res.status(409);
							res.json(err);
						});
					}
				})
				.catch((err) => {
					console.log(err);
					res.status(500);
					res.json(err);
				});
			}
		});
	}
});

router.use(candidatoAuthentication);

// Updates user
router.post('/update', function(req, res)
{
	var files = [
		{name: 'Photo', maxCount: 1}
	];
	if(req.user.EtapaId) {
		Etapa
		.findById(req.user.EtapaId)
		.then(function(result) {
			if(result && result.CanUpdate) {
				files.push({name: 'Curriculum', maxCount: 1});
				files.push({name: 'ScholarHistoric', maxCount: 1});
			}
			var uploader = parser.fields(files);
			uploader(req, res, function(err) {
				if(err) {
					console.log(err);
					res.status(500);
					res.json({message: 'Erro interno!'});
				} else {
					var user = req.user;
					var	newUser = req.body;
					if(req.files) {
						if(req.files.Curriculum)
							user.set('Curriculum', req.files.Curriculum[0].secure_url + '?f=auto');
						if(req.files.ScholarHistoric)
							user.set('ScholarHistoric', req.files.ScholarHistoric[0].secure_url + '?f=auto');
						if(req.files.Photo)
							user.set('Photo', req.files.Photo[0].secure_url + '?f=auto');
					}
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
					.then((result) => {
						res.json(result);
						res.end();
					})
					.catch((err) => {
						res.status(500);
						res.send({message: 'Erro interno'});
					});
				}
			});
		})
		.catch((err) => {
			res.status(500);
			res.send({message: 'Erro interno!'});
		});
	}
});
// Returns user json
router.get('/login',function(req, res)
{
	var user = req.user.dataValues;
	delete user.Evaluations;
	res.status(200).json(user);
});

module.exports = router;
