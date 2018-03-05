/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Event', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		start: {
			type: DataTypes.STRING,
			allowNull: true
		},
		time: {
			type: DataTypes.STRING,
			allowNull: true
		},
		end: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'Event',
		timestamps: false
	});
};