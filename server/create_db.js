const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default DB to create new one
    password: 'adnan2580',
    port: 5432,
});

async function createDatabase() {
    try {
        await client.connect();
        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'demo_chat_bot'");
        if (res.rowCount === 0) {
            console.log("Database demo_chat_bot does not exist. Creating...");
            await client.query('CREATE DATABASE demo_chat_bot');
            console.log("Database created.");
        } else {
            console.log("Database demo_chat_bot already exists.");
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
