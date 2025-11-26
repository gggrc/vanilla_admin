function toggleFilter() {
  const popup = document.querySelector('.filter-popup');
  const overlay = document.querySelector('.filter-overlay');
  
  if (popup.style.display === 'block') {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }
}

function closeFilter() {
  document.querySelector('.filter-popup').style.display = 'none';
  document.querySelector('.filter-overlay').style.display = 'none';
}

function filterBy(tolerance) {
  // Implement filter logic here
  console.log('Filter by:', tolerance);
  
  // Remove active class from all options
  document.querySelectorAll('.filter-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Add active class to clicked option
  event.target.classList.add('active');
  
  // Filter logic based on tolerance status
  if (tolerance === 'all') {
    // Show all users
    console.log('Showing all users');
  } else if (tolerance === 'past') {
    // Show users with past tolerance
    console.log('Showing users with past tolerance');
  } else if (tolerance === 'reach') {
    // Show users who reach tolerance
    console.log('Showing users who reach tolerance');
  }
  
  closeFilter();
}

// ========================================
// API CONFIGURATION
// ========================================
const API_URL = 'http://localhost:3000/api';

// ========================================
// AUTHENTICATION CHECK
// ========================================
function checkAuth() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '../login/index.html';
    return null;
  }
  
  const user = JSON.parse(userStr);
  if (user.role !== 'admin') {
    alert('Access denied. Admin only.');
    window.location.href = '../login/index.html';
    return null;
  }
  
  return user;
}

// ========================================
// FETCH STUDENTS FROM API
// ========================================
async function fetchStudents() {
  try {
    const response = await fetch(`${API_URL}/users/students`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      displayStudents(data.data.students);
    } else {
      console.error('Failed to fetch students:', data.message);
      showError('Failed to load student data');
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    showError('Connection error. Please check if backend is running.');
  }
}

// ========================================
// DISPLAY STUDENTS IN TABLE
// ========================================
function displayStudents(students) {
  const container = document.querySelector('.frame-2');
  if (!container) {
    console.error('Container not found');
    return;
  }

  // Keep header row
  const header = container.querySelector('.frame-3');
  
  // Clear all content (including loading message and old data)
  container.innerHTML = '';
  
  // Re-add header
  if (header) {
    container.appendChild(header);
  }

  // Check if no students
  if (!students || students.length === 0) {
    const noData = document.createElement('div');
    noData.style.textAlign = 'center';
    noData.style.padding = '40px';
    noData.style.color = '#666';
    noData.innerHTML = '<p>No students found</p>';
    container.appendChild(noData);
    return;
  }

  // Add student rows
  students.forEach((student, index) => {
    const row = document.createElement('div');
    // Alternate row classes
    row.className = index % 2 === 0 ? 'frame-4' : 'frame-6';
    row.style.cursor = 'pointer';

    row.innerHTML = `
      <div class="frame-5"><div class="text-wrapper-3">${student.nim || '-'}</div></div>
      <div class="frame-5"><div class="text-wrapper-3">${student.full_name}</div></div>
      <div class="frame-5"><div class="text-wrapper-3">2023</div></div>
    `;

    // Click to view detail
    row.addEventListener('click', () => {
      window.location.href = `../userlist_manage/index.html?id=${student.user_id}`;
    });

    // Hover effects
    row.addEventListener('mouseenter', () => {
      row.style.backgroundColor = '#f8f9fa';
    });

    row.addEventListener('mouseleave', () => {
      row.style.backgroundColor = '';
    });

    container.appendChild(row);
  });

  console.log(`✅ Displayed ${students.length} students from database`);
}

// ========================================
// ERROR DISPLAY
// ========================================
function showError(message) {
  console.error(message);
  // Only show alert for critical errors, not for refresh failures
  // alert(message);
}

// ========================================
// INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const user = checkAuth();
  if (!user) return;

  // Fetch students
  fetchStudents();

  // Auto-refresh every 30 seconds
  setInterval(fetchStudents, 30000);
});
