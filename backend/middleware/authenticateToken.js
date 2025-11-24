const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('🛡 Authorization header:', authHeader);
  console.log('🔐 JWT Secret exists:', !!process.env.ACCESS_TOKEN_SECRET);

  let token = null;

  // Bóc tách token nếu header hợp lệ
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1].replace(/"/g, '').trim(); // loại bỏ dấu ngoặc kép nếu có
    }
  }

  console.log('🔑 Extracted token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Token không được cung cấp.' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Token verification error:', err);
      return res.status(403).json({ message: 'Token không hợp lệ.' });
    }

    console.log('✅ Decoded token payload:', decoded); // Đây nên chứa { _id, email, ... }

    req.user = decoded; // Gắn payload vào req.user
    next(); // Chuyển sang middleware/route tiếp theo
  });
};

module.exports = authenticateToken;
