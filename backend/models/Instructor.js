const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Instructor = sequelize.define(
  "Instructor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "default-instructor.jpg",
    },
    facebook: {
  type: DataTypes.STRING(255),
  allowNull: true,
  validate: {
    isUrlIfNotEmpty(value) {
      if (!value) return; // null hoặc "" → bỏ qua validate
      const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
      if (!urlRegex.test(value)) {
        throw new Error("Facebook phải là URL hợp lệ");
      }
    },
  },
},

twitter: {
  type: DataTypes.STRING(255),
  allowNull: true,
  validate: {
    isUrlIfNotEmpty(value) {
      if (!value) return;
      const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
      if (!urlRegex.test(value)) {
        throw new Error("Twitter phải là URL hợp lệ");
      }
    },
  },
},

linkedin: {
  type: DataTypes.STRING(255),
  allowNull: true,
  validate: {
    isUrlIfNotEmpty(value) {
      if (!value) return;
      const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
      if (!urlRegex.test(value)) {
        throw new Error("Linkedin phải là URL hợp lệ");
      }
    },
  },
},

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "instructors",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Instructor;
