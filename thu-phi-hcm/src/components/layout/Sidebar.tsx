import React, { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  isCollapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path)
  }

  const allNavItems = [
    {
      path: '/dashboard',
      label: 'TRANG CHỦ',
      icon: 'fas fa-home',
    },
    {
      path: '/fee-declaration',
      label: 'TỜ KHAI PHÍ',
      icon: 'fas fa-file-invoice',
      hasSubmenu: true,
      submenu: [
        { path: '/fee-declaration/manage', label: 'Quản lý tờ khai nộp phí' },
        { path: '/fee-declaration/barcode', label: 'Barcode tờ khai nộp phí' },
        { path: '/fee-declaration/debt-management', label: 'Quản lý nợ phí' }
      ]
    },
    {
      path: '/receipt-management',
      label: 'BIÊN LAI THU PHÍ',
      icon: 'fas fa-receipt',
      hasSubmenu: true,
      submenu: [
        { path: '/receipt-management/manage', label: 'Quản lý biên lai thu phí' }
      ]
    },
    {
      path: '/payment',
      label: 'NỘP PHÍ CƠ SỞ HẠ TẦNG',
      icon: 'fas fa-building',
      hasSubmenu: true,
      submenu: [
        { path: '/payment/declare', label: 'Khai báo nộp phí' },
        { path: '/payment/order', label: 'Đơn hàng thanh toán QR, Ecor' },
        { path: '/data-table', label: 'Danh sách biên lai' },
        { path: '/payment/process', label: 'Trình ký xử lý biên lai' },
        { path: '/reports/receipt-lookup', label: 'Tra cứu biên lai' },
        { path: '/debt-management/debt-status', label: 'Tra cứu nợ phí' }
      ]
    },
    {
      path: '/reports',
      label: 'BÁO CÁO THỐNG KÊ',
      icon: 'fas fa-chart-bar',
      hasSubmenu: true,
      submenu: [
        { path: '/reports/receipt-list', label: 'Bảng kê BL thu' },
        { path: '/reports/summary-by-warehouse', label: 'Tổng hợp theo kho' },
        { path: '/reports/summary-by-service', label: 'Tổng hợp thu dịch vụ' },
        { path: '/reports/summary-by-enterprise', label: 'Tổng hợp theo DN' },
        { path: '/reports/detailed-report', label: 'Báo cáo ấn chỉ' },
        { path: '/reports/receipt-usage-history', label: 'Tình hình sử dụng BL' },
        { path: '/reports/collection-summary', label: 'Tổng hợp thu theo CB lập' }
      ]
    },
    {
      path: '/debt-management',
      label: 'Q.LÝ XỬ LÝ NỢ PHÍ',
      icon: 'fas fa-exclamation-triangle',
      hasSubmenu: true,
      submenu: [
        { path: '/debt-management/debt-status', label: 'Tra cứu tình trạng nợ phí' },
        { path: '/debt-management/business-services', label: 'Thực hiện nghiệp vụ' },
        { path: '/debt-management/create-qr-code', label: 'Tạo lập QĐ cưỡng chế' }
      ]
    },
    {
      path: '/data-reconciliation',
      label: 'ĐỐI SOÁT DỮ LIỆU',
      icon: 'fas fa-sync-alt',
      hasSubmenu: true,
      submenu: [
        { path: '/data-reconciliation/initialize', label: 'Khởi tạo' },
        { path: '/data-reconciliation/manage-list', label: 'Quản lý danh sách đối soát' },
        { path: '/data-reconciliation/customs-report', label: 'Báo cáo đối soát Hải Quan' }
      ]
    },
    {
      path: '/payment-management',
      label: 'QUẢN LÝ THANH TOÁN',
      icon: 'fas fa-credit-card',
      hasSubmenu: true,
      submenu: [
        { path: '/payment-management/manage', label: 'Quản lý thanh toán' },
        { path: '/payment-management/cancel', label: 'Hủy thanh toán' },
        { path: '/payment-management/restore', label: 'Khôi phục thanh toán' },
        { path: '/payment-management/notify-transfer', label: 'TB chuyển tiền về KB' },
        { path: '/payment-management/manage-transfer', label: 'QL chuyển tiền về KB' },
        { path: '/payment-management/bank-reconciliation', label: 'Đối soát dữ liệu thanh toán từ ngân hàng' }
      ]
    },
    {
      path: '/business-categories',
      label: 'DANH MỤC NGHIỆP VỤ',
      icon: 'fas fa-list-ul',
      hasSubmenu: true,
      submenu: [
        { path: '/system/customs', label: 'Danh mục hải quan' },
        { path: '/system/banks', label: 'Danh mục ngân hàng TM' },
        { path: '/system/warehouses', label: 'Danh mục Kho/Bãi/Cảng' },
        { path: '/system/toll-stations', label: 'Danh mục trạm thu phí' },
        { path: '/system/storage-locations', label: 'Danh mục địa điểm lưu kho' },
        { path: '/system/enterprises', label: 'Danh mục doanh nghiệp' },
        { path: '/system/transport-methods', label: 'Danh mục phương thức vận chuyển' },
        { path: '/system/receipt-templates', label: 'Danh mục mẫu ký hiệu biên lai' },
        { path: '/system/tariff-types', label: 'Danh mục loại biểu cước' },
        { path: '/system/tariffs', label: 'Danh mục biểu cước' },
        { path: '/system/form-types', label: 'Danh mục loại hình' },
        { path: '/system/payment-types', label: 'Danh mục loại thanh toán' },
        { path: '/system/container-types', label: 'Danh mục loại container' },
        { path: '/system/units', label: 'Danh mục đơn vị tính' }
      ]
    },
                            {
                  path: '/system',
                  label: 'HỆ THỐNG',
                  icon: 'fas fa-cogs',
                  hasSubmenu: true,
                  submenu: [
                    { path: '/system/users', label: 'Quản lý người dùng' },
                    { path: '/system/business', label: 'Quản lý thông tin doanh nghiệp' },
                    { path: '/system/password', label: 'Đổi mật khẩu' }
                  ]
                },
    {
      path: '/account',
      label: 'THÔNG TIN TÀI KHOẢN',
      icon: 'fas fa-user-circle',
    },
    {
      path: '/password',
      label: 'ĐỔI MẬT KHẨU',
      icon: 'fas fa-key',
    },
    {
      path: '/guide',
      label: 'HƯỚNG DẪN',
      icon: 'fas fa-question-circle',
      hasSubmenu: true,
      submenu: [
        { path: '/guide/other', label: 'Khác' }
      ]
    },
  ]

  // Filter menu items based on user type
  const navItems = useMemo(() => {
    if (user?.userType === 'custom') {
      // Show 6 main menus + 4 basic menus for custom user (user/123456)
      const allowedPaths = [
        '/dashboard',           // Trang chủ (basic)
        '/reports',             // Báo cáo thống kê
        '/data-reconciliation', // Đối soát dữ liệu
        '/receipt-management',  // Biên lai thu phí
        '/fee-declaration',     // Tờ khai phí
        '/business-categories', // Danh mục nghiệp vụ (NEW)
        '/system',              // Hệ thống
        '/account',             // Thông tin tài khoản (basic)
        '/password',            // Đổi mật khẩu (basic)
        '/guide'                // Hướng dẫn (basic)
      ]
      return allNavItems.filter(item => allowedPaths.includes(item.path))
    }
    
    if (user?.userType === 'admin_custom') {
      // Show 3 main menus + 4 basic menus for admin user (admin/123456)
      const allowedPaths = [
        '/dashboard',           // Trang chủ (basic)
        '/payment-management',  // Quản lý thanh toán
        '/debt-management',     // Q.lý xử lý nợ phí
        '/payment',             // Nộp phí cơ sở hạ tầng
        '/account',             // Thông tin tài khoản (basic)
        '/password',            // Đổi mật khẩu (basic)
        '/guide'                // Hướng dẫn (basic)
      ]
      return allNavItems.filter(item => allowedPaths.includes(item.path))
    }
    
    // For other users, show all menus
    return allNavItems
  }, [user?.userType])

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className={`original-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* User Profile */}
        <div className="original-sidebar-header">
          <div className="original-user-profile">
            <img 
              src="/cangvu-hcm-logo.png"
              alt="User Avatar" 
              className="original-profile-img"
            />
            <div className="original-user-details">
              <div className="original-user-status">{user?.username || '0108844160'} - Online</div>
              <div className="original-user-role">
                {user?.userType === 'custom' ? 'Người dùng tùy chỉnh' : 
                 user?.userType === 'admin_custom' ? 'Quản trị viên tùy chỉnh' : 'Doanh nghiệp nộp phí'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="original-sidebar-nav">
          <ul className="original-nav-menu">
            {navItems.map((item) => (
              <li key={item.path} className="original-nav-item">
                {item.hasSubmenu ? (
                  <>
                    <div
                      className={`original-nav-link ${openSubmenu === item.path ? 'active' : ''}`}
                      onClick={() => toggleSubmenu(item.path)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                      <i 
                        className={`fas fa-angle-${openSubmenu === item.path ? 'up' : 'down'}`}
                        style={{ marginLeft: 'auto', transition: 'transform 0.3s ease' }}
                      ></i>
                    </div>
                    
                    {/* Submenu */}
                    {item.submenu && (
                      <ul 
                        className={`original-submenu ${openSubmenu === item.path ? 'show' : ''}`}
                        style={{
                          maxHeight: openSubmenu === item.path ? `${item.submenu.length * 45}px` : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease'
                        }}
                      >
                        {item.submenu.map((subItem, index) => (
                          <li key={subItem.path} className="original-submenu-item">
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) => 
                                `original-submenu-link ${isActive ? 'active' : ''}`
                              }
                            >
                              <span style={{ fontSize: '12px', fontWeight: 'bold', marginRight: '10px', minWidth: '16px', display: 'inline-block' }}>{index + 1}.</span>
                              <span>{subItem.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `original-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
            
            {/* Logout */}
            <li className="original-nav-item">
              <button
                onClick={handleLogout}
                className="original-nav-link"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>ĐĂNG XUẤT</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
  )
}

export default Sidebar