'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.createTable('Event', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		title: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		start: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		time: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		end: {
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
    queryInterface.dropTable('Event');
  }
}
