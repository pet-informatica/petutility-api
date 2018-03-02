const Sequelize = require('sequelize');
const database = require('config').get('database');
const path = require('path');

// init sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, database.options);

// load models
const models = [
	'PETiano',
	'RecordOfMeeting',
	'AgendaPoint',
	'AbsentOrLate',
	'Idea',
	'Event',
	'Activity'
];

models.forEach(model => module.exports[model] = sequelize.import(path.join(__dirname, model)));

// define relationships
((m) => {
	m.RecordOfMeeting.belongsTo(m.PETiano, {as: 'Ateiro', foreignKey: 'AteiroId'});
	m.RecordOfMeeting.belongsTo(m.PETiano, {as: 'President', foreignKey: 'PresidentId'});
	m.AgendaPoint.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.RecordOfMeeting.hasMany(m.AgendaPoint, {as: {plural: 'AgendaPoints', singular: 'AgendaPoint'}, foreignKey: 'RecordOfMeetingId'});
	m.RecordOfMeeting.hasMany(m.AbsentOrLate, {as: {plural: 'AbsentsOrLates', singular: 'AbsentOrLate'}, foreignKey: 'RecordOfMeetingId'});
	m.AbsentOrLate.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.AgendaPoint.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.Idea.belongsTo(m.PETiano, {as: 'PETiano', foreignKey: 'PETianoId'});
	m.Activity.belongsTo(m.PETiano, { as: 'PETiano', foreignKey: 'PETianoId' });
})(module.exports);

// export sequelize connection
module.exports.sequelize = sequelize;
