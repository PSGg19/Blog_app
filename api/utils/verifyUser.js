const { errorHandler } = require('./error');
const jwt = require('jsonwebtoken');

// Middleware to verify the user based on the access token in the cookies
exports.verifyUser = async (req, res, next) => {
  try {
    // Retrieve the token from the cookies
    const token = req.cookies?.access_token;

    // If no token is found, return an error response
    if (!token) {
      return next(errorHandler(401, "Access token not provided"));
    }

    // Verify the token using the JWT_SECRET environment variable
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // If there's an error verifying the token or if it's expired, return an error response
      if (err || !decoded) {
        return next(errorHandler(401, "Invalid or expired token"));
      }

      // If the token is valid, attach the decoded user information to the request object
      req.user = {
        id: decoded.id,
        isAdmin: decoded.isAdmin,
        email: decoded.email,
        username: decoded.username
      };

      // Pass the request to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Handle unexpected errors and pass them to the error handler
    next(errorHandler(500, "Failed to verify user"));
  }
};
