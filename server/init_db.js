const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema migration...');
        await pool.query(schemaSql);
        console.log('Schema migration completed successfully.');

        // Seed initial users (optional, but good for testing)
        // await pool.query("INSERT INTO users (role) VALUES ('support') ON CONFLICT DO NOTHING");

        pool.end();
    } catch (err) {
        console.error('Error initializing database:', err);
        pool.end();
    }
}

initDb();
