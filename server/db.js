require("dotenv").config({ path: "../.env" });
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ---- READ FUNCTIONS ----

async function getCourses() {
  const { rows } = await pool.query("SELECT * FROM courses");
  return rows;
}

async function getCourseLevels(courseId) {
  const { rows } = await pool.query(
    "SELECT * FROM course_levels WHERE course_id = $1",
    [courseId]
  );
  return rows;
}

async function getPrograms() {
  const { rows } = await pool.query("SELECT * FROM programs");
  return rows;
}

async function getAdmissions() {
  const { rows } = await pool.query("SELECT * FROM admissions");
  return rows;
}

async function getServices() {
  const { rows } = await pool.query("SELECT * FROM services");
  return rows;
}

module.exports = {
  pool,
  getCourses,
  getCourseLevels,
  getPrograms,
  getAdmissions,
  getServices,
};
