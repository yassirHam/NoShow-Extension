'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('candidates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      linkedin_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('linkedin_id', sequelize.fn('AES_ENCRYPT', value, process.env.ENCRYPTION_KEY));
      },
      get() {
        return sequelize.fn('AES_DECRYPT', this.getDataValue('linkedin_id'), process.env.ENCRYPTION_KEY);
      }
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      current_position: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      current_company: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      profile_url: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('candidates');
  }
};