const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Setup storage layout engine for handling uploads safely
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Saves to backend/uploads/
    },
    filename: function (req, file, cb) {
        // Unique prefix assignment ensures users uploading files with matching names won't conflict
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Enforce strict file extensions filtering to safeguard against malicious code execution
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid document format: Only JPEG, PNG, and PDF files are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB absolute ceiling limit
});

// @route   POST /api/reports/upload
// @desc    Upload medical file, log metadata, and dispatch down to AI engine pipelines
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    // 1. Validation Check
    if (!req.file) {
        return res.status(400).json({ error: 'No medical document detected.' });
    }

    try {
        // 2. Database Persist
        const [reportResult] = await db.query(
            'INSERT INTO reports (user_id, report_name, file_path) VALUES (?, ?, ?)',
            [req.user.id, req.file.originalname, req.file.path]
        );
        
        const reportId = reportResult.insertId;

        // 3. Prepare clean JSON payload for Flask
        const aiPayload = {
            file_path: req.file.path,
            filename: req.file.originalname,
            report_id: reportId.toString()
        };

        // 4. Dispatch to Python AI Service
        // Ensure process.env.AI_SERVICE_URL is set to 'http://127.0.0.1:8000' or similar
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/process-report`, aiPayload, {
            headers: { 'Content-Type': 'application/json' }
        });

        // 5. Biomarker Parsing logic
        const { parsed_biomarkers, summary } = aiResponse.data;
        let biomarkersArray = [];
        try {
            biomarkersArray = typeof parsed_biomarkers === 'string' ? JSON.parse(parsed_biomarkers) : parsed_biomarkers;
        } catch (e) { biomarkersArray = []; }

        if (Array.isArray(biomarkersArray)) {
            for (const marker of biomarkersArray) {
                await db.query(
                    'INSERT INTO biomarkers (report_id, test_name, value, unit, reference_min, reference_max) VALUES (?, ?, ?, ?, ?, ?)',
                    [reportId, marker.test_name, marker.value, marker.unit, marker.reference_min, marker.reference_max]
                );
            }
        }

        return res.status(200).json({
            message: 'Medical file processed successfully.',
            report_id: reportId,
            summary: summary
        });

    } catch (error) {
        // This log will reveal exactly why the 500 error is happening
        console.error('BACKEND ROUTE ERROR (reports.js):', error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Document analysis pipeline processing failed.', 
            details: error.message 
        });
    }
});

// @route   GET /api/reports
// @desc    Retrieve list index history of processed documents owned by user
router.get('/', auth, async (req, res) => {
    try {
        const [reports] = await db.query(
            'SELECT * FROM reports WHERE user_id = ? ORDER BY upload_date DESC',
            [req.user.id]
        );
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve files ledger history listings.', details: error.message });
    }
});

module.exports = router;