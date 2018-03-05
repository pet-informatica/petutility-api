'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Selecao', {
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
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Selecao');
  }
}
