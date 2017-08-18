const path = require('path');
const nodemailer = require('nodemailer');
const router = require('express').Router();
const app = require(path.join(__dirname, '../../index')).app;
const PETiano = app.get('models').PETiano;
const authenticationService = require(path.join(__dirname, '..', '..', 'services', 'petianoAuthentication'));

function genPass() {
  let newPass = "";
  const alphabet = "AB8C70DEF1GHI62JKLM3NO5PQRS4TUVWXYZabcd9fghijklmnopqrstuvwxyz";
  for (let i=0;i<8;++i) {
    let temp = Math.floor((Math.random() * 100));
    while (temp >= alphabet.length)
      temp >>= 1;
    if (typeof alphabet[temp] === undefined)
      temp = 44;
    newPass += alphabet[temp];
  }
  return newPass;
}

router.post('/forgot', function (req, res) {
  PETiano
    .find({
      where: {
        Email: req.body.email
      }
    }).then(result => {
      if (result) {
        let newPass = genPass();
        PETiano
          .update({
            Password: newPass
          },
          { 
            where: {
              Id: result.Id
            }
          }).then((result) => {
            let transp = app.get('mailTransporter');
            transp.sendMail({
              from: '"PETUtility" <' + process.env.EMAIL + '>',
              to: result.Email,
              subject: 'Senha PETUtility',
              text: 'Olá ' + result.Name + ', sua nova senha para logar no PETUtility é: ' + newPass + '.'
            }, (err, info) => {
              if (err) {
                res.status(500).send('Email não pode ser enviado!');
              } else {
                console.log(newPass);
                res.end();
              }
            });
          }).catch((err) => res.status(500).json({ message: 'Erro Interno' }));
      }
      else
        res.status(404).end();
    })
    .catch((err) => res.status(500).json({ message: 'Erro Interno' }));
});


router.get('/logout', function(req, res) {
  res.clearCookie('user');
  res.status(200).end();
});

router.get('/login', (req, res) => {
  authenticationService(req, res, () => res.status(200).json(req.user));
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === undefined || password === undefined)
    return res.status(400).json({message: 'Nao e permitido email ou senha em branco'});
  PETiano
    .findOne({where: {Email: email}})
    .then(result => {
      if (result && result.comparePassword(password)) {
        req.user = result;
        res.cookie('user', result.Id, {signed: true, maxAge: 24*60*60*1000});
        res.logout = () => res.clearCookie('user');
        res.status(200).json(req.user);
      } else {
        res.clearCookie('user');
        res.status(403).json({message: 'Usuário ou senha inválidos.'});
      }
    })
    .catch((err) => res.status(500).json({message: 'Erro Interno'}));
});

module.exports = router;
