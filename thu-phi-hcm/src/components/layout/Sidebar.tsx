import React, { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { FunctionDto } from "../../types";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const allNavItems = [
    {
      path: "/dashboard",
      label: "TRANG CHỦ",
      icon: "fas fa-home",
    },
    {
      path: "/fee-declaration",
      label: "TỜ KHAI PHÍ",
      icon: "fas fa-file-invoice",
      hasSubmenu: true,
      submenu: [
        { path: "/fee-declaration/manage", label: "Quản lý tờ khai nộp phí" },
        { path: "/fee-declaration/barcode", label: "Barcode tờ khai nộp phí" },
        { path: "/fee-declaration/debt-management", label: "Quản lý nợ phí" },
      ],
    },
    {
      path: "/receipt-management",
      label: "BIÊN LAI THU PHÍ",
      icon: "fas fa-receipt",
      hasSubmenu: true,
      submenu: [
        {
          path: "/receipt-management/manage",
          label: "Quản lý biên lai thu phí",
        },
      ],
    },
    {
      path: "/payment",
      label: "NỘP PHÍ CƠ SỞ HẠ TẦNG",
      icon: "fas fa-building",
      hasSubmenu: true,
      submenu: [
        { path: "/payment/declare", label: "Khai báo nộp phí" },
        { path: "/payment/order", label: "Đơn hàng thanh toán QR, Ecor" },
        { path: "/data-table", label: "Danh sách biên lai" },
        { path: "/payment/process", label: "Trình ký xử lý biên lai" },
        { path: "/reports/receipt-lookup", label: "Tra cứu biên lai" },
        { path: "/debt-management/debt-status", label: "Tra cứu nợ phí" },
      ],
    },
    {
      path: "/reports",
      label: "BÁO CÁO THỐNG KÊ",
      icon: "fas fa-chart-bar",
      hasSubmenu: true,
      submenu: [
        { path: "/reports/receipt-list", label: "Bảng kê BL thu" },
        { path: "/reports/summary-by-warehouse", label: "Tổng hợp theo kho" },
        { path: "/reports/summary-by-service", label: "Tổng hợp thu dịch vụ" },
        { path: "/reports/summary-by-enterprise", label: "Tổng hợp theo DN" },
        { path: "/reports/detailed-report", label: "Báo cáo ấn chỉ" },
        {
          path: "/reports/receipt-usage-history",
          label: "Tình hình sử dụng BL",
        },
        {
          path: "/reports/collection-summary",
          label: "Tổng hợp thu theo CB lập",
        },
      ],
    },
    {
      path: "/debt-management",
      label: "Q.LÝ XỬ LÝ NỢ PHÍ",
      icon: "fas fa-exclamation-triangle",
      hasSubmenu: true,
      submenu: [
        {
          path: "/debt-management/debt-status",
          label: "Tra cứu tình trạng nợ phí",
        },
        {
          path: "/debt-management/business-services",
          label: "Thực hiện nghiệp vụ",
        },
        {
          path: "/debt-management/create-qr-code",
          label: "Tạo lập QĐ cưỡng chế",
        },
      ],
    },
    {
      path: "/data-reconciliation",
      label: "ĐỐI SOÁT DỮ LIỆU",
      icon: "fas fa-sync-alt",
      hasSubmenu: true,
      submenu: [
        {
          path: "/data-reconciliation/manage-list",
          label: "Tra cứu đối soát",
        },
        { path: "/data-reconciliation/initialize", label: "Đối soát thủ công" },
      ],
    },
    {
      path: "/payment-management",
      label: "QUẢN LÝ THANH TOÁN",
      icon: "fas fa-credit-card",
      hasSubmenu: true,
      submenu: [
        { path: "/payment-management/manage", label: "Quản lý thanh toán" },
        { path: "/payment-management/cancel", label: "Hủy thanh toán" },
        { path: "/payment-management/restore", label: "Khôi phục thanh toán" },
        {
          path: "/payment-management/notify-transfer",
          label: "TB chuyển tiền về KB",
        },
        {
          path: "/payment-management/manage-transfer",
          label: "QL chuyển tiền về KB",
        },
        {
          path: "/payment-management/bank-reconciliation",
          label: "Đối soát dữ liệu thanh toán từ ngân hàng",
        },
      ],
    },
    {
      path: "/business-categories",
      label: "DANH MỤC NGHIỆP VỤ",
      icon: "fas fa-list-ul",
      hasSubmenu: true,
      submenu: [
        { path: "/system/customs", label: "Danh mục hải quan" },
        { path: "/system/banks", label: "Danh mục ngân hàng TM" },
        { path: "/system/warehouses", label: "Danh mục Kho/Bãi/Cảng" },
        { path: "/system/toll-stations", label: "Danh mục trạm thu phí" },
        {
          path: "/system/storage-locations",
          label: "Danh mục địa điểm lưu kho",
        },
        { path: "/system/enterprises", label: "Danh mục doanh nghiệp" },
        {
          path: "/system/transport-methods",
          label: "Danh mục phương thức vận chuyển",
        },
        {
          path: "/system/receipt-templates",
          label: "Danh mục mẫu ký hiệu biên lai",
        },
        { path: "/system/tariff-types", label: "Danh mục loại biểu cước" },
        { path: "/system/tariffs", label: "Danh mục biểu cước" },
        { path: "/system/form-types", label: "Danh mục loại hình" },
        { path: "/system/payment-types", label: "Danh mục loại thanh toán" },
        { path: "/system/container-types", label: "Danh mục loại container" },
        { path: "/system/units", label: "Danh mục đơn vị tính" },
      ],
    },
    {
      path: "/getin-getout",
      label: "GETIN/GETOUT",
      icon: "fas fa-exchange-alt",
    },
    {
      path: "/user-receipt-lookup",
      label: "TRA CỨU BIÊN LAI",
      icon: "fas fa-search",
    },
    {
      path: "/system",
      label: "HỆ THỐNG",
      icon: "fas fa-cogs",
      hasSubmenu: true,
      submenu: [
        { path: "/system/users", label: "Quản lý người dùng" },
        { path: "/system/business", label: "Quản lý thông tin doanh nghiệp" },
        { path: "/system/password", label: "Đổi mật khẩu" },
      ],
    },
    {
      path: "/account",
      label: "THÔNG TIN TÀI KHOẢN",
      icon: "fas fa-user-circle",
    },
    {
      path: "/password",
      label: "ĐỔI MẬT KHẨU",
      icon: "fas fa-key",
    },
    {
      path: "/guide",
      label: "HƯỚNG DẪN",
      icon: "fas fa-question-circle",
      hasSubmenu: true,
      submenu: [{ path: "/guide/other", label: "Khác" }],
    },
  ];

  // Mapping funcId từ backend với menu paths
  const getMenuPathsByFuncId = (funcId: number): string[] => {
    switch (funcId) {
      case 1: // Login/Logout - Trang chủ
        return ["/dashboard"];
      case 2: // Xem quản lí tờ khai nộp phí
        return ["/fee-declaration", "/fee-declaration/manage"];
      case 3: // Nhận thông báo và xem tính phí từ hệ thống thu phí
        return ["/receipt-management", "/receipt-management/manage"];
      case 4: // Check thông tin tờ khai phí
        return ["/fee-declaration/barcode"];
      case 5: // Xem danh sách nộp phí của các DN XNK
        return ["/payment", "/payment/declare"];
      case 6: // Tra cứu tình trạng nộp phí của các DN XNK
        return ["/debt-management", "/debt-management/debt-status"];
      case 7: // Nhận thông tin Getin/Getout từ hệ thống
        return ["/getin-getout"];
      case 8: // Thêm/Tạo mới tờ khai báo nộp phí
        return ["/fee-declaration", "/fee-declaration/manage"];
      case 9: // Check danh sách tờ khai đã làm
        return ["/fee-declaration", "/fee-declaration/barcode"];
      case 10: // Chọn tờ khai muốn ký, chọn chữ ký số và ký số
        return ["/fee-declaration", "/fee-declaration/manage"];
      case 11: // Lấy thông báo ở button "Tính phí"
        return ["/receipt-management", "/receipt-management/manage"];
      case 12: // Nhận thông báo
        return ["/receipt-management", "/receipt-management/manage"];
      case 13: // Thanh toán QR/Ecom
        return ["/payment", "/payment/order"];
      case 14: // Nhận biên lai thu phí
        return ["/receipt-management", "/receipt-management/manage"];
      case 15: // Tạo mới lần đối soát
        return ["/data-reconciliation"];
      case 16: // Xem thông báo chờ kết quả đối soát
        return ["/data-reconciliation"];
      case 17: // Xem kết quả đối soát từ Ngân hàng, Kho bạc
        return ["/data-reconciliation"];
      case 18: // Xuất kết quả đối soát ra file Excel
        return ["/data-reconciliation"];
      case 19: // In kết quả đối soát
        return ["/data-reconciliation"];
      case 20: // Xem danh sách tất cả các lần đối soát
        return ["/data-reconciliation"];
      case 21: // Tìm kiếm/tra cứu lần đối soát theo tiêu chí
        return ["/data-reconciliation"];
      case 22: // Xem chi tiết kết quả của từng lần đối soát
        return ["/data-reconciliation"];
      case 23: // Xuất danh sách kết quả ra Excel
        return ["/data-reconciliation"];
      case 24: // In danh sách kết quả
        return ["/data-reconciliation"];
      case 25: // Lập báo cáo đối soát định kỳ
        return ["/reports"];
      case 26: // Xuất/tải báo cáo để gửi lãnh đạo
        return ["/reports"];
      case 27: // Ghi chú, cập nhật trạng thái xử lý lần đối soát
        return ["/data-reconciliation"];
      case 28: // Quản lý lịch sử các lần đối soát
        return ["/data-reconciliation"];
      case 33: // Báo cáo thống kê (module mới)
        return ["/reports"];
      default:
        return [];
    }
  };

  // Filter menu items based on user permissions
  const navItems = useMemo(() => {
    console.log("🔍 Debug Sidebar - User info:", {
      username: user?.username,
      userType: user?.userType,
      groupId: user?.groupId,
      groupName: user?.groupName,
      allowedFunctions: user?.allowedFunctions,
      allowedFunctionsLength: user?.allowedFunctions?.length,
      listFunction: user?.listFunction,
    });

    // Nếu user có quyền từ backend, filter theo quyền
    if (user?.allowedFunctions && user.allowedFunctions.length > 0) {
      const allowedPaths = new Set<string>();

      // Thêm các menu cơ bản luôn có
      allowedPaths.add("/dashboard");
      allowedPaths.add("/account");
      allowedPaths.add("/password");
      allowedPaths.add("/guide");
      
      // Thêm menu tra cứu biên lai cho tài khoản user/123456
      if (user?.username === "user") {
        allowedPaths.add("/user-receipt-lookup");
      }

      // Thêm menu dựa trên quyền
      user.allowedFunctions.forEach((func: FunctionDto) => {
        const menuPaths = getMenuPathsByFuncId(func.funcId);
        menuPaths.forEach((path) => allowedPaths.add(path));
      });

      // Override đặc thù theo tài khoản
      // Chuyển các module sang cho admin/123456 (ngoại trừ /payment theo yêu cầu)
      if (user?.username === "admin") {
        [
          "/fee-declaration",
          "/receipt-management",
          "/debt-management",
        ].forEach((p) => allowedPaths.add(p));
      }

      console.log(
        "✅ User permissions:",
        user.allowedFunctions.map((f) => f.funcName)
      );
      console.log("✅ Allowed menu paths:", Array.from(allowedPaths));
      console.log("🔍 All nav items:", allNavItems.map(item => item.path));
      console.log("🔍 Filtered nav items:", allNavItems.filter((item) => allowedPaths.has(item.path)).map(item => item.path));

      // Loại bỏ module GETIN/GETOUT cho tài khoản admin/123456
      const filteredItems = allNavItems.filter((item) => {
        // Kiểm tra nếu là tài khoản admin/123456 và module GETIN/GETOUT
        if (user?.username === "admin" && item.path === "/getin-getout") {
          console.log("🚫 Removing GETIN/GETOUT module for admin user");
          return false;
        }
        // Loại bỏ module NỘP PHÍ CƠ SỞ HẠ TẦNG cho admin/123456
        if (user?.username === "admin" && item.path === "/payment") {
          return false;
        }
        // Loại bỏ các module khỏi tài khoản user/123456
        if (
          user?.username === "user" &&
          [
            "/fee-declaration",
            "/receipt-management",
            "/payment",
            "/debt-management",
          ].includes(item.path)
        ) {
          return false;
        }
        return allowedPaths.has(item.path);
      });

      return filteredItems;
    }

    console.log(
      "⚠️ No backend permissions found, using fallback logic based on groupId"
    );

    // Fallback: sử dụng logic dựa trên groupId từ backend
    if (user?.groupId) {
      let allowedPaths: string[] = [];

      switch (user.groupId) {
        case 1: // Doanh nghiệp Cảng (quản lí phí)
          allowedPaths = [
            "/dashboard", // Trang chủ
            "/fee-declaration", // TỜ KHAI PHÍ (funcId 2,4)
            "/receipt-management", // BIÊN LAI THU PHÍ (funcId 3)
            "/payment", // NỘP PHÍ CƠ SỞ HẠ TẦNG (funcId 5)
            "/debt-management", // Q.LÝ XỬ LÝ NỢ PHÍ (funcId 6)
            "/business-categories", // DANH MỤC NGHIỆP VỤ (funcId 7)
            "/getin-getout", // GETIN/GETOUT (funcId 7)
            "/account", // Thông tin tài khoản
            "/password", // Đổi mật khẩu
            "/guide", // Hướng dẫn
          ];
          console.log(
            "🏢 Group 1 - Doanh nghiệp Cảng permissions:",
            allowedPaths
          );
          break;

        case 2: // Doanh nghiệp XNK (người nộp phí)
          allowedPaths = [
            "/dashboard", // Trang chủ
            "/fee-declaration", // TỜ KHAI PHÍ (funcId 8,9,10)
            "/receipt-management", // BIÊN LAI THU PHÍ (funcId 11,12,14)
            "/payment", // NỘP PHÍ CƠ SỞ HẠ TẦNG (funcId 13)
            "/account", // Thông tin tài khoản
            "/password", // Đổi mật khẩu
            "/guide", // Hướng dẫn
          ];
          console.log(
            "🚢 Group 2 - Doanh nghiệp XNK permissions:",
            allowedPaths
          );
          break;

        case 3: // Cán bộ Cảng vụ
          allowedPaths = [
            "/dashboard", // Trang chủ
            "/data-reconciliation", // ĐỐI SOÁT DỮ LIỆU (funcId 15-24,27,28)
            "/reports", // BÁO CÁO THỐNG KÊ (funcId 25,26)
            "/account", // Thông tin tài khoản
            "/password", // Đổi mật khẩu
            "/guide", // Hướng dẫn
          ];
          console.log("👮 Group 3 - Cán bộ Cảng vụ permissions:", allowedPaths);
          break;

        default:
          console.log("❓ Unknown groupId:", user.groupId);
          allowedPaths = ["/dashboard", "/account", "/password", "/guide"];
      }

      return allNavItems.filter((item) => allowedPaths.includes(item.path));
    }

    // Fallback cũ dựa trên userType (để tương thích ngược)
    if (user?.userType === "custom") {
      const allowedPaths = [
        "/dashboard",
        "/fee-declaration",
        "/receipt-management",
        "/payment",
        "/debt-management",
        "/business-categories",
        "/getin-getout",
        "/account",
        "/password",
        "/guide",
      ];
      return allNavItems.filter((item) => allowedPaths.includes(item.path));
    }

    if (user?.userType === "admin_custom") {
      const allowedPaths = [
        "/dashboard",
        "/payment-management",
        "/debt-management",
        "/data-reconciliation",
        "/reports",
        "/business-categories",
        "/account",
        "/password",
        "/guide",
      ];
      
      // Loại bỏ module GETIN/GETOUT cho tài khoản admin/123456
      return allNavItems.filter((item) => {
        // Kiểm tra nếu là tài khoản admin/123456 và module GETIN/GETOUT
        if (user?.username === "admin" && item.path === "/getin-getout") {
          console.log("🚫 Removing GETIN/GETOUT module for admin user (fallback logic)");
          return false;
        }
        return allowedPaths.includes(item.path);
      });
    }

    if (user?.userType === "mst_custom") {
      const allowedPaths = [
        "/dashboard",
        "/payment",
        "/account",
        "/password",
        "/guide",
      ];
      return allNavItems.filter((item) => allowedPaths.includes(item.path));
    }

    // For other users, show all menus
    console.log("⚠️ No groupId or userType found, showing all menus");
    return allNavItems;
  }, [user?.userType, user?.allowedFunctions, user?.groupId]);

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`original-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* User Profile */}
      <div className="original-sidebar-header">
        <div className="original-user-profile">
          <img
            src="/cangvu-hcm-logo.png"
            alt="User Avatar"
            className="original-profile-img"
          />
          <div className="original-user-details">
            <div className="original-user-status">
              {user?.username || "0108844160"} - Online
            </div>
            <div className="original-user-role">
              {user?.groupName ||
                (user?.groupId === 1
                  ? "Doanh nghiệp Cảng"
                  : user?.groupId === 2
                  ? "Doanh nghiệp XNK"
                  : user?.groupId === 3
                  ? "Cán bộ Cảng vụ"
                  : user?.userType === "custom"
                  ? "Người dùng tùy chỉnh"
                  : user?.userType === "admin_custom"
                  ? "Quản trị viên tùy chỉnh"
                  : "Doanh nghiệp nộp phí")}
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
                    className={`original-nav-link ${
                      openSubmenu === item.path ? "active" : ""
                    }`}
                    onClick={() => toggleSubmenu(item.path)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                    <i
                      className={`fas fa-angle-${
                        openSubmenu === item.path ? "up" : "down"
                      }`}
                      style={{
                        marginLeft: "auto",
                        transition: "transform 0.3s ease",
                      }}
                    ></i>
                  </div>

                  {/* Submenu */}
                  {item.submenu && (
                    <ul
                      className={`original-submenu ${
                        openSubmenu === item.path ? "show" : ""
                      }`}
                      style={{
                        maxHeight:
                          openSubmenu === item.path
                            ? `${item.submenu.length * 45}px`
                            : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease",
                      }}
                    >
                      {item.submenu.map((subItem, index) => (
                        <li
                          key={subItem.path}
                          className="original-submenu-item"
                        >
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `original-submenu-link ${
                                isActive ? "active" : ""
                              }`
                            }
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                minWidth: "16px",
                                display: "inline-block",
                              }}
                            >
                              {index + 1}.
                            </span>
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
                    `original-nav-link ${isActive ? "active" : ""}`
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
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>ĐĂNG XUẤT</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
