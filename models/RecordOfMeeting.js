/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('RecordOfMeeting', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		},
		Status: {
			type: DataTypes.INTEGER,
			validate: {
				isIn: [['1','2']]
			},
			allowNull: false
		}
	}, {
		tableName: 'RecordOfMeeting',
		timestamps: false
	});
};
