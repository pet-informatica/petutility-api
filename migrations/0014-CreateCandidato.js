'use strict';

var cloudinary = require('cloudinary');

module.exports = {
  up: function(queryInterface, DataTypes) {
    queryInterface.createTable('Candidato', {
      Id: {
  			type: DataTypes.INTEGER,
  			allowNull: false,
  			primaryKey: true,
  			autoIncrement: true
  		},
  		Login: {
  			type: DataTypes.STRING,
  			allowNull: false,
  			unique: true
  		},
  		Password: {
  			type: DataTypes.STRING,
  			allowNull: false,
  			set: function(v) {
  				this.setDataValue('Password', bcrypt.hashSync(v, 8));
  			}
  		},
  		Name: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Photo: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Email: {
  			type: DataTypes.STRING,
  			allowNull: false,
  			isEmail: true,
  			unique: true
  		},
  		Curriculum: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		ScholarHistoric: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Evaluations: {
  			type: DataTypes.STRING,
  			allowNull: true
  		},
  		Photo: {
  			type: DataTypes.STRING,
  			defaultValue: (cloudinary.url('userProfile/default.jpg') + '?f=auto')
  		},
  		CoverPhoto: {
  			type: DataTypes.STRING,
  			defaultValue: (cloudinary.url('userCover/default.jpg') + '?f=auto')
  		},
      SelecaoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Selecao',
          key: 'Id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      EtapaId: {
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
    queryInterface.dropTable('Candidato');
  }
}