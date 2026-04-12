require('dotenv').config(); // Absolute Line 1
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection, syncDB } = require('./config/db.js');

// Import models to establish relationships
require('./models/index.js');

const app = express();
const port = process.env.PORT || 7000;

// Centralized allowed origins
const allowedOrigins = [
  'https://doctor-app-system.netlify.app',
  'http://localhost:5173',
  'http://localhost:7005'
];

app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      console.error(`CORS Blocked: ${origin} is not in allowedOrigins`);
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import Routes AFTER Middleware/Env
const dashboardRoute = require("./routes/dashboardRoutes");
const userRoute = require('./routes/userRoutes.js');
const appointmentRoute = require('./routes/appointmentRoute.js');
const doctorRoute = require('./routes/doctorRoute.js');

app.use("/api/dashboard", dashboardRoute);
app.use('/api/user', userRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/api/doc', doctorRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('Backend is running successfully!'));

// Generic JSON error handler for multer/cloudinary/abort errors
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || err.msg || "Server Error";
  const errorPayload = typeof err === 'object' ? { ...err } : err;

  return res.status(status).json({
    success: false,
    msg: message,
    error: errorPayload,
  });
});

(async () => {
  await testConnection();
  await syncDB();
})();

app.listen(port, () => console.log(`Server running on port ${port}`));