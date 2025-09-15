// Debug script để kiểm tra phân quyền
console.log('=== DEBUG PERMISSIONS ===');

// Kiểm tra session storage
const user = sessionStorage.getItem('user');
const userType = sessionStorage.getItem('userType');
const isLoggedIn = sessionStorage.getItem('isLoggedIn');

console.log('Session Storage:');
console.log('- isLoggedIn:', isLoggedIn);
console.log('- userType:', userType);
console.log('- user:', user ? JSON.parse(user) : null);

// Kiểm tra user type và quyền truy cập
if (user) {
  const userData = JSON.parse(user);
  console.log('\nUser Data:');
  console.log('- username:', userData.username);
  console.log('- userType:', userData.userType);
  console.log('- companyName:', userData.companyName);
  
  // Kiểm tra quyền truy cập dựa trên userType
  if (userData.userType === 'mst_custom') {
    console.log('\nMST Custom Permissions:');
    const allowedPaths = [
      '/dashboard',           // Trang chủ (basic)
      '/payment-management',  // Quản lý thanh toán
      '/debt-management',     // Q.lý xử lý nợ phí
      '/payment',             // Nộp phí cơ sở hạ tầng
      '/account',             // Thông tin tài khoản (basic)
      '/password',            // Đổi mật khẩu (basic)
      '/guide'                // Hướng dẫn (basic)
    ];
    console.log('Allowed paths:', allowedPaths);
  } else if (userData.userType === 'admin_custom') {
    console.log('\nAdmin Custom Permissions:');
    const allowedPaths = [
      '/dashboard',           // Trang chủ (basic)
      '/payment-management',  // Quản lý thanh toán
      '/debt-management',     // Q.lý xử lý nợ phí
      '/payment',             // Nộp phí cơ sở hạ tầng
      '/account',             // Thông tin tài khoản (basic)
      '/password',            // Đổi mật khẩu (basic)
      '/guide'                // Hướng dẫn (basic)
    ];
    console.log('Allowed paths:', allowedPaths);
  } else {
    console.log('\nOther user type:', userData.userType);
    console.log('Has access to all modules');
  }
} else {
  console.log('\nNo user data found in session storage');
}

console.log('\n=== END DEBUG ===');
