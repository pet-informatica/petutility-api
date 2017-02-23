/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Idea', {
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
		Description: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'Idea',
		timestamps: false
	});
};
