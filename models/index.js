var Sequelize = require('sequelize');
var database = require('config').get('database');
var path = require('path');

// init sequelize
var sequelize = new Sequelize(process.env.DATABASE_URL, database.options);

// load models
var models =
[
	'PETiano',
	'RecordOfMeeting',
	'AgendaPoint',
	'AbsentOrLate',
	'Idea',
	'Payment',
	'Pocket',
	'Spending',
	'Event',
	'Candidato',
	'Selecao',
	'Etapa',
	'PigPET',
	'Penalty'
];

models.forEach(function(model)
{
	module.exports[model] = sequelize.import(path.join(__dirname, model));
});

// define relationships
(function(m)
{
	m.RecordOfMeeting.belongsTo(m.PETiano, {as: 'Ateiro', foreignKey: 'AteiroId'});
	m.RecordOfMeeting.belongsTo(m.PETiano, {as: 'President', foreignKey: 'PresidentId'});
	m.AgendaPoint.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.RecordOfMeeting.hasMany(m.AgendaPoint, {as: {plural: 'AgendaPoints', singular: 'AgendaPoint'}, foreignKey: 'RecordOfMeetingId'});
	m.RecordOfMeeting.hasMany(m.AbsentOrLate, {as: {plural: 'AbsentsOrLates', singular: 'AbsentOrLate'}, foreignKey: 'RecordOfMeetingId'});
	m.AbsentOrLate.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.AgendaPoint.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.Idea.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.PETiano.hasMany(m.Payment, {as: {plural: 'Payments', singular: 'Payment'}, foreignKey: 'PETianoId'});
	m.Spending.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.Event.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.Selecao.hasMany(m.Etapa, {as: {plural: 'Etapas', singular: 'Etapa'}, foreignKey: 'SelecaoId'});
	m.Selecao.hasMany(m.Candidato, {as: {plural: 'Candidatos', singular: 'Candidato'}, foreignKey: 'SelecaoId'});
	m.Etapa.hasMany(m.Candidato, {as: {plural: 'Candidatos', singular: 'Candidato'}, foreignKey: 'EtapaId'});
	m.PETiano.hasMany(m.Penalty, {as: {plural: 'Penalties', singular: 'Penalty'}, foreignKey: 'PETianoId'});
})(module.exports);

// export sequelize connection
module.exports.sequelize = sequelize;
