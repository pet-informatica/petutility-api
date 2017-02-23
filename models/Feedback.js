/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Feedback', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Type: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		Date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		PETianoId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'PETiano',
				key: 'Id'
			}
		}
	}, {
		tableName: 'Feedback',
		timestamps: false
	});
};
