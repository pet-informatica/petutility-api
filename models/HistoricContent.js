/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('HistoricContent', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		Amount: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Positive: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Negative: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Theme: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'HistoricContent',
		timestamps: false
	});
};
