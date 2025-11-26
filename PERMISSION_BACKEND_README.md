# Permission Request Management - Backend & Frontend Implementation

## 📋 Overview
Backend dan frontend untuk mengelola permission request (izin) mahasiswa dengan fitur approve/reject oleh admin.

---

## 🗄️ Database Schema

### Table: `permissions`
```sql
- permission_id (PK)
- enrollment_id (FK → enrollments)
- permission_date (date izin)
- start_time (waktu mulai izin)
- end_time (waktu selesai izin)
- reason (alasan: Sick, Family Emergency, Medical Appointment, dll)
- description (deskripsi lengkap dari mahasiswa)
- evidence (link gambar/file bukti - bisa NULL)
- status (enum: 'pending', 'approved', 'rejected')
- submitted_at (timestamp submit)
- approved_at (timestamp approve/reject - NULL jika pending)
- approved_by (user_id admin yang approve/reject - NULL jika pending)
- created_at
- updated_at
```

---

## 🔌 Backend API Endpoints

### 1. **GET /api/permissions**
Mendapatkan semua permission requests dengan filter optional.

**Query Parameters:**
- `status` (optional): `'pending'` | `'approved'` | `'rejected'` | `'all'`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "1",
      "enrollment_id": "57",
      "student_id": "user_123",
      "nim": "01082230017",
      "name": "TEOFILUS SATRIA RADA INSANI",
      "email": "student@example.com",
      "course_code": "CS101",
      "course_name": "Computer Science",
      "permission_date": "2025-11-24",
      "start_time": "01:00:00",
      "end_time": "02:00:00",
      "reason": "Sick",
      "description": "Medical reason...",
      "evidence": "https://cloud.example.com/image.jpg",
      "status": "pending",
      "submitted_at": "2025-11-16T08:12:32.784Z",
      "approved_at": null,
      "approved_by": null
    }
  ]
}
```

---

### 2. **GET /api/permissions/:permissionId**
Mendapatkan detail lengkap permission request termasuk schedule information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "enrollment_id": "57",
    "student": {
      "id": "user_123",
      "nim": "01082230017",
      "name": "TEOFILUS SATRIA RADA INSANI",
      "email": "student@example.com"
    },
    "course": {
      "id": "course_123",
      "code": "CS101",
      "name": "Computer Science"
    },
    "schedule": {
      "day": "Monday",
      "start_time": "08:45:00",
      "end_time": "11:25:00",
      "room": "Lab A"
    },
    "permission_date": "2025-11-24",
    "start_time": "01:00:00",
    "end_time": "02:00:00",
    "reason": "Sick",
    "description": "Medical reason...",
    "evidence": "https://cloud.example.com/image.jpg",
    "status": "pending",
    "submitted_at": "2025-11-16T08:12:32.784Z",
    "approved_at": null,
    "approved_by": null
  }
}
```

---

### 3. **PATCH /api/permissions/:permissionId/status**
Update status permission (approve atau reject). Hanya bisa dilakukan untuk permission dengan status `pending`.

**Request Body:**
```json
{
  "status": "approved",  // 'approved' atau 'rejected'
  "admin_id": "admin_user_id"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Permission approved successfully",
  "data": {
    "permission_id": "1",
    "status": "approved",
    "approved_at": "2025-11-27T10:30:00.000Z",
    "approved_by": "admin_user_id"
  }
}
```

**Error Cases:**
- Status bukan pending → `400 Bad Request`
- Permission tidak ditemukan → `404 Not Found`
- Invalid status value → `400 Bad Request`

---

## 🖥️ Frontend Implementation

### Page Structure

#### 1. **Request List Page** (`/src/pages/request_list/`)
Menampilkan semua permission requests dalam bentuk tabel.

**Features:**
- Tabel dengan 3 kolom: From, To, Status
- Filter: All, Pending, By date, This week
- Click row untuk melihat detail
- Status badge dengan warna (Pending=Orange, Approved=Green, Rejected=Red)
- Auto-load data dari backend
- Loading indicator
- Error handling

**Key Functions:**
```javascript
fetchPermissions(status)      // Fetch data dari API
displayPermissions(permissions) // Render tabel
formatTime(timeString)         // Format HH:mm:ss → HH:mmAM/PM
formatDate(dateString)         // Format YYYY-MM-DD → DD Mon, YY
```

---

#### 2. **Request Manage Pages** (`/src/pages/request_list_manage/`)

##### **Pending Page** (`pending/index.html`)
Untuk permission yang belum diproses.

**Features:**
- Semua detail permission
- Tombol **Approve** dan **Reject**
- Display image dari evidence link
- Class information dari schedule
- Konfirmasi sebelum approve/reject
- Redirect ke request list setelah update

**Key Functions:**
```javascript
fetchPermissionDetail(id)           // Get detail dari API
displayPermissionDetail(permission) // Render semua detail
updatePermissionStatus(id, status)  // PATCH request ke API
```

---

##### **Approved Page** (`approved/index.html`)
Untuk permission yang sudah di-approve.

**Features:**
- View-only (tidak ada tombol approve/reject)
- Badge "APPROVED" di atas
- Semua detail permission
- Display image dari evidence link

---

##### **Rejected Page** (`rejected/index.html`)
Untuk permission yang ditolak.

**Features:**
- View-only (tidak ada tombol approve/reject)
- Badge "REJECTED" di atas
- Semua detail permission
- Display image dari evidence link

---

## 🔄 Data Flow

### 1. Request List Flow
```
User opens request_list page
    ↓
checkAuth() - verify admin
    ↓
fetchPermissions('all') - GET /api/permissions
    ↓
displayPermissions(data) - render table
    ↓
User clicks row → redirect to request_list_manage/{status}/index.html?id={permissionId}
```

### 2. Request Detail Flow (Pending)
```
User opens pending detail page
    ↓
checkAuth() - verify admin
    ↓
getPermissionIdFromURL() - extract ?id=
    ↓
fetchPermissionDetail(id) - GET /api/permissions/:id
    ↓
displayPermissionDetail(data) - render all details + image
    ↓
User clicks "Approve" or "Reject"
    ↓
Confirmation dialog
    ↓
updatePermissionStatus(id, status, admin_id) - PATCH /api/permissions/:id/status
    ↓
Success → redirect to request_list
```

### 3. Request Detail Flow (Approved/Rejected)
```
User opens approved/rejected detail page
    ↓
checkAuth() - verify admin
    ↓
getPermissionIdFromURL() - extract ?id=
    ↓
fetchPermissionDetail(id) - GET /api/permissions/:id
    ↓
displayPermissionDetail(data) - render all details (view-only)
```

---

## 📸 Image/Evidence Display

Evidence images ditampilkan dari kolom `evidence` (link cloud storage):

```javascript
// Jika ada evidence
if (permission.evidence) {
  img.src = permission.evidence;  // Set src ke cloud link
  img.style.display = 'block';
} else {
  // Show "No evidence image provided"
  img.style.display = 'none';
}
```

**Supported:**
- Cloud storage links (Supabase Storage, AWS S3, Cloudinary, dll)
- Direct image URLs
- NULL values (akan show fallback message)

---

## 🎨 Status Styling

### CSS Classes untuk Status:
```css
.text-wrapper-4 → Pending (Orange: #FFA500)
.text-wrapper-5 → Approved (Green: #28a745)
.text-wrapper-6 → Rejected (Red: #dc3545)
```

### Reason Styling:
```css
.reason-sick → Red color
.reason-family → Purple color
.reason-medical → Blue color
```

---

## ✅ Validation & Error Handling

### Backend Validations:
1. Status harus 'approved' atau 'rejected'
2. Permission harus dalam status 'pending' untuk di-update
3. Admin ID wajib diisi
4. Permission ID harus valid

### Frontend Validations:
1. Authentication check (admin only)
2. Permission ID harus ada di URL
3. Confirmation dialog sebelum approve/reject
4. Loading indicator selama API call
5. Error message jika gagal

---

## 🚀 Testing Guide

### 1. Test Request List
```bash
# Backend running
npm run dev

# Browser
Open: http://localhost:5500/src/pages/request_list/index.html

Expected:
- Login sebagai admin
- Melihat list permissions
- Click row → redirect ke detail
- Filter bekerja (All, Pending, dll)
```

### 2. Test Approve Permission
```bash
Open: http://localhost:5500/src/pages/request_list_manage/pending/index.html?id=1

Steps:
1. Lihat detail permission
2. Click "Approve"
3. Confirm dialog
4. Check status di database → 'approved'
5. Check approved_at → filled
6. Check approved_by → admin_user_id
```

### 3. Test Reject Permission
```bash
Open: http://localhost:5500/src/pages/request_list_manage/pending/index.html?id=2

Steps:
1. Lihat detail permission
2. Click "Reject"
3. Confirm dialog
4. Check status di database → 'rejected'
```

### 4. Test View Only (Approved/Rejected)
```bash
Open: http://localhost:5500/src/pages/request_list_manage/approved/index.html?id=1

Expected:
- Tidak ada tombol Approve/Reject
- Badge "APPROVED" terlihat
- Semua detail ditampilkan
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Permission ID not found in URL"
**Solution:** Pastikan URL memiliki parameter `?id=xxx`

### Issue 2: "Failed to load permission detail"
**Solution:** 
- Check backend running di port 3000
- Check permission_id exist di database
- Check CORS enabled

### Issue 3: Image tidak muncul
**Solution:**
- Check `evidence` column berisi valid URL
- Check CORS policy dari cloud storage
- Check image format (jpg, png, webp)

### Issue 4: "Cannot update permission. Current status is already approved"
**Solution:** Permission sudah di-approve/reject sebelumnya. Hanya pending permission yang bisa di-update.

---

## 📦 Files Created/Modified

### Backend:
```
✅ backend/controllers/permissionController.js (NEW)
✅ backend/routes/permissionRoutes.js (NEW)
✅ backend/server.js (MODIFIED - added permission routes)
```

### Frontend:
```
✅ src/pages/request_list/script.js (MODIFIED - full implementation)
✅ src/pages/request_list_manage/pending/script.js (MODIFIED - full implementation)
✅ src/pages/request_list_manage/approved/script.js (NEW)
✅ src/pages/request_list_manage/rejected/script.js (NEW)
✅ src/pages/request_list_manage/pending/index.html (MODIFIED - script src)
✅ src/pages/request_list_manage/approved/index.html (MODIFIED - script src)
✅ src/pages/request_list_manage/rejected/index.html (MODIFIED - script src)
```

---

## 🎯 Next Steps (Optional Enhancements)

1. **Pagination** - Handle large number of permissions
2. **Date Range Filter** - Filter by custom date range
3. **Search** - Search by student name/NIM
4. **Notifications** - Email/push notification to student after approve/reject
5. **Audit Log** - Track who approved/rejected what and when
6. **Bulk Actions** - Approve/reject multiple permissions at once
7. **Export** - Export permission data to Excel/PDF
8. **Statistics** - Dashboard showing approval rate, pending count, etc.

---

## 📞 API Testing dengan cURL

### Get All Permissions
```bash
curl http://localhost:3000/api/permissions
```

### Get Pending Only
```bash
curl http://localhost:3000/api/permissions?status=pending
```

### Get Permission Detail
```bash
curl http://localhost:3000/api/permissions/1
```

### Approve Permission
```bash
curl -X PATCH http://localhost:3000/api/permissions/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","admin_id":"admin_user_id"}'
```

### Reject Permission
```bash
curl -X PATCH http://localhost:3000/api/permissions/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"rejected","admin_id":"admin_user_id"}'
```

---

## ✨ Summary

Backend dan frontend untuk Permission Request Management sudah **COMPLETE** dengan fitur:

✅ Backend API (3 endpoints)
✅ Request List page dengan filter
✅ Request Manage pages (pending/approved/rejected)
✅ Approve/Reject functionality
✅ Image/Evidence display dari cloud link
✅ Status tracking & validation
✅ Error handling & loading states
✅ Authentication checks
✅ Responsive design

**Status:** Ready for Testing! 🚀
