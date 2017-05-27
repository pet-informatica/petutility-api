/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AgendaPoint', {
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
			type: DataTypes.TEXT,
			allowNull: true
		},
		Status: {
			type: DataTypes.INTEGER,
			validate: {
				// 1 === ponto novo fora de ata
				// 2 === ponto fixo
				// 3 === ponto pendente
				// 4 === ponto novo na ata
				isIn: [['1', '2', '3', '4']]
			},
			allowNull: false
		}
	}, {
		tableName: 'AgendaPoint',
		timestamps: false
	});
};
