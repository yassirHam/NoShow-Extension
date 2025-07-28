// backend/models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    linkedin_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'recruiter'),
      defaultValue: 'recruiter'
    },
    access_token: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Report, { 
      foreignKey: 'user_id',
      as: 'reports'
    });
  };

  return User;
};