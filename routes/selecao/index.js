// /api/selecao
var path = require('path');
var router = require('express').Router();
var app = require(path.join(__dirname, '../../index')).app;
var petianoAuthentication = require(path.join(__dirname, '../../services', 'petianoAuthentication.js'));
var candidatoAuthentication = require(path.join(__dirname, '../../services', 'candidatoAuthentication.js'));

var Selecao = app.get('models').Selecao;
var Etapa = app.get('models').Etapa;
var Candidato = app.get('models').Candidato;
var PETiano = app.get('models').PETiano;
var Sequelize = require('sequelize');

function errorCallback(err) {
  if(process.env.NODE_ENV !== 'production') console.log(err);
  res.status(500).send({message: 'Erro interno!'});
}

router.get('/candidatos/etapa/:etapaId', function(req,res){
  if(req.signedCookies.user) {
    petianoAuthentication(req, res, function() {
        Candidato
        .findAll({where: {EtapaId: req.params.etapaId}})
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else if(req.signedCookies.candidato) {
    candidatoAuthentication(req, res, function() {
      res.status(401).end();
    });
  } else {
    res.status(401).send({message: 'Não autorizado!'});
  }
});

/**
 * Retorna selecoes disponiveis caso seja um candidato ou
 * todas as selecoes caso seja um petiano ou não retorna nada
 */
router.get('/', function(req, res) {
  if(req.signedCookies.user) {
    petianoAuthentication(req, res, function() {
      Selecao
        .findAll()
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else if(req.signedCookies.candidato) {
    candidatoAuthentication(req, res, function() {
      Selecao
        .findOne({where: {IsOpen: true}})
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else {
    res.status(401).send({message: 'Não autorizado!'});
  }
});

/**
 * Retorna a selecao com base no id dependendo do usuario
 */
router.get('/:selecaoId', function(req, res) {
  Selecao
    .findById(req.params.selecaoId, {include: [
      {model: Etapa, as: 'Etapas'},
      {model: Candidato, as: 'Candidatos'}
    ]})
    .then(function(result) {
      if(result == null) return res.status(200).json(null);
      if(req.signedCookies.candidato) {
        candidatoAuthentication(req, res, function() {
          if(result.IsOpen) res.status(200).json(result);
          else res.status(401).send({message: 'Não autorizado!'});
        });
      } else if(req.signedCookies.user) {
        petianoAuthentication(req, res, function() {
          res.status(200).json(result);
        });
      } else {
        res.status(401).send({message: 'Não autorizado!'});
      }
    }).catch(errorCallback);
});

/**
 * Retornar as etapas disponiveis para a selecao com base no usuario
 */
router.get('/:selecaoId/etapa/', function(req, res) {
  if(req.signedCookies.candidato) {
    candidatoAuthentication(req, res, function() {
      if(req.user.EtapaId == undefined) return res.status(401).send({message: 'Não autorizado!'});
      Etapa
        .find({where: {SelecaoId: req.params.selecaoId, Id: req.user.EtapaId}})
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else if(req.signedCookies.user) {
    petianoAuthentication(req, res, function() {
      Etapa
        .findAll({where: {SelecaoId: req.params.selecaoId}})
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else {
    res.status(401).send({message: 'Não autorizado!'});
  }
});

/**
 * Retorna a etapa com base no id da mesma e da selecao
 * dependendo do tipo de usuario
 */
router.get('/:selecaoId/etapa/:etapaId', function(req, res) {
  if(req.signedCookies.user) {
    petianoAuthentication(req, res, function() {
      Etapa
        .find({where: {SelecaoId: req.params.selecaoId, Id: req.params.etapaId}, include: [
          {model: Candidato, as: 'Candidatos'}
        ]})
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    });
  } else if(req.signedCookies.candidato) {
    candidatoAuthentication(req, res, function() {
      Selecao
        .findById(req.params.selecaoId)
        .then(function(result) {
          if(result == null || !result.IsOpen) return res.status(200).json(null);
          Etapa
            .findById(req.params.etapaId)
            .then(function(result) {
              res.status(200).json(result);
            })
            .catch(errorCallback);
        })
        .catch(errorCallback);
    });
  } else {
    res.status(401).send({message: 'Não autorizado!'});
  }
});

/**
 * Atualiza um candidato com a id de uma selecao
 */
router.post('/:selecaoId/participar', candidatoAuthentication, function(req, res) {
  Selecao
    .findById(req.params.selecaoId)
    .then(function(result) {
      if(result != null && result.IsOpen) {
        var candidato = req.user;
        candidato.SelecaoId = result.Id;
        candidato
          .save()
          .then(function(result) {
            delete result.dataValues.Evaluations;
            res.status(200).json(result);
          })
          .catch(errorCallback);
      } else {
        res.status(400).send({message: 'Bad request.'});
      }
    })
    .catch(errorCallback);
});

router.use(petianoAuthentication);

/**
 * Cria uma selecao
 */
router.post('/', function(req, res) {
  Selecao
    .create({
      Year: (new Date()).getFullYear(),
      Description: req.body.Description,
      IsOpen: false
    })
    .then(function(result) {
      res.status(201).json(result);
    })
    .catch(errorCallback);
});

/**
 * Atualiza uma selecao
 */
router.post('/:selecaoId', function(req, res) {
  Selecao
    .findById(req.params.selecaoId)
    .then(function(selecao) {
      if(req.body.Description)
        selecao.Description = req.body.Description;
      if(req.body.IsOpen != undefined)
        selecao.IsOpen = req.body.IsOpen;
      selecao
        .save()
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    })
    .catch(errorCallback);
});

/**
 * Cria uma etapa em uma selecao
 */
router.post('/:selecaoId/etapa/', function(req, res) {
  Etapa
    .create({
      SelecaoId: req.params.selecaoId,
      Description: req.body.Description,
      CanUpdate: req.body.CanUpdate
    })
    .then(function(result) {
      res.status(201).json(result);
    })
    .catch(errorCallback);
});

/**
 * Atualiza uma etapa em uma selecao
 */
router.post('/:selecaoId/etapa/:etapaId', function(req, res) {
  Etapa
    .find({where: {SelecaoId: req.params.selecaoId, Id: req.params.etapaId}, include: [
      {model: Candidato, as: 'Candidatos'}
    ]})
    .then(function(etapa) {
      if(req.body.Description)
        etapa.Description = req.body.Description;
      if(req.body.CanUpdate != null)
        etapa.CanUpdate = req.body.CanUpdate;
      etapa
        .save()
        .then(function(result) {
          res.status(200).json(result);
        })
        .catch(errorCallback);
    })
    .catch(errorCallback);
});

/**
 * Cadastra um candidato em uma etapa de uma selecao
 */
router.put('/:selecaoId/etapa/:etapaId/candidato/:candidatoId', function(req, res) {
  Etapa
    .find({where: {SelecaoId: req.params.selecaoId, Id: req.params.etapaId}})
    .then(function(result) {
      if(result != null) {
        Candidato
          .find({where: {Id: req.params.candidatoId}})
          .then(function(candidato) {
            candidato.EtapaId = result.Id;
            candidato
              .save()
              .then(function(result) {
                res.status(200).json(result);
              })
              .catch(errorCallback);
          })
          .catch(errorCallback);
      } else {
        res.status(400).send({message: 'Bad request.'});
      }
    })
    .catch(errorCallback);
});

/**
 * Aprova um candidato incluindo ele na tabela petiano
 * e removendo de candidato
 */
router.post('/:selecaoId/aprovado/:candidatoId', function(req, res) {
  Candidato
    .find({where: {SelecaoId: req.params.selecaoId, Id: req.params.candidatoId}})
    .then(function(candidato) {
      if(candidato != null) {
        PETiano
          .create({
            Login: candidato.Login,
            Password: candidato.Password,
            Name: candidato.Name,
            Email: candidato.Email,
            Photo: candidato.Photo
          })
          .then(function(petiano) {
            petiano.setPassword(candidato.Password);
            petiano
              .save()
              .then(function(result) {
                candidato.destroy();
                res.end();
              })
              .catch(errorCallback);
          })
          .catch(errorCallback);
      } else {
        res.status(400).send({message: 'Bad request.'});
      }
    })
    .catch(errorCallback);
});

module.exports = router;
