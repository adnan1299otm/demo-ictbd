const { pool } = require("./db");

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Test Successful:", res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("❌ DB Test Failed:", err.message);
    process.exit(1);
  }
})();
