var path = require('path');
var app = require(path.join(__dirname, '../../index')).app;
var router = require('express').Router();
var Sequelize = require('sequelize');
var nodemailer = require('nodemailer');

function genPass(){
	var newPass = "";
	var alphabet = "AB8C70DEF1GHI62JKLM3NO5PQRS4TUVWXYZabcd9fghijklmnopqrstuvwxyz";
	for(var i = 0; i < 8 ; ++i)
	{
		var temp = Math.floor((Math.random()*100));
		while(temp >= alphabet.length)
			temp >>= 1;
		if(typeof alphabet[temp] == undefined)
			temp = 44;
		newPass += alphabet[temp];
	}
	return newPass;
}

router.head('/', function(req, res)
{
	app.get('models').PETiano.find({
		where:{
			Login: req.query.userLogin,
			Email: req.query.userEmail
		}
	}).then(function(result){
		if(result){
			res.status(200).end();
			var newPass = genPass();
			var transp = app.get('mailTransporter');
			transp.sendMail({
				from: '"PETUtility" <' + process.env.EMAIL + '>',
				to: result.Email,
				subject: 'Senha PETUtility',
				text: 'Olá ' + result.Name + ', sua nova senha para logar no PETUtility é: ' + newPass + '.'
			}, function(err, info) {
				if(err)
					console.log(err);
			});
			app.get('models').PETiano.update(
				{Password: newPass},
				{where:{Id: result.Id}}
			).then((result)=>{
				console.log("Password updated");
			}).catch(function(result){
				console.log("Password not updated");
			});
		}
		else
			res.status(404).end();
	}, function(err){
		res.status(500).end();
	})
});

module.exports = router;