'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.changeColumn(
      'PETiano',
      'Login', {
        type: DataTypes.STRING,
        allowNull: true
      })
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.changeColumn(
      'PETiano',
      'Login', {
        type: DataTypes.STRING,
        allowNull: false
      })
  }
}
