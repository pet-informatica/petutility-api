var path = require('path');
var Candidato = require(path.join(__dirname, '..', 'index.js')).app.get('models').Candidato;

module.exports = (req, res, next) => {
	if(req.signedCookies.candidato)
	{
		Candidato
			.findById(req.signedCookies.candidato)
			.then((result) => {
				if(result) {
					req.user = result;
					res.cookie('candidato', result.Id, {signed: true, maxAge: 3*24*60*60*1000});
					res.logout = function() {
						res.clearCookie('candidato');
					};
					next();
				}
				else
				{
					res.status(403);
					res.send({message: 'Cookie inválido'});
				}
			})
			.catch((err) => {
				res.status(500);
				res.send({message: 'Erro Interno'});
			});
	}
	else if((req.body.username || req.query.username) && (req.body.password || req.query.password))
	{
		var username = req.body.username || req.query.username;
		var password = req.body.password || req.query.password;
		Candidato
			.find({where: {Login: username}})
			.then((result) => {
				if(result && result.comparePassword(password)) {
					req.user = result;
					res.cookie('candidato', result.Id, {signed: true, maxAge: 3*24*60*60*1000});
					res.logout = function() {
						res.clearCookie('candidato');
					};
					next();
				}
				else
				{
					res.status(403);
					res.send({message: 'Usuário ou senha inválidos.'});
				}
			})
			.catch((err) => {
				res.status(500);
				res.send({message: 'Erro Interno'});
			});
	}
	else
	{
		res.status(403);
		res.send({message: 'Autenticação exigida.'});
	}
};
