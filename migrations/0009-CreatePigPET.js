'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.createTable('PigPET', {
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
    })
  },
  down: function(queryInterface, DataTypes) {
    queryInterface.dropTable('PigPET');
  }
}
