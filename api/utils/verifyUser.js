const { errorHandler } = require('./error');
const jwt = require('jsonwebtoken');

exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return next(errorHandler(401, "Access token not provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return next(errorHandler(401, "Invalid or expired token"));
      }

      req.user = {
        id: decoded.id,
        isAdmin: decoded.isAdmin,
        email: decoded.email,
        username: decoded.username
      };

      next();
    });
  } catch (error) {
    next(errorHandler(500, "Failed to verify user"));
  }
};
