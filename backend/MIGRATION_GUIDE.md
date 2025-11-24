# MongoDB to MySQL Migration Guide

This guide will help you migrate your application from MongoDB to MySQL using Sequelize.

## Prerequisites

1. **MySQL Server**: Make sure you have MySQL installed and running
2. **Database**: Create a new MySQL database for your application
3. **Environment Variables**: Update your `.env` file with MySQL connection details

## Environment Setup

Add these variables to your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edu_database
DB_USER=root
DB_PASSWORD=your_password

# Server Configuration
PORT=5000

# JWT Secret (if using JWT authentication)
JWT_SECRET=your_jwt_secret_key
```

## Migration Steps

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE edu_database;
```

### 2. Run Migration Script

Execute the migration script to create all tables:

```bash
node scripts/migrate.js
```

This will:
- Connect to your MySQL database
- Create all necessary tables based on your Sequelize models
- Set up relationships between tables

### 3. Update Controllers

The controllers have been updated to use Sequelize instead of Mongoose. Key changes:

- `User.findOne({ email })` → `User.findOne({ where: { email } })`
- `User.find()` → `User.findAll()`
- `new User(data)` → `User.create(data)`
- `user.save()` → `await user.update(data)` or `User.create(data)`
- `User.findByIdAndUpdate()` → `User.findByPk()` + `user.update()`
- `User.findByIdAndDelete()` → `User.findByPk()` + `user.destroy()`

### 4. Model Changes

All models have been converted from Mongoose to Sequelize:

- **User**: Authentication and user management
- **Quiz**: Quiz creation and management
- **Question**: Question storage with JSON fields for complex data
- **Course**: Course information
- **Class**: Class management with many-to-many relationships
- **Blog**: Blog posts
- **Event**: Event management
- **Category**: Categories
- **CourseRegistration**: Course enrollment
- **EventRegistration**: Event enrollment
- **UserQuizResult**: Quiz results and attempts
- **AttemptCounter**: Track quiz attempts

### 5. Relationships

The following relationships have been established:

- User → Class (teacher)
- User ↔ Class (students - many-to-many)
- Class ↔ Quiz (many-to-many)
- Quiz → Question (one-to-many)
- User → UserQuizResult (one-to-many)
- Quiz → UserQuizResult (one-to-many)
- Course → CourseRegistration (one-to-many)
- Event → EventRegistration (one-to-many)

## Data Migration

If you have existing MongoDB data, you'll need to:

1. Export data from MongoDB
2. Transform the data format to match Sequelize models
3. Import the data into MySQL

## Testing

After migration:

1. Start your server: `npm run dev`
2. Test all endpoints to ensure they work correctly
3. Verify that authentication still works
4. Check that all CRUD operations function properly

## Troubleshooting

### Common Issues

1. **Connection Errors**: Verify your MySQL credentials in `.env`
2. **Table Creation Errors**: Ensure MySQL user has CREATE privileges
3. **Relationship Errors**: Check that all models are properly imported in `models/index.js`

### Rollback

If you need to rollback to MongoDB:
1. Restore your original Mongoose models
2. Update `index.js` to use `mongoose.connect()`
3. Update controllers to use Mongoose syntax

## Performance Considerations

- MySQL with proper indexing can be faster for complex queries
- JSON fields in MySQL provide flexibility similar to MongoDB
- Consider adding database indexes for frequently queried fields

## Next Steps

1. Update remaining controllers (if any)
2. Test all functionality thoroughly
3. Consider adding database migrations for future schema changes
4. Set up database backups
5. Monitor performance and optimize queries as needed
