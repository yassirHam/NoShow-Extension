// backend/models/report.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    severity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5
      }
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'reports',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['created_at']
      },
      {
        fields: ['severity']
      }
    ]
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, { 
      foreignKey: 'user_id',
      as: 'reporter'
    });
    Report.belongsTo(models.Candidate, { 
      foreignKey: 'candidate_id',
      as: 'candidate'
    });
  };

  return Report;
};
