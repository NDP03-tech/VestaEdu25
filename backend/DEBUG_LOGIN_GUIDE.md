# Hướng dẫn Debug và Test Login Admin

## Vấn đề đã được sửa

### 1. Lỗi Sequelize vs Mongoose
- **Vấn đề**: Code đang sử dụng cú pháp Mongoose (`user._id`, `new User()`, `user.save()`) nhưng database đang dùng Sequelize
- **Đã sửa**: 
  - `user._id` → `user.id`
  - `new User()` → `User.create()`
  - `user.save()` → `await User.create()`
  - `User.findOne({ email })` → `User.findOne({ where: { email } })`

### 2. Lỗi CORS
- **Vấn đề**: Backend chỉ cho phép origin `https://vestaedu.online` nhưng frontend đang chạy trên `localhost:3000`
- **Đã sửa**: Thêm `http://localhost:3000` và `http://localhost:3001` vào danh sách origin được phép

### 3. Route `/register` bị thiếu
- **Vấn đề**: Route `/register` bị thiếu phần khai báo đầy đủ
- **Đã sửa**: Thêm `('/register', async (req, res) => {` vào route

## Cách test và debug

### Bước 1: Tạo tài khoản admin
```bash
cd backend
node scripts/createAdmin.js
```

Tài khoản admin mẫu:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

### Bước 2: Khởi động backend
```bash
cd backend
npm start
# hoặc
node index.js
```

### Bước 3: Khởi động frontend
```bash
cd echooling-react-main
npm start
```

### Bước 4: Test login
1. Mở trình duyệt và vào `http://localhost:3000/login`
2. Đăng nhập với tài khoản admin:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Kiểm tra console để xem log debug

### Bước 5: Debug nếu vẫn lỗi

#### Kiểm tra console backend:
- Xem log "Đang cố gắng đăng nhập với email: ..."
- Xem log "Kết quả so sánh: ..."
- Xem log "✅ Decoded token payload: ..."

#### Kiểm tra console frontend:
- Xem log "Lỗi đăng nhập: ..."
- Kiểm tra Network tab trong DevTools để xem request/response

#### Kiểm tra database:
```sql
-- Kiểm tra user admin có tồn tại không
SELECT * FROM users WHERE email = 'admin@example.com';

-- Kiểm tra role của user
SELECT id, email, role FROM users WHERE role = 'admin';
```

## Các endpoint API để test

### 1. Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### 2. Tạo admin mới
```bash
curl -X POST http://localhost:5000/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin2@example.com", "password": "admin123"}'
```

### 3. Đăng ký user mới
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "user123", "role": "user"}'
```

## Troubleshooting

### Lỗi 400 Bad Request
- Kiểm tra email và password có đúng không
- Kiểm tra database connection
- Kiểm tra console log để xem chi tiết lỗi

### Lỗi 401 Unauthorized
- Kiểm tra email có tồn tại trong database không
- Kiểm tra password có đúng không
- Kiểm tra bcrypt hash có hoạt động không

### Lỗi 403 Forbidden
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra ACCESS_TOKEN_SECRET trong .env
- Kiểm tra token có hết hạn không

### Lỗi CORS
- Kiểm tra origin trong CORS config
- Đảm bảo frontend đang chạy trên port được phép
- Kiểm tra preflight request

## Log quan trọng cần theo dõi

### Backend logs:
```
Đang cố gắng đăng nhập với email: admin@example.com
Kết quả so sánh: true
✅ Decoded token payload: { id: 1, role: 'admin' }
```

### Frontend logs:
```
User logged in: true
ProtectedRoute - isLoggedIn: true role: admin
```

Nếu bạn vẫn gặp lỗi, hãy chia sẻ log từ console để tôi có thể hỗ trợ thêm.


