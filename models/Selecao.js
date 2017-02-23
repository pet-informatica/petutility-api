module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Selecao', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
    Year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
		Description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		IsOpen: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		}
	}, {
		tableName: 'Selecao',
		timestamps: false
	});
};
