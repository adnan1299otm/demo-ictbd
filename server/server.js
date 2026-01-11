const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db');
const { getAIResponse, summarizeConversation } = require('./ai');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- API ROUTES ---

// Create or Get Conversation
app.post('/api/chat/start', async (req, res) => {
    try {
        const { userId } = req.body; // In real app, auth token
        const result = await pool.query(
            "INSERT INTO conversations (summary) VALUES ($1) RETURNING *",
            ['New Conversation']
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get History
app.get('/api/chat/:id/history', async (req, res) => {
    try {
        const { id } = req.params;
        const msgs = await pool.query(
            "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
            [id]
        );
        const conv = await pool.query("SELECT * FROM conversations WHERE id = $1", [id]);
        res.json({ conversation: conv.rows[0], messages: msgs.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Support: Get All Conversations
app.get('/api/support/conversations', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 50"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Support: Take Over
app.post('/api/support/takeover', async (req, res) => {
    try {
        const { conversationId } = req.body;
        await pool.query(
            "UPDATE conversations SET handled_by = 'human', needs_human = false WHERE id = $1",
            [conversationId]
        );
        io.to(conversationId).emit('status_change', { handled_by: 'human' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Support: Release
app.post('/api/support/release', async (req, res) => {
    try {
        const { conversationId } = req.body;
        await pool.query(
            "UPDATE conversations SET handled_by = 'ai' WHERE id = $1",
            [conversationId]
        );
        io.to(conversationId).emit('status_change', { handled_by: 'ai' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SOCKET.IO LOGIC ---

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('user_message', async ({ conversationId, content }) => {
        try {
            // 1. Save User Message
            const userMsgResult = await pool.query(
                "INSERT INTO messages (conversation_id, sender, content) VALUES ($1, 'user', $2) RETURNING *",
                [conversationId, content]
            );
            const userMsg = userMsgResult.rows[0];

            // Emit to room immediately so user sees their own message (or ack it)
            // But usually frontend handles optimistic UI. We broadcast to support.
            io.to(conversationId).emit('message', userMsg);

            // 2. Check Conversation Status
            const convResult = await pool.query("SELECT * FROM conversations WHERE id = $1", [conversationId]);
            const conv = convResult.rows[0];

            if (conv.handled_by === 'ai') {
                // 3. Get AI Response
                // Fetch recent history for context
                const history = await pool.query(
                    "SELECT sender, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
                    [conversationId]
                );

                const { text, needsHuman } = await getAIResponse(history.rows, content);

                if (needsHuman) {
                    // Update DB to needs_human
                    await pool.query("UPDATE conversations SET needs_human = true WHERE id = $1", [conversationId]);

                    // Helper message from system/AI about handoff
                    const aiMsgResult = await pool.query(
                        "INSERT INTO messages (conversation_id, sender, content) VALUES ($1, 'ai', $2) RETURNING *",
                        [conversationId, text]
                    );
                    io.to(conversationId).emit('message', aiMsgResult.rows[0]);

                    // Notify Support Dashboard (via a global room or general emit)
                    io.emit('support_update');

                } else {
                    // Normal AI Response
                    const aiMsgResult = await pool.query(
                        "INSERT INTO messages (conversation_id, sender, content) VALUES ($1, 'ai', $2) RETURNING *",
                        [conversationId, text]
                    );
                    io.to(conversationId).emit('message', aiMsgResult.rows[0]);
                }
            } else {
                // Handled by human - do nothing (wait for support reply)
                // Just notify support dashboard that a new message arrived
                io.emit('support_new_message', { conversationId, content });
            }

            // Update timestamp
            await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId]);

        } catch (err) {
            console.error("Socket Error:", err);
        }
    });

    socket.on('support_message', async ({ conversationId, content, isImage }) => {
        try {
            const result = await pool.query(
                "INSERT INTO messages (conversation_id, sender, content, is_image) VALUES ($1, 'human', $2, $3) RETURNING *",
                [conversationId, content, isImage || false]
            );
            io.to(conversationId).emit('message', result.rows[0]);
            await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId]);
        } catch (err) {
            console.error("Support Msg Error:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- RETENTION POLICY (CRON) ---
// Run every day at midnight: '0 0 * * *'
cron.schedule('0 0 * * *', async () => {
    console.log('Running retention policy...');
    // In real implementation, fetching all old convos and summarizing is heavy.
    // Enhanced: Select old conversations
    const res = await pool.query("SELECT id FROM conversations WHERE updated_at < NOW() - INTERVAL '7 days'");

    for (const row of res.rows) {
        const msgs = await pool.query("SELECT * FROM messages WHERE conversation_id = $1", [row.id]);
        if (msgs.rows.length > 0) {
            const summary = await summarizeConversation(msgs.rows);
            await pool.query("UPDATE conversations SET summary = $1, updated_at = NOW() WHERE id = $2", [summary, row.id]);
            await pool.query("DELETE FROM messages WHERE conversation_id = $1", [row.id]);
        }
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
