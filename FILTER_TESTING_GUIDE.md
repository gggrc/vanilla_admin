# Filter Testing Guide - Request List

## Masalah yang Diperbaiki

### 1. ✅ Filter by Date (9 Desember 2025)
**Masalah:** Data dengan permission_date "2025-12-09" tidak muncul saat filter by date dipilih.

**Penyebab:** 
- Format date dari calendar menggunakan `toISOString()` yang menghasilkan timezone UTC
- Perbandingan string tidak match karena format berbeda

**Solusi:**
- Mengubah format tanggal manual: `YYYY-MM-DD` dengan padding zero
- Menambahkan console.log untuk debugging
- Format: `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`

**Test:**
1. Buka halaman Request List
2. Klik tombol Filter
3. Pilih "By date"
4. Pilih tanggal 9 Desember 2025
5. Klik Confirm
6. Data dengan tanggal 9 Desember harus muncul
7. Periksa console log untuk melihat proses filtering

### 2. ✅ Filter by Week (This Week)
**Masalah:** Filter "This week" tidak berfungsi dengan benar.

**Penyebab:**
- Parsing Date dari string database tidak mempertimbangkan timezone
- Perbandingan date object dengan string tidak akurat

**Solusi:**
- Menambahkan 'T00:00:00' saat parsing date dari database
- Format: `new Date(permission.permission_date + 'T00:00:00')`
- Week range: Minggu (Sunday) sampai Sabtu (Saturday)
- Menggunakan current date sebagai reference

**Test (Tanggal hari ini: 27 November 2025 - Rabu):**
- Week start: 23 November 2025 (Minggu)
- Week end: 29 November 2025 (Sabtu)
- Data dengan permission_date dalam range ini harus muncul

**Test Steps:**
1. Buka halaman Request List
2. Klik tombol Filter
3. Pilih "This week"
4. Data dalam minggu ini (23-29 Nov 2025) harus muncul
5. Periksa console log untuk week range

### 3. ✅ Filter Pending
**Masalah:** Filter pending mungkin tidak menampilkan data yang benar.

**Solusi:**
- Fetch semua data terlebih dahulu ke `allPermissions`
- Client-side filtering berdasarkan status
- Filter: `allPermissions.filter(p => p.status === 'pending')`

**Test:**
1. Buka halaman Request List
2. Klik tombol Filter
3. Pilih "Pending"
4. Hanya data dengan status "pending" yang muncul

**Note:** Data sample saat ini berstatus "approved", jadi filter pending akan menghasilkan 0 results.

### 4. ✅ Filter All
**Solusi:**
- Menampilkan semua data dari `allPermissions`
- Tidak ada filtering

**Test:**
1. Buka halaman Request List
2. Klik tombol Filter
3. Pilih "All"
4. Semua data harus muncul (1 permission dengan ID 5)

## Navigation Bar Issue

### Masalah: Navigation bar tidak berfungsi di halaman request_list_manage
**Symptom:** Klik pada link navigation tidak berpindah halaman

**Penyebab yang mungkin:**
1. JavaScript error yang menghalangi event listener
2. Path relatif yang salah
3. DOMContentLoaded race condition

**Solusi yang Diterapkan:**
1. ✅ Menambahkan console.log di navigation.js untuk debugging
2. ✅ Memverifikasi path relatif: `../../../../navigation.js` (benar)
3. ✅ Navigation.js dimuat setelah script.js untuk menghindari konflik

**Test:**
1. Buka halaman Pending Detail: `request_list_manage/pending/index.html?id=5`
2. Buka Browser Console (F12)
3. Periksa log: "🧭 Navigation.js loaded"
4. Periksa log: "✅ Back button found"
5. Periksa log: "🔗 Found X navigation links"
6. Klik pada navigation link (Dashboard, Request list, User list, Camera Log)
7. Halaman harus berpindah ke halaman yang diklik

**Debugging Console Commands:**
```javascript
// Cek apakah navigation.js dimuat
console.log('Navigation loaded?', typeof navLinks !== 'undefined');

// Cek apakah navigation links ada
document.querySelectorAll('.frame-12 a').length;

// Cek href dari setiap link
document.querySelectorAll('.frame-12 a').forEach(link => {
  console.log(link.textContent.trim(), '->', link.href);
});

// Manual test click
document.querySelector('.frame-12 a[href*="dashboard"]').click();
```

## Data Sample untuk Testing

Berdasarkan API response:
```json
{
  "id": 5,
  "student_id": "01082230015",
  "nim": "01082230017",
  "name": "Prabowo Subianto",
  "course_code": "INF20054",
  "course_name": "Pemb. Aplikasi Platform Mobile",
  "permission_date": "2025-12-09",
  "start_time": "13:00:00",
  "end_time": "14:00:00",
  "reason": "Sick",
  "status": "approved"
}
```

**Expected Filter Results:**
- All: 1 result (ID 5)
- Pending: 0 results (status = "approved", bukan "pending")
- By date (9 Dec 2025): 1 result (ID 5)
- This week (23-29 Nov 2025): 0 results (permission_date = 9 Dec 2025, bukan dalam minggu ini)

## Cara Menjalankan Test

1. **Start Backend:**
```bash
npm run dev
```

2. **Buka Browser:**
- URL: http://127.0.0.1:[PORT]/src/pages/login/index.html
- Login sebagai admin

3. **Test Filter:**
- Navigate ke Request List
- Test semua filter satu per satu
- Periksa console log untuk debugging

4. **Test Navigation:**
- Navigate ke detail page (klik pada row)
- Test semua navigation link
- Periksa console log

## Console Logs yang Diharapkan

### Filter by Date (9 Dec 2025):
```
Selected date from calendar: Tue Dec 09 2025 00:00:00 GMT+0700
Filtering by date: 2025-12-09
All permissions: [{ id: 5, permission_date: "2025-12-09", ... }]
Comparing: 2025-12-09 with 2025-12-09
Filtered by date 2025-12-09: 1 results [{ id: 5, ... }]
```

### Filter by Week:
```
Week range: 2025-11-23 to 2025-11-29
All permissions: [{ id: 5, permission_date: "2025-12-09", ... }]
Date: 2025-12-09 In range? false
Filtered by week: 0 results []
```

### Navigation:
```
🧭 Navigation.js loaded
✅ Back button found
🔗 Found 4 navigation links
```

## Catatan Penting

1. **Data Status:** Data sample berstatus "approved", jadi filter "Pending" akan return 0 results. Ini NORMAL.

2. **Date Range:** Data dengan tanggal 9 Desember 2025 TIDAK akan muncul di filter "This week" (23-29 Nov 2025). Ini NORMAL.

3. **Browser Cache:** Jika perubahan tidak terlihat, clear browser cache (Ctrl+Shift+R atau Ctrl+F5).

4. **Console Logs:** Selalu periksa console untuk debugging message yang informatif.

5. **Path Issues:** Jika navigation tidak bekerja, periksa:
   - Browser console untuk errors
   - Network tab untuk failed script loads
   - Path relatif dari HTML file ke navigation.js

## Troubleshooting

### Filter tidak menampilkan hasil
- Periksa console log untuk "All permissions:" - pastikan data terload
- Periksa format tanggal di console
- Pastikan backend running di http://localhost:3000

### Navigation tidak bekerja
- Periksa console untuk error messages
- Periksa apakah navigation.js ter-load (Network tab)
- Test manual click via console
- Clear cache dan refresh

### Backend tidak responding
- Periksa terminal untuk error messages
- Restart backend: Ctrl+C, lalu `npm run dev`
- Test API: `curl http://localhost:3000/api/permissions`
