// Script to migrate quizzes from Class table (if any) to class_quizzes join table
const { sequelize, Class, Quiz } = require('../models');

async function migrateQuizzesToJoinTable() {
  try {
    await sequelize.authenticate();
    const classes = await Class.findAll();
    for (const cls of classes) {
      // If you have a quizzes field (JSON array) in Class, migrate it
      const quizIds = cls.quizzes || [];
      if (quizIds.length > 0) {
        const quizzes = await Quiz.findAll({ where: { id: quizIds } });
        await cls.addQuizzes(quizzes); // Sequelize magic method
        console.log(`Added ${quizzes.length} quizzes to class ${cls.id}`);
      }
    }
    console.log('Quiz migration completed!');
    process.exit(0);
  } catch (err) {
    console.error('Quiz migration error:', err);
    process.exit(1);
  }
}

migrateQuizzesToJoinTable();
