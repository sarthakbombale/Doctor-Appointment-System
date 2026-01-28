const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      msg: "Authorization token missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      msg: "Bearer token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
}

function doctor(req, res, next) {
  if (req.user?.role?.toLowerCase() === "doctor") {
    return next();
  }
  return res.status(403).json({
    success: false,
    msg: "Doctor access required",
  });
}

function admin(req, res, next) {
  if (req.user?.role?.toLowerCase() === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    msg: "Admin access required",
  });
}

module.exports = { auth, doctor, admin };
