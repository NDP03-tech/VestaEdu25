const AuditLog = require("../models/AuditLog");

const auditLog = (req, res, next) => {
  res.on("finish", () => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return;
    AuditLog.create({
      userId: req.user ? req.user.id : null,
      action: `${req.method} ${req.route ? req.route.path : req.path}`,
      resource: req.baseUrl || null,
      resourceId: req.params.id || req.params.userId || null,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
    }).catch((error) => console.error("Audit log error:", error.message));
  });
  next();
};

module.exports = auditLog;
