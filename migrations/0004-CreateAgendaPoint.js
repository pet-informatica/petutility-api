'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('AgendaPoint', {
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
  			type: DataTypes.TEXT,
  			allowNull: true
  		},
  		Status: {
  			type: DataTypes.INTEGER,
  			validate: {
  				isIn: [['1', '2', '3', '4']]
  			},
  			allowNull: false
  		},
      PETianoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'PETiano',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      RecordOfMeetingId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'RecordOfMeeting',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('AgendaPoint');
  }
}
