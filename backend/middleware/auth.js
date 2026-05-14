const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// מידלוור אימות — בודק JWT בכותרת Authorization
// מצפה לפורמט: "Bearer <token>"
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'נדרשת התחברות.' });
  }

  try {
    // מאמת את הטוקן ומוסיף את פרטי המשתמש לאובייקט הבקשה
    req.user = jwt.verify(authHeader.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'טוקן לא תקין או פג תוקף.' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
