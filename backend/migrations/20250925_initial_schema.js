"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = Sequelize.literal("CURRENT_TIMESTAMP");
    const jsonb = Sequelize.JSONB;

    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: {
        type: Sequelize.ENUM("admin", "teacher", "student"),
        allowNull: false,
        defaultValue: "student",
      },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      studentPhone: { type: Sequelize.STRING },
      guardianPhone: { type: Sequelize.STRING },
      studentEmail: { type: Sequelize.STRING },
      guardianEmail: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("categories", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("courses", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      image: { type: Sequelize.STRING, allowNull: false },
      bannerImg: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING, allowNull: false },
      author: { type: Sequelize.STRING, allowNull: false },
      authorImg: { type: Sequelize.STRING },
      lesson: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.STRING, allowNull: false },
      duration: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      language: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      dis: { type: Sequelize.TEXT, allowNull: false },
      schedule: { type: jsonb, allowNull: false, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("events", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      image: { type: Sequelize.STRING, allowNull: false },
      bannerImg: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.STRING, allowNull: false },
      startTime: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      cost: { type: Sequelize.STRING, allowNull: false },
      host: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("quizzes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      visibleTo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "everyone",
      },
      uiSettings: { type: jsonb, defaultValue: {} },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("questions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "quizzes", key: "id" },
        onDelete: "CASCADE",
      },
      question_text: { type: Sequelize.TEXT, allowNull: false },
      readingContent: { type: Sequelize.TEXT },
      points: { type: Sequelize.INTEGER, defaultValue: 0 },
      explanation: { type: Sequelize.TEXT },
      question_type: {
        type: Sequelize.ENUM(
          "blank-boxes",
          "generated-dropdowns",
          "drag-drop-matching",
          "find-highlight",
          "multiple-choice",
          "checkboxes",
          "essay",
          "description",
          "reading",
          "speaking",
        ),
        allowNull: false,
      },
      gaps: { type: jsonb, defaultValue: [] },
      dropdowns: { type: jsonb, defaultValue: [] },
      hintWords: { type: jsonb, defaultValue: [] },
      options: { type: jsonb, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("classes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      teacher_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      studentIds: { type: jsonb, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("blogs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      image: { type: Sequelize.STRING, allowNull: false },
      bannerImg: { type: Sequelize.STRING, allowNull: false },
      author: { type: Sequelize.STRING, allowNull: false },
      authorImg: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("instructors", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      designation: { type: Sequelize.STRING(255), allowNull: false },
      bio: { type: Sequelize.TEXT },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "default-instructor.jpg",
      },
      facebook: { type: Sequelize.STRING(255) },
      twitter: { type: Sequelize.STRING(255) },
      linkedin: { type: Sequelize.STRING(255) },
      email: { type: Sequelize.STRING(255) },
      phone: { type: Sequelize.STRING(20) },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("course_registrations", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "courses", key: "id" },
        onDelete: "CASCADE",
      },
      courseTitle: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("event_registrations", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "events", key: "id" },
        onDelete: "CASCADE",
      },
      eventTitle: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("user_quiz_results", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "quizzes", key: "id" },
        onDelete: "CASCADE",
      },
      answers: { type: jsonb, defaultValue: [] },
      score: { type: Sequelize.INTEGER, defaultValue: 0 },
      passed: { type: Sequelize.BOOLEAN, defaultValue: false },
      startedAt: { type: Sequelize.DATE, defaultValue: now },
      submittedAt: { type: Sequelize.DATE },
      attemptNumber: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable("attempt_counters", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "quizzes", key: "id" },
        onDelete: "CASCADE",
      },
      count: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex("user_quiz_results", [
      "user_id",
      "quiz_id",
      "score",
    ]);
    await queryInterface.addIndex("attempt_counters", ["user_id", "quiz_id"], {
      unique: true,
    });
  },

  down: async (queryInterface) => {
    for (const table of [
      "attempt_counters",
      "user_quiz_results",
      "event_registrations",
      "course_registrations",
      "class_quizzes",
      "class_students",
      "questions",
      "classes",
      "instructors",
      "blogs",
      "events",
      "quizzes",
      "categories",
      "courses",
      "users",
    ]) {
      await queryInterface.dropTable(table, { cascade: true });
    }
  },
};
