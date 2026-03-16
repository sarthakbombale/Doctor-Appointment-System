const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { testConnection, syncDB } = require('./config/db.js');
const dashboardRoute = require("./routes/dashboardRoutes");
const userRoute = require('./routes/userRoutes.js');
const appointmentRoute = require('./routes/appointmentRoute.js')
const doctorRoute = require('./routes/doctorRoute.js');
const path = require('path');
const allowedOrigins = [
  'https://doctor-app-system.netlify.app', // Your Netlify URL
  'http://localhost:5173'                  // For local testing
];

// Import models to establish relationships
require('./models/index.js');

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use("/api/dashboard", dashboardRoute);
app.use('/api/user', userRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/doc', doctorRoute);

app.get('/', (req, res) => res.send('Hello World'));

(async () => {
  await testConnection();  // ✅ DB connection
  await syncDB();          // ✅ CREATES TABLE
})();

app.listen(port, () => console.log(`Server running on ${port}`));



//   { "name":"Admin", "email":"email@gmail.com", "password":"Admin", "contactNumber":"7249207830", "address":"Pune" }