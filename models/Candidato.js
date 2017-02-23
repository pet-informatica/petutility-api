var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Candidato', {
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
		}
	}, {
		tableName: 'Candidato',
		timestamps: false,
		instanceMethods: {
			comparePassword: function(v) {
				return bcrypt.compareSync(v, this.getDataValue('Password'));
			}
		}
	});
};
