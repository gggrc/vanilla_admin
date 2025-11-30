// Backend Server for Smart Attendance System
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load .env from root directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend to connect from different port
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/permissions', permissionRoutes);

// --- START PERBAIKAN DEPLOYMENT FRONTEND ---

// 1. Tentukan path absolut ke folder 'public'
const publicDir = path.join(__dirname, '..', 'public');

// 2. Melayani file statis dari folder 'public'
// Ini akan membuat semua aset (CSS, JS, images) di dalam 'public' dapat diakses dari root server.
app.use(express.static(publicDir));

// 3. Tentukan rute root '/' untuk mengarahkan ke halaman login sebagai entry point
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'pages', 'login', 'index.html'));
});

// --- END PERBAIKAN DEPLOYMENT FRONTEND ---


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;