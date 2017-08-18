/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Event', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		Start: {
			type: DataTypes.DATE,
			allowNull: false
		},
		End: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'Event',
		timestamps: false
	});
};
