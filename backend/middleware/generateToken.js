const jwt = require('jsonwebtoken');

// Dữ liệu người dùng mẫu
const userPayload = {
  id: '682f3bee3d921566ffbdae80',
  role: 'user'
};

// Tạo token với secret = '241221'
const token = jwt.sign(userPayload, '241221', { expiresIn: '1h' });

console.log('Generated token:', token);
