'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('RecordOfMeeting', {
  		Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Date: {
  			type: DataTypes.DATE,
  			defaultValue: DataTypes.NOW,
  			allowNull: false
  		},
  		Status: {
  			type: DataTypes.INTEGER,
  			validate: {
  				isIn: [['1','2']]
  			},
  			allowNull: false
  		},
      AteiroId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'PETiano',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      PresidentId: {
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
    return queryInterface.dropTable('RecordOfMeeting');
  }
}
