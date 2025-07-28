module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    linkedin_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    current_position: DataTypes.STRING,
    current_company: DataTypes.STRING,
    profile_url: DataTypes.STRING
  }, {
    tableName: 'candidates',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Candidate.associate = (models) => {
    Candidate.hasMany(models.Report, { foreignKey: 'candidate_id' });
  };

  return Candidate;
};