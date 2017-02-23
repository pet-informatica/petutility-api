'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.createTable('Payment', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Type: {
  			type: DataTypes.INTEGER,
  			allowNull: false
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
  		RefusedJustification: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Photo: {
  			type: DataTypes.BLOB,
  			allowNull: true
  		},
  		Instrument: {
  			type: DataTypes.INTEGER,
  			allowNull: false
  		},
  		Notes: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Ids: {
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
    queryInterface.dropTable('Payment');
  }
}
