'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Etapa', {
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
  		},
      SelecaoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Selecao',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Etapa');
  }
}
