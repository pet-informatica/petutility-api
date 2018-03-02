'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Idea', {
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
  		Description: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
      PETianoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'PETiano',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Idea');
  }
}
