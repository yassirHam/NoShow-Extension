module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    linkedin_id: DataTypes.STRING,
    email: DataTypes.STRING,
    full_name: DataTypes.STRING
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Report, { foreignKey: 'user_id' });
  };

  return User;
};