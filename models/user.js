var bcrypt = require('bcrypt')
var bcryptSaltRounds = 10

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    'passwordHash': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'firstName': {
      type: DataTypes.STRING,
      allowNull: false
    },
    'lastName': {
      type: DataTypes.STRING,
      allowNull: false
    },
    'lastLoginAt': {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  })

  User.prototype.name = function () {
    return [this.firstName, this.lastName].join(' ')
  }

  User.prototype.updatePassword = async function (password) {
    let hash = await bcrypt.hash(password, bcryptSaltRounds)
    this.passwordHash = hash
  }

  User.prototype.checkPassword = async function (password, callback) {
    return bcrypt.compare(password, this.passwordHash)
  }

  User.prototype.apiData = function (api) {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    }
  }

  return User
}
