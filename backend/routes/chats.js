const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Route 1: Post initial layout mount configuration hook
router.post('/', auth, async (req, res) => {
    console.log("Backend received body:", req.body);
    const reportId = req.body.reportId || req.body.report_id;

    if (!reportId) {
        return res.status(400).json({ error: 'Missing target reportId parameter.' });
    }

    try {
        let [chatSession] = await db.query(
            'SELECT id FROM chats WHERE user_id = ? AND report_id = ?',
            [req.user.id, reportId]
        );

        let chatId;
        if (chatSession.length === 0) {
            const [newChat] = await db.query(
                'INSERT INTO chats (user_id, report_id, chat_title) VALUES (?, ?, ?)',
                [req.user.id, reportId, req.body.chat_title || 'Medical Report Consultation Analysis']
            );
            chatId = newChat.insertId;
        } else {
            chatId = chatSession[0].id;
        }

        return res.status(200).json({ chat_id: chatId });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to mount active AI communication channel pipeline.', details: error.message });
    }
});

// Route 2: Send and record active chat messaging prompts
router.post('/message', auth, async (req, res) => {
    console.log("!!! HITTING THE BACKEND MESSAGE ROUTE !!!");
    console.log("Body payload received:", req.body);
    
    // 1. Force integer conversion to match your MySQL schema types safely
    const rawChatId = req.body.chat_id || req.body.chatId;
    const chat_id = rawChatId ? parseInt(rawChatId, 10) : null; 
    const message = req.body.message;

    if (!chat_id || !message) {
        return res.status(400).json({ error: 'Missing active target chat_id or empty query message string.' });
    }

    try {
        // 2. Destructure the query result as 'rows' to align with mysql2 promise layouts
        const [rows] = await db.query(
            'SELECT report_id FROM chats WHERE id = ? AND user_id = ?',
            [chat_id, req.user.id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Chat session not found.' });
        }

        const realReportId = rows[0].report_id; 

        // Insert user message
        await db.query(
            'INSERT INTO messages (chat_id, sender, message) VALUES (?, ?, ?)',
            [chat_id, 'user', message]
        );

        // Dispatches payload downstream to Flask Microservice container
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/query-context`, {
            report_id: realReportId.toString(), 
            query: message
        });

        const systemResponseText = aiResponse.data.response;

        // Insert AI response
        await db.query(
            'INSERT INTO messages (chat_id, sender, message) VALUES (?, ?, ?)',
            [chat_id, 'ai', systemResponseText]
        );

        return res.status(200).json({
            chat_id: chat_id,
            user_message: message,
            ai_response: systemResponseText
        });

    } catch (error) {
        console.error("Backend pipeline error:", error);
        return res.status(500).json({ 
            error: 'AI vector response streaming query channel pipeline collapsed.', 
            details: error.response?.data || error.message 
        });
    }
});

// Route 3: Fetch historical messages log array list strings 
router.get('/history/:report_id', auth, async (req, res) => {
    try {
        const [chatSession] = await db.query(
            'SELECT id FROM chats WHERE user_id = ? AND report_id = ?',
            [req.user.id, req.params.report_id]
        );

        if (chatSession.length === 0) {
            return res.status(200).json([]); 
        }

        const [historyLogs] = await db.query(
            'SELECT sender, message AS message_text, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC',
            [chatSession[0].id]
        );

        return res.status(200).json(historyLogs);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to rebuild chronological chat log strings.', details: error.message });
    }
});

// Route 4: Get active chat detail properties
// Route 4: Get active chat detail properties with joined report metadata
router.get('/:id', auth, async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user.id;

        // Joined with the reports table to securely fetch document name and ingestion date fields
        const [chatRows] = await db.query(
            'SELECT c.*, r.report_name, r.upload_date FROM chats c LEFT JOIN reports r ON c.report_id = r.id WHERE c.id = ? AND c.user_id = ?',
            [chatId, userId]
        );

        if (chatRows.length === 0) {
            return res.status(404).json({ error: 'Session contextual reference missing.' });
        }

        const [messageRows] = await db.query(
            'SELECT sender, message AS message_text, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC',
            [chatId]
        );

        return res.status(200).json({
            id: chatId,
            chat_title: chatRows[0]?.report_name || chatRows[0]?.chat_title || 'Blood Report.pdf',
            upload_date: chatRows[0]?.upload_date || null,
            messages: Array.isArray(messageRows) ? messageRows : []
        });

    } catch (error) {
        console.error("CRITICAL ROUTE EXCEPTION SAFETY CATCH:", error);
        return res.status(500).json({ error: 'Failed to parse session metrics.' });
    }
});

module.exports = router;