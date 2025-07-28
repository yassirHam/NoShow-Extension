// backend/models/candidate.js
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    linkedin_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    current_position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    current_company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_url: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'candidates',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['linkedin_id']
      },
      {
        fields: ['first_name', 'last_name']
      }
    ]
  });

  Candidate.associate = (models) => {
    Candidate.hasMany(models.Report, { 
      foreignKey: 'candidate_id',
      as: 'reports'
    });
  };

  return Candidate;
};