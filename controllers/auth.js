const User = require("../connection/db-config").User;
const {
    promisify
} = require("util");
const jwt = require("jsonwebtoken");

exports.isLogedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const foundUser = await User.findById(decoded.id);
            if (!foundUser) {
                return next();
            }
            req.user = foundUser;
            req.userRole = foundUser.role;

            // Continue with the request
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                error: 'Unauthorized, invalid token'
            });
        }
    } else {
        next();
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                error: 'Access denied. You do not have permission to perform this action.'
            });
        }
        next();
    };
};


exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000), // 2 seconds expiry
        httpOnly: true,
    });

    res.status(200).redirect('/');
};