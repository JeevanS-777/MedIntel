const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 1. Initialize configuration environments
dotenv.config();

const app = express();

// 2. Global Request/Response Interceptor Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Ensure the local storage uploads directory exists on startup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 4. Serve the uploads directory statically so files can be fetched via HTTP URLs
app.use('/uploads', express.static(uploadsDir));

// 5. Import System Endpoint Routing Layers
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const chatRoutes = require('./routes/chats');

// 6. Bind Routing Blueprints to Global API Namespaces
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chats', chatRoutes);

// 7. Base Catch-All Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ONLINE', timestamp: new Date(), project: 'MedIntel' });
});

// 8. Global Error Handlers to prevent runtime application collapse
app.use((err, req, res, next) => {
    console.error('SYSTEM RUNTIME EXCEPTION:', err.stack);
    res.status(err.status || 500).json({
        error: 'An unhandled operational error occurred within the core backend layout.',
        details: err.message
    });
});

// 9. Fire up the API listener matrix
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MEDINTEL BACKEND CORE: Running seamlessly on http://localhost:${PORT}`);
});

module.exports = app;