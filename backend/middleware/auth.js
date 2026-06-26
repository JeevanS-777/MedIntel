const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Ensure system environment configurations are active
dotenv.config();

/**
 * Express Middleware to intercept, validate, and decode incoming User JWTs.
 * Guarantees protected endpoints cannot be reached without a verified session token.
 */
const authMiddleware = (req, res, next) => {
    // 1. Extract the Authorization header field
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Access Denied: No identification credentials provided in the "Authorization" header.' 
        });
    }

    // 2. Verify header format matching standard 'Bearer <JWT_TOKEN>' syntax
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ 
            error: 'Access Denied: Malformed token structure. Expected format: "Bearer <token>".' 
        });
    }

    const token = tokenParts[1];

    try {
        // 3. Cryptographically decode and verify token payload against internal JWT_SECRET string
        const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inject the user footprint payload directly into the active request object
        // This makes `req.user` globally available downstream in your route files (e.g., reports.js, chats.js)
        req.user = verifiedPayload; 

        // Token validated successfully! Hand control off to the target endpoint controller
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Authentication Failure: The provided session token is either expired, altered, or invalid.',
            details: error.message 
        });
    }
};

module.exports = authMiddleware;