const { sequelize } = require('../models');
const User = require('../models/User');

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        email: 'admin@example.com' 
      } 
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists with email: admin@example.com');
      console.log('Admin details:', {
        id: existingAdmin.id,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Admin details:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await sequelize.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
