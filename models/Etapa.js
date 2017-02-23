module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Etapa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		CanUpdate: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'Etapa',
		timestamps: false
	});
};
