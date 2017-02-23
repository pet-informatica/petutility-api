/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AbsentOrLate', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Type: {
			type: DataTypes.INTEGER,
			validate: {
				//1 - Ausente
				//2 - Atrasado
				isIn: [['1', '2']]
			},
			allowNull: false
		},
		Reason: {
			type: DataTypes.STRING,
			allowNull: true
		},
		IsJustified: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		}
	}, {
		tableName: 'AbsentOrLate',
		timestamps: false
	});
};
