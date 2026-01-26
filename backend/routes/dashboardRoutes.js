const express = require("express");
const router = express.Router();

const { auth, admin, doctor } = require("../middleware/auth");
const {adminDashboard, doctorDashboard, userDashboard,} = require("../controllers/dashboardController");

router.get("/admin", auth, admin, adminDashboard);
router.get("/doctor", auth, doctor, doctorDashboard);
router.get("/user", auth, userDashboard);

module.exports = router;