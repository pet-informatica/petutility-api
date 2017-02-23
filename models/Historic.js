/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Historic', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoincrement: true
		},
		Name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Drive: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Photo: {
			type: DataTypes.BLOB,
			allowNull: true
		}
	}, {
		tableName: 'Historic',
		timestamps: false
	});
};
