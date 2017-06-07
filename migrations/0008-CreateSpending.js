'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Spending', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Description: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Value: {
  			type: DataTypes.DECIMAL,
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
    return queryInterface.dropTable('Spending');
  }
}
