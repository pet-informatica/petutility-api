'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Event', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Title: {
  			type: DataTypes.STRING,
  			allowNull: false
  		},
  		Start: {
  			type: DataTypes.DATE,
  			allowNull: false
      },
      End: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Event');
  }
}
