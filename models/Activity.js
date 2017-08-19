/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Activity', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
    // Titulo do evento
		Title: {
			type: DataTypes.STRING,
			allowNull: false
		},
    // Data de inicio do evento
    Start: {
			type: DataTypes.DATE,
			allowNull: false
		},
    // Data de termino do evento
    End: {
			type: DataTypes.DATE,
			allowNull: false
		},
    // Quantidade de participantes do evento
		Participants: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
    // Feedback positivo
		Positive: {
			type: DataTypes.TEXT,
			allowNull: false
		},
    // Feedback negativo
		Negative: {
			type: DataTypes.TEXT,
			allowNull: false
		},
    // Comentarios no geral
		Comments: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'Activity',
		timestamps: false
	});
};
