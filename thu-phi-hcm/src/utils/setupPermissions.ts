/**
 * Setup quyền mặc định cho các nhóm người dùng
 * Chạy file này 1 lần để cấu hình bảng sys_group_func
 */

import { CrmApiService } from "./crmApi";

/**
 * Setup quyền mặc định cho tất cả các nhóm
 * Chỉ chạy 1 lần khi khởi tạo hệ thống
 */
export const setupDefaultPermissions = async () => {
  try {
    console.log("🚀 Bắt đầu setup quyền mặc định cho hệ thống...");

    await CrmApiService.setupDefaultGroupPermissions();

    console.log("✅ Hoàn thành setup quyền mặc định!");
    console.log(
      "📋 Bảng sys_group_func đã được cấu hình với quyền cho 3 nhóm:"
    );
    console.log("   - Group 1: Doanh nghiệp Cảng (funcId: 1-7)");
    console.log("   - Group 2: Doanh nghiệp XNK (funcId: 1,8-14)");
    console.log("   - Group 3: Cán bộ Cảng vụ (funcId: 1,15-28)");
  } catch (error) {
    console.error("❌ Lỗi khi setup quyền mặc định:", error);
  }
};

// Export để có thể gọi từ console hoặc component khác
(window as any).setupDefaultPermissions = setupDefaultPermissions;

// Tự động chạy nếu được import
if (typeof window !== "undefined") {
  console.log("💡 Để setup quyền mặc định, chạy: setupDefaultPermissions()");
}
