"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be configured before migration.",
      );
    }
    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
    }

    const [existing] = await queryInterface.sequelize.query(
      'SELECT "id", "role" FROM "users" WHERE "email" = :email LIMIT 1',
      { replacements: { email }, type: Sequelize.QueryTypes.SELECT },
    );

    if (existing) {
      if (existing.role !== "admin") {
        await queryInterface.sequelize.query(
          'UPDATE "users" SET "role" = \'admin\', "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = :id',
          { replacements: { id: existing.id } },
        );
      }
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert("users", [
      {
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    if (process.env.ADMIN_EMAIL) {
      await queryInterface.bulkDelete("users", {
        email: process.env.ADMIN_EMAIL,
      });
    }
  },
};
