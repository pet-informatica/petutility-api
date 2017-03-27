'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.changeColumn(
      'Idea',
      'Description', {
        type: DataTypes.TEXT,
        allowNull: true
      })
  },
  down: function(queryInterface, DataTypes) {
    queryInterface.changeColumn(
      'Idea',
      'Description', {
        type: DataTypes.STRING,
        allowNull: true
      })
  }
}