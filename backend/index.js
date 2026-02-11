const express = require("express");
const bodyParser = require("body-parser");
const courseRoutes = require("./routes/CourseRoute");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const blogRoutes = require("./routes/BlogRoutes");
const eventRoutes = require("./routes/EventRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const categoriesRoutes = require("./routes/categories");
const assignedQuizRoutes = require("./routes/assignedQuizRoutes");
const classRoute = require("./routes/classRoute");
const dashboardRoutes = require("./routes/dashboard");
const resultRoutes = require("./routes/userQuizResultRoutes");
const eventRegistrationRoutes = require("./routes/eventRegistration");
const uploadRoute = require("./routes/uploadRoute");
const courseRegistrationRoutes = require("./routes/courseRegistrationRoutes");
const instructorRoutes = require("./routes/instructorRoutes"); // 👈 THÊM DÒNG NÀY
const { sequelize } = require("./models");
const app = express();
const path = require("path");

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS
app.use(
  cors({
    origin: [
      "https://vestaedu.online",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Xử lý preflight request
app.options("*", cors());

// Kết nối tới MySQL database
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL database");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database synchronized");
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
  });

// Sử dụng routes
app.use("/api/results", resultRoutes);
app.use("/api/course", courseRoutes);
app.use("/api", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/classes", classRoute);
app.use("/api/course-registrations", courseRegistrationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/assigned-quizzes", assignedQuizRoutes);
app.use("/api/instructors", instructorRoutes); // 👈 THÊM DÒNG NÀY

// Static files - serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route upload media
app.use("/api", uploadRoute);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("🔍 Database:", process.env.DB_NAME || "edu_database");
  console.log("📁 Uploads directory:", path.join(__dirname, "uploads"));
});
