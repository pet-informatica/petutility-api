'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.createTable('Pocket', {
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
    });
  },
  down: function(queryInterface, DataTypes) {
    queryInterface.dropTable('Pocket');
  }
}
