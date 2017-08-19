'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface
      .createTable('Activity', {
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
        Start: {
    			type: DataTypes.DATE,
    			allowNull: false
    		},
        End: {
    			type: DataTypes.DATE,
    			allowNull: false
    		},
    		Participants: {
    			type: DataTypes.INTEGER,
    			allowNull: false
    		},
    		Positive: {
    			type: DataTypes.TEXT,
    			allowNull: false
    		},
    		Negative: {
    			type: DataTypes.TEXT,
    			allowNull: false
    		},
    		Comments: {
    			type: DataTypes.TEXT,
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Activity');
  }
};
