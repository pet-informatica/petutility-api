/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('PigPET', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Balance: {
			type: DataTypes.DECIMAL,
			allowNull: false
		}
	}, {
		tableName: 'PigPET',
    timestamps: false
	});
};
