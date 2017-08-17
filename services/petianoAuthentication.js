const path = require('path');
const PETiano = require(path.join(__dirname, '..', 'index.js')).app.get('models').PETiano;

module.exports = (req, res, next) => {
	if (req.signedCookies.user && req.signedCookies.candidato)
		res.clearCookie('candidato');
	if (req.signedCookies.user) {
		PETiano
			.findById(req.signedCookies.user)
			.then(result => {
				if (result) {
					req.user = result;
					res.cookie('user', result.Id, {signed: true, maxAge: 3*24*60*60*1000});
					res.logout = () => {
						res.clearCookie('user');
					};
					next();
				} else {
					res.clearCookie('user');
					res.status(403).json({message: 'Cookie inválido'});
				}
			})
			.catch((err) => res.status(500).json({message: 'Erro Interno'}));
	} else {
		res.status(403).send({message: 'Autenticação exigida.'});
	}
};
