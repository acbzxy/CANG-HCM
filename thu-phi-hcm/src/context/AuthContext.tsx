import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { User, LoginCredentials } from "../types";
import { CrmApiService } from "../utils/crmApi";

// Auth state type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// Auth context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = sessionStorage.getItem("user");
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (isLoggedIn === "true" && savedUser) {
          const user: User = JSON.parse(savedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        // Clear invalid session data
        sessionStorage.clear();
      }
    };

    checkExistingSession();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for dev credentials
      if (
        credentials.username === "devadmin" &&
        credentials.password === "dev123456"
      ) {
        const devUser: User = {
          id: "dev-001",
          username: "devadmin",
          email: "dev@example.com",
          fullName: "Dev Administrator",
          companyName: "Development Company",
          taxCode: "0109844160",
          phone: "1900 1234",
          address: "TP. Hồ Chí Minh",
          userType: "dev",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        // Save to session storage
        sessionStorage.setItem("user", JSON.stringify(devUser));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("userType", "dev");

        dispatch({ type: "LOGIN_SUCCESS", payload: devUser });
        return;
      }

      // Check for custom user credentials (user/123456)
      if (
        credentials.username === "user" &&
        credentials.password === "123456"
      ) {
        const customUser: User = {
          id: "custom-001",
          username: "user",
          email: "user@example.com",
          fullName: "Người dùng tùy chỉnh",
          companyName: "Công ty tùy chỉnh",
          taxCode: "USER123456",
          phone: "1900 1286",
          address: "TP. Hồ Chí Minh",
          userType: "custom",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          // Thêm quyền cho các module
          allowedFunctions: [
            { funcId: 1, funcIdCode: "DASHBOARD", funcName: "Trang chủ" },
            { funcId: 2, funcIdCode: "FEE_DECLARATION_MANAGE", funcName: "Xem quản lí tờ khai nộp phí" },
            { funcId: 3, funcIdCode: "RECEIPT_NOTIFICATION", funcName: "Nhận thông báo và xem tính phí từ hệ thống thu phí" },
            { funcId: 5, funcIdCode: "FEE_PAYMENT_LIST", funcName: "Xem danh sách nộp phí của các DN XNK" },
            { funcId: 6, funcIdCode: "FEE_PAYMENT_STATUS", funcName: "Tra cứu tình trạng nộp phí của các DN XNK" },
            { funcId: 7, funcIdCode: "GETIN_GETOUT_INFO", funcName: "Nhận thông tin Getin/Getout từ hệ thống" },
          ],
        };

        // Save to session storage
        sessionStorage.setItem("user", JSON.stringify(customUser));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("userType", "custom");

        dispatch({ type: "LOGIN_SUCCESS", payload: customUser });
        return;
      }

      // Check for admin user credentials (admin/123456)
      if (
        credentials.username === "admin" &&
        credentials.password === "123456"
      ) {
        const adminUser: User = {
          id: "admin-001",
          username: "admin",
          email: "admin@example.com",
          fullName: "Quản trị viên tùy chỉnh",
          companyName: "Công ty Quản trị",
          taxCode: "ADMIN123456",
          phone: "1900 1286",
          address: "TP. Hồ Chí Minh",
          userType: "admin_custom",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          // Thêm quyền cho các module mới
          allowedFunctions: [
            { funcId: 1, funcIdCode: "DASHBOARD", funcName: "Trang chủ" },
            { funcId: 7, funcIdCode: "BUSINESS_CATEGORIES", funcName: "Danh mục nghiệp vụ" },
            { funcId: 15, funcIdCode: "DATA_RECONCILIATION", funcName: "Đối soát dữ liệu" },
            { funcId: 16, funcIdCode: "RECONCILIATION_NOTIFICATION", funcName: "Xem thông báo chờ kết quả đối soát" },
            { funcId: 17, funcIdCode: "RECONCILIATION_RESULT", funcName: "Xem kết quả đối soát từ Ngân hàng, Kho bạc" },
            { funcId: 18, funcIdCode: "RECONCILIATION_EXPORT", funcName: "Xuất kết quả đối soát ra file Excel" },
            { funcId: 19, funcIdCode: "RECONCILIATION_PRINT", funcName: "In kết quả đối soát" },
            { funcId: 20, funcIdCode: "RECONCILIATION_LIST", funcName: "Xem danh sách tất cả các lần đối soát" },
            { funcId: 21, funcIdCode: "RECONCILIATION_SEARCH", funcName: "Tìm kiếm/tra cứu lần đối soát theo tiêu chí" },
            { funcId: 22, funcIdCode: "RECONCILIATION_DETAIL", funcName: "Xem chi tiết kết quả của từng lần đối soát" },
            { funcId: 23, funcIdCode: "RECONCILIATION_EXPORT_LIST", funcName: "Xuất danh sách kết quả ra Excel" },
            { funcId: 24, funcIdCode: "RECONCILIATION_PRINT_LIST", funcName: "In danh sách kết quả" },
            { funcId: 25, funcIdCode: "RECONCILIATION_REPORT", funcName: "Lập báo cáo đối soát định kỳ" },
            { funcId: 26, funcIdCode: "RECONCILIATION_EXPORT_REPORT", funcName: "Xuất/tải báo cáo để gửi lãnh đạo" },
            { funcId: 27, funcIdCode: "RECONCILIATION_UPDATE", funcName: "Ghi chú, cập nhật trạng thái xử lý lần đối soát" },
            { funcId: 28, funcIdCode: "RECONCILIATION_HISTORY", funcName: "Quản lý lịch sử các lần đối soát" },
            { funcId: 33, funcIdCode: "STATISTICS_REPORTS", funcName: "Báo cáo thống kê" },
          ],
        };

        // Save to session storage
        sessionStorage.setItem("user", JSON.stringify(adminUser));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("userType", "admin_custom");

        dispatch({ type: "LOGIN_SUCCESS", payload: adminUser });
        return;
      }

      // Check for MST user credentials (mst/123456)
      if (
        credentials.username === "0304126484" &&
        credentials.password === "123456"
      ) {
        const mstUser: User = {
          id: "mst-001",
          username: "0304126484",
          email: "info@biendongtrans.com",
          fullName: "Công ty TNHH Vận Tải Biển Đông",
          companyName: "Công ty TNHH Vận Tải Biển Đông",
          taxCode: "0304126484",
          phone: "1900 1286",
          address:
            "167 Lưu Hữu Phước, Phường Phú Định, Thành phố Hồ Chí Minh, Việt Nam",
          userType: "mst_custom",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        // Save to session storage
        sessionStorage.setItem("user", JSON.stringify(mstUser));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("userType", "mst_custom");

        dispatch({ type: "LOGIN_SUCCESS", payload: mstUser });
        return;
      }

      // For other credentials, try to authenticate with backend
      if (credentials.username && credentials.password) {
        try {
          // Gọi API login backend (nếu có)
          // const loginResponse = await CrmApiService.login(credentials.username, credentials.password)

          // Lấy thông tin user và quyền từ backend
          const userResponse = await CrmApiService.viewSysUser({
            username: credentials.username,
          });
          const userData = userResponse?.data || userResponse;

          if (userData) {
            // Lấy quyền từ bảng sys_group_func dựa trên groupId
            const userPermissions =
              await CrmApiService.getUserPermissionsByGroup(
                userData.groupId || 1
              );

            const user: User = {
              id: userData.userId?.toString() || "user-001",
              username: userData.username || credentials.username,
              email: userData.mail || "user@example.com",
              fullName: userData.fullname || "Công ty Demo TPHCM",
              companyName: userData.fullname || "Công ty Demo TPHCM",
              taxCode: credentials.username,
              phone: userData.phone || "1900 1286",
              address: userData.address || "TP. Hồ Chí Minh",
              userType: "enterprise",
              status: "active",
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              // Thông tin quyền từ backend
              groupId: userData.groupId,
              groupName: userData.groupName,
              allowedFunctions: userPermissions, // Sử dụng quyền từ sys_group_func
              listFunction: userData.listFunction || [],
            };

            // Save to session storage
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("loginTime", new Date().toISOString());
            sessionStorage.setItem("userType", "enterprise");

            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            return;
          }
        } catch (apiError) {
          console.warn(
            "Không thể lấy thông tin user từ backend, sử dụng mock data:",
            apiError
          );
        }

        // Fallback: sử dụng mock data nếu API lỗi
        const user: User = {
          id: "user-001",
          username: credentials.username,
          email: "user@example.com",
          fullName: "Công ty Demo TPHCM",
          companyName: "Công ty Demo TPHCM",
          taxCode: credentials.username,
          phone: "1900 1286",
          address: "TP. Hồ Chí Minh",
          userType: "enterprise",
          status: "active",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        // Save to session storage
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("userType", "enterprise");

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return;
      }

      throw new Error("Tài khoản hoặc mật khẩu không đúng");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear auth state
    dispatch({ type: "LOGOUT" });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
