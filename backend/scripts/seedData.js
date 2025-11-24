const { sequelize } = require('../models');
const Category = require('../models/Category');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Tạo categories mẫu
    const categories = [
      { name: 'Mathematics' },
      { name: 'Science' },
      { name: 'English' },
      { name: 'History' },
      { name: 'Geography' }
    ];
    
    console.log('📚 Creating categories...');
    for (const catData of categories) {
      const existing = await Category.findOne({ where: { name: catData.name } });
      if (!existing) {
        await Category.create(catData);
        console.log(`✅ Created category: ${catData.name}`);
      } else {
        console.log(`⚠️ Category already exists: ${catData.name}`);
      }
    }
    
    // Tạo quizzes mẫu
    const quizzes = [
      {
        title: 'Basic Math Quiz',
        description: 'Test your basic math skills',
        category: 'Mathematics',
        difficulty: 'Easy',
        timeLimit: 30,
        questions: []
      },
      {
        title: 'Science Fundamentals',
        description: 'Basic science knowledge test',
        category: 'Science',
        difficulty: 'Medium',
        timeLimit: 45,
        questions: []
      },
      {
        title: 'English Grammar',
        description: 'Test your English grammar skills',
        category: 'English',
        difficulty: 'Easy',
        timeLimit: 25,
        questions: []
      }
    ];
    
    console.log('📝 Creating quizzes...');
    for (const quizData of quizzes) {
      const existing = await Quiz.findOne({ where: { title: quizData.title } });
      if (!existing) {
        await Quiz.create(quizData);
        console.log(`✅ Created quiz: ${quizData.title}`);
      } else {
        console.log(`⚠️ Quiz already exists: ${quizData.title}`);
      }
    }
    
    console.log('🎉 Data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
