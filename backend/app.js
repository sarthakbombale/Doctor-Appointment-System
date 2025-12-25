const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { testConnection, syncDB } = require('./config/db');
const userRoute = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

app.use('/api/user', userRoute);

app.get('/', (req, res) => res.send('Hello World'));

(async () => {
  await testConnection();  // ✅ DB connection
  await syncDB();          // ✅ CREATES TABLE
})();

app.listen(port, () => console.log(`Server running on ${port}`));



//   { "name":"Admin", "email":"email@gmail.com", "password":"Admin", "contactNumber":"7249207830", "address":"Pune" }