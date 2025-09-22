import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  try {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.split(' ')[1] : null;

    if (!token) {
      return res.json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
    if (decoded.role !== 'admin') {
      return res.json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('adminAuth error:', error);
    return res.json({ success: false, message: 'Invalid token.' });
  }
};
