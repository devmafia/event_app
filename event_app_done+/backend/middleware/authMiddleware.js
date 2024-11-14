const jwt = require('jsonwebtoken');
const { jwtSecret, jwtAdminSecret } = require('../config/jwt');

const authUserMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = decoded.id;
        // console.log(req.userId);
        next();
    });
};

const authAdminMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, jwtAdminSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = { authUserMiddleware, authAdminMiddleware };