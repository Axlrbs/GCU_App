const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ||'dev-secret'); // Change "SECRET" pour un .env plus tard
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};
