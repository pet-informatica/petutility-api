/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Pocket', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Month: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Year: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'Pocket',
		timestamps: false
	});
};
