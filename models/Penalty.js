/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Penalty', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Value: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		Date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		Status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				//1 - Pago,
				//2 - Não pago
				isIn: [['1', '2']]
			},
			defaultValue: 2
		},
		PenaltyJustification: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'Penalty',
		timestamps: false
	});
};
