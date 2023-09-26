// middleware/auth.js

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

module.exports = {
    checkAppToken,
    checkOrigin
};