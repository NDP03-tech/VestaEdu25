const express = require("express");
const bodyParser = require("body-parser");
const courseRoutes = require("./routes/CourseRoute");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Sentry = require("@sentry/node");
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
const instructorRoutes = require("./routes/instructorRoutes");
const { sequelize } = require("./models");
const app = express();
const path = require("path");
const auditLog = require("./middleware/auditLog");
const errorHandler = require("./middleware/errorHandler");

if (process.env.NODE_ENV === "production" && !process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET must be configured in production");
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  enabled: Boolean(process.env.SENTRY_DSN),
});

// Middleware
app.set("trust proxy", 1);
app.use(helmet());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau.",
  },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Quá nhiều lần thử đăng nhập." },
});
app.use("/api", apiLimiter);
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use(auditLog);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS - Tự động hỗ trợ cả development và production
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : process.env.NODE_ENV === "production"
    ? ["https://vestaedu.online", "https://www.vestaedu.online"]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5000",
      ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // ✅ BỎ DẤU "/" Ở CUỐI NẾU CÓ
      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Xử lý preflight request
app.options("*", cors());

// Kết nối tới MySQL database
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL database");
    // Chỉ sync khi development
    if (process.env.NODE_ENV !== "production")
      return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log("✅ Database synchronized");
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
    Sentry.captureException(err);
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
app.use("/api/instructors", instructorRoutes);

// Static files - serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route upload media
app.use("/api", uploadRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  sequelize
    .authenticate()
    .then(() => res.json({ status: "OK", timestamp: new Date() }))
    .catch(() =>
      res.status(503).json({ status: "DEGRADED", timestamp: new Date() }),
    );
});

app.use((error, req, res, next) => {
  Sentry.captureException(error);
  next(error);
});
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("📊 Database:", process.env.DB_NAME || "edu_database");
  console.log("📁 Uploads directory:", path.join(__dirname, "uploads"));
  console.log("🌍 Environment:", process.env.NODE_ENV || "development");
  console.log("✅ Allowed Origins:", allowedOrigins);
});
