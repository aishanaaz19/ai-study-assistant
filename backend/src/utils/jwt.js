import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null if not found
 */
export const extractTokenFromHeader = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove "Bearer " prefix
  }
  return null;
};

/**
 * Get token expiration time
 * @param {String} token - JWT token
 * @returns {Date} Expiration date
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    throw new Error('Invalid token format');
  }
};
