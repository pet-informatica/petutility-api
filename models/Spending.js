/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Spending', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Value: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		Date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		Status: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'Spending',
		timestamps: false
	});
};
