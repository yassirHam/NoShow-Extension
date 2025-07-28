module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reason: DataTypes.STRING,
    notes: DataTypes.TEXT,
    tags: DataTypes.JSON,
    severity: DataTypes.INTEGER
  }, {
    tableName: 'reports',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'user_id' });
    Report.belongsTo(models.Candidate, { foreignKey: 'candidate_id' });
  };

  return Report;
};