'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('AbsentOrLate', {
  		Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Type: {
  			type: DataTypes.INTEGER,
  			validate: {
  				isIn: [['1', '2']]
  			},
  			allowNull: false
  		},
  		Reason: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		IsJustified: {
  			type: DataTypes.BOOLEAN,
  			allowNull: true
  		},
      RecordOfMeetingId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'RecordOfMeeting',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    return queryInterface.dropTable('AbsentOrLate');
  }
}
