"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("admin", "teacher", "student"),
      allowNull: false,
      defaultValue: "student",
    });
    await queryInterface.createTable("refresh_tokens", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      tokenHash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      revokedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("audit_logs", {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      action: { type: Sequelize.STRING(100), allowNull: false },
      resource: { type: Sequelize.STRING(100), allowNull: true },
      resourceId: { type: Sequelize.STRING(100), allowNull: true },
      method: { type: Sequelize.STRING(10), allowNull: false },
      path: { type: Sequelize.STRING(255), allowNull: false },
      statusCode: { type: Sequelize.INTEGER, allowNull: false },
      ip: { type: Sequelize.STRING(64), allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("refresh_tokens");
  },
};
