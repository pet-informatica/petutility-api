var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('PETiano', {
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
		Balance: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Cpf: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Rg: {
			type: DataTypes.STRING,
			allowNull: true
		},
		CellPhone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Profile: {
			type: DataTypes.INTEGER,
			allowNull: true,
			validate: {
				// 1 - 'Comum'
				// 2 - 'PigPET'
				// 3 - 'Admin'
				// 4 - 'Egresso'
				isIn: [['1', '2', '3', '4']]
			},
			defaultValue: 1
		},
		IdsHistoric: {
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
		tableName: 'PETiano',
		timestamps: false,
		instanceMethods: {
			comparePassword: function(v) {
				return bcrypt.compareSync(v, this.getDataValue('Password'));
			},
			setPassword: function(v) {
				this.setDataValue('Password', v);
			}
		}
	});
};
