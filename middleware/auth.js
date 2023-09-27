// middleware/auth.js

function ensureAuthenticated(req, res, next) {
    // Get the token from the Authorization header
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'pledge4earth');
        // If token is valid, store the user payload in req.user
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

// Middleware to check for the application token

function checkAppToken(req, res, next) {
    const expectedToken = 'YOUR_APPLICATION_TOKEN'; 
    const token = req.headers['x-app-token'];

    if (!token || token !== expectedToken) {
        return res.status(401).json({ message: 'Invalid application token' });
    }

    next();
}

// Middleware to check request's origin or IP
function checkOrigin(req, res, next) {
    const allowedHostnames = ['https://lead4earth.org', 'https://127.0.0.1'];
    const origin = req.headers.origin;

    if (!origin || !allowedHostnames.includes(origin)) {
        return res.status(403).json({ message: 'Request origin not allowed' });
    }

    next();
}

module.exports = ensureAuthenticated;
