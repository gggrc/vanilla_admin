# Smart Attendance Backend API

Backend server untuk Smart Attendance System menggunakan Express.js, Node.js, dan Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Akun Supabase

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables di file `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

3. Update admin password (jalankan sekali):
```bash
node backend/utils/hashPassword.js
```

4. Start server:
```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "filo123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": "00000000000",
      "full_name": "admin",
      "nim": "00000000000",
      "email": "admin@gmail.com",
      "role": "admin"
    },
    "token": null
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### Get Current User
```http
GET /api/auth/me
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

## 🗂️ Project Structure

```
vanilla_ADMIN/
├── backend/
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── routes/
│   │   └── authRoutes.js        # Authentication routes
│   ├── middleware/
│   │   └── (future middlewares)
│   ├── utils/
│   │   └── hashPassword.js      # Password hashing utility
│   └── server.js                # Main server file
├── config/
│   └── db.js                    # Supabase connection
├── src/
│   └── pages/
│       └── login/
│           └── script.js        # Frontend login script
├── .env                         # Environment variables
└── package.json
```

## 🔐 Login Credentials

**Admin:**
- Username: `admin` atau NIM: `00000000000`
- Password: `filo123`

**Student (example):**
- Username: NIM atau email mahasiswa
- Password: sesuai yang di-set di database

## 🛠️ Technologies

- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** bcryptjs
- **Frontend:** Vanilla JavaScript (no framework)

## 📝 Notes

- Password di-hash menggunakan bcryptjs dengan salt rounds 10
- Login bisa menggunakan NIM atau email
- Data user disimpan di localStorage setelah login sukses
- Backend menggunakan CORS untuk allow frontend dari port berbeda

## 🔜 Future Improvements

- [ ] JWT token authentication
- [ ] Session management
- [ ] Role-based access control (RBAC)
- [ ] API untuk user management (CRUD)
- [ ] API untuk attendance management
- [ ] API untuk absence requests
- [ ] File upload untuk evidence
- [ ] Rate limiting
- [ ] Input validation middleware
- [ ] Error logging
- [ ] API documentation (Swagger)

## 🐛 Troubleshooting

### Server tidak bisa start
- Pastikan port 3000 tidak digunakan aplikasi lain
- Check environment variables di `.env`
- Jalankan `npm install` untuk install semua dependencies

### Login gagal
- Pastikan password admin sudah di-hash dengan menjalankan `node backend/utils/hashPassword.js`
- Check koneksi ke Supabase
- Periksa credentials di database

### CORS error
- Pastikan backend server sudah running
- Check URL API di frontend (`http://localhost:3000/api`)
- Pastikan CORS middleware di-enable di `server.js`
