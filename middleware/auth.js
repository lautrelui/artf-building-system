// Authentication middleware

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    // For API calls, return JSON error
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // For page requests, redirect to login
    res.redirect('/login');
}

function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    res.redirect('/');
}

// Public routes that don't require authentication
const publicPaths = ['/login', '/api/auth/login', '/api/auth/status', '/css/', '/js/', '/images/', '/favicon.ico'];

function isPublicPath(path) {
    return publicPaths.some(publicPath => path.startsWith(publicPath));
}

module.exports = {
    requireAuth,
    requireAdmin,
    isPublicPath
};
