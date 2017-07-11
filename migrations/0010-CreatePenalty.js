'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Penalty', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Value: {
  			type: DataTypes.FLOAT,
  			allowNull: false
  		},
  		Date: {
  			type: DataTypes.DATE,
  			allowNull: false
  		},
  		Status: {
  			type: DataTypes.INTEGER,
  			allowNull: false
  		},
  		PenaltyJustification: {
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
    return queryInterface.dropTable('Penalty');
  }
}
