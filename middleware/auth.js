const jwt = require('jsonwebtoken');
const asycHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/UserModel');



// Protect routes
exports.protect = asycHandler(async (req, res, next) => {
    let token;

    // Check if it JWT
    if
        (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return res.redirect('/auth/login');
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { ignoreExpiration: true });

        // Get the user with ID
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (err) {
        return next(new ErrorResponse(' غير مصرح لك الدخول الى هنا ☹', 401));
    }

});
// Grant accses to specifix roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorize to access this route`, 403));
        }
        next();
    };
};

// Add User if exists
exports.getLoginUser = asycHandler(async (req, res, next) => {
    let token;

    // Check if it JWT
    if
        (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { ignoreExpiration: true });
        // Get the user with ID
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (err) {
        console.log('err', err);
        return next(new ErrorResponse(' غير مصرح الدخول الى هنا :( ', 401, true));
    }

});