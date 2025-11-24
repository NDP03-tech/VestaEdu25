// Script to migrate studentIds from Class table to class_students join table
const { sequelize, Class, User } = require('../models');

async function migrateStudentIdsToJoinTable() {
  try {
    await sequelize.authenticate();
    const classes = await Class.findAll();
    for (const cls of classes) {
      const studentIds = cls.studentIds || [];
      if (studentIds.length > 0) {
        // Find users for these IDs
        const students = await User.findAll({ where: { id: studentIds } });
        await cls.addStudents(students); // Sequelize magic method
        console.log(`Added ${students.length} students to class ${cls.id}`);
      }
    }
    console.log('Migration completed!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrateStudentIdsToJoinTable();
