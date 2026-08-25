const { sequelize } = require("../models");

async function migrate() {
  try {
    console.log("🔄 Starting database migration...");

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    throw new Error(
      "Use npm run migrate (sequelize-cli db:migrate); destructive sync is disabled.",
    );

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;
