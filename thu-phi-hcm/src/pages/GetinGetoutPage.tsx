import React, { useState } from "react";
import { CrmApiService } from "../utils/crmApi";
import { useNotification } from "../context/NotificationContext";

interface SearchResult {
  toKhaiId: number;
  soToKhai: string;
  ngayToKhai: string;
  maDoanhNghiepKhaiPhi: string;
  tenDoanhNghiepKhaiPhi: string;
  maDoanhNghiepXNK: string;
  tenDoanhNghiepXNK: string;
  soTiepNhanKhaiPhi: string;
  ngayKhaiPhi: string;
  tongTienPhi: number | null;
  trangThaiNganHang: string;
  soBienLai: string;
  ngayBienLai: string;
  ngayTt: string;
  trangThai: string;
  transId: string;
  chiTietId: number;
  soVanDon: string;
  soHieu: string;
  soSeal: string;
  loaiCont: string;
  tinhChatCont: string;
  maLoaiCont: string;
  maTcCont: string;
  tongTrongLuong: number | null;
  donViTinh: string;
  ghiChu: string;
  donGia: number | null;
  soTien: number | null;
}

const GetinGetoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"getin" | "getout">("getin");
  const [searchBillNumber, setSearchBillNumber] = useState("");
  const [searchContainerNumber, setSearchContainerNumber] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Không còn sử dụng mock data, sẽ lấy từ API

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã nhập":
      case "Đã xuất":
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
      case "Đang chuẩn bị":
        return "bg-yellow-100 text-yellow-800";
      case "Chờ kiểm tra":
      case "Chờ xác nhận":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUploadExcel = async (file: File) => {
    try {
      setUploadLoading(true);
      const res = await CrmApiService.uploadGetInGetOutExcel(file);
      if (res.status === 200) {
        const rows = Array.isArray(res.data?.data) ? res.data.data.length : 0;
        setSearchResults(res.data?.data || []);
        setSelectedItem(null);
        showSuccess(
          `Upload thành công: tổng ${res.data?.totalRows ?? 0}, xử lý ${
            res.data?.processedRows ?? 0
          }, tìm thấy ${res.data?.foundRows ?? rows}`
        );
      } else {
        showError(res.message || "Upload thất bại");
      }
    } catch (err: any) {
      console.error("Lỗi upload Excel:", err);
      showError("Upload thất bại: " + (err?.message || err));
    } finally {
      setUploadLoading(false);
    }
  };

  // Hàm tìm kiếm
  const handleSearch = async () => {
    if (!searchBillNumber.trim() && !searchContainerNumber.trim()) {
      showError("Vui lòng nhập ít nhất một thông tin tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      const response = await CrmApiService.searchGetInGetOut(
        searchBillNumber.trim() || undefined,
        searchContainerNumber.trim() || undefined
      );

      if (response.status === 200 && response.data) {
        setSearchResults(response.data);
        setSelectedItem(null);
        showSuccess(`Tìm thấy ${response.data.length} kết quả`);
      } else {
        setSearchResults([]);
        showError("Không tìm thấy kết quả nào");
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm:", error);
      showError("Có lỗi xảy ra khi tìm kiếm: " + (error?.message || error));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchBillNumber("");
    setSearchContainerNumber("");
    setSearchResults([]);
    setSelectedItem(null);
  };

  // Hàm xem chi tiết
  const handleViewDetails = (item: SearchResult) => {
    setSelectedItem(item);
  };

  const exportToExcel = async () => {
    if (
      !searchBillNumber.trim() &&
      !searchContainerNumber.trim() &&
      displayData.length === 0
    ) {
      showError("Vui lòng nhập tiêu chí hoặc có dữ liệu để xuất Excel");
      return;
    }

    try {
      setExportLoading(true);
      const { blob, fileName } = await CrmApiService.exportGetInGetOutExcel(
        searchBillNumber.trim() || undefined,
        searchContainerNumber.trim() || undefined
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        fileName ||
        `TraCuuToKhai_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showSuccess("Đã xuất Excel thành công");
    } catch (error: any) {
      console.error("Lỗi xuất Excel:", error);
      showError("Xuất Excel thất bại: " + (error?.message || error));
    } finally {
      setExportLoading(false);
    }
  };

  const displayData = searchResults;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            TRA CỨU GETIN/GETOUT
          </h1>
          <p className="text-gray-600 mt-1">
            Tra cứu thông tin hàng hóa nhập/xuất cảng
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("getin")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "getin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              GETIN
            </button>
            <button
              onClick={() => setActiveTab("getout")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "getout"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              GETOUT
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số vận đơn
              </label>
              <input
                type="text"
                value={searchBillNumber}
                onChange={(e) => setSearchBillNumber(e.target.value)}
                placeholder="Nhập số vận đơn..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số hiệu container
              </label>
              <input
                type="text"
                value={searchContainerNumber}
                onChange={(e) => setSearchContainerNumber(e.target.value)}
                placeholder="Nhập số hiệu container..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-search mr-2"></i>
                )}
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
              <button
                onClick={handleClearSearch}
                disabled={loading}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500"
                }`}
              >
                <i className="fas fa-times mr-2"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Số vận đơn
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Số hiệu cont
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Loại cont
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tính chất cont
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Đơn giá
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Số tiền
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Số tờ khai
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Ngày tờ khai
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Mã DN khai phí
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tên DN khai phí
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Số tiếp nhận khai phí
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Ngày khai phí
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tổng tiền phí
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Trạng thái ngân hàng
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={14} className="px-3 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Đang tìm kiếm...
                      </div>
                    </td>
                  </tr>
                ) : displayData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      {searchResults.length === 0
                        ? "Chưa có dữ liệu. Vui lòng tìm kiếm."
                        : "Không tìm thấy kết quả nào."}
                    </td>
                  </tr>
                ) : (
                  displayData.map((item, idx) => (
                    <tr
                      key={item.chiTietId ?? `${item.toKhaiId}-${idx}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              activeTab === "getin"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.soVanDon}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.soHieu}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.loaiCont}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div
                          className="max-w-xs truncate"
                          title={item.tinhChatCont}
                        >
                          {item.tinhChatCont}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.donGia
                          ? item.donGia.toLocaleString("vi-VN")
                          : "0"}{" "}
                        VNĐ
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        {item.soTien
                          ? item.soTien.toLocaleString("vi-VN")
                          : "0"}{" "}
                        VNĐ
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.soToKhai}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ngayToKhai}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.maDoanhNghiepKhaiPhi}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div
                          className="max-w-xs truncate"
                          title={item.tenDoanhNghiepKhaiPhi}
                        >
                          {item.tenDoanhNghiepKhaiPhi}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.soTiepNhanKhaiPhi}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ngayKhaiPhi}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {item.tongTienPhi
                          ? item.tongTienPhi.toLocaleString("vi-VN")
                          : "0"}{" "}
                        VNĐ
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            item.trangThaiNganHang
                          )}`}
                        >
                          {item.trangThaiNganHang}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Hiển thị {displayData.length} kết quả
            </div>
            <div className="flex space-x-2">
              <label
                className={`px-4 py-2 rounded cursor-pointer ${
                  uploadLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Tải Excel tra cứu"
              >
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  disabled={uploadLoading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadExcel(file);
                    e.currentTarget.value = "";
                  }}
                />
                {uploadLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang tải Excel...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-upload mr-2"></i>
                    Upload Excel
                  </>
                )}
              </label>
              <label
                className={`px-4 py-2 rounded cursor-pointer ${
                  uploadLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Upload và xuất kết quả Excel"
              >
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  disabled={uploadLoading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setUploadLoading(true);
                        const { blob, fileName } =
                          await CrmApiService.exportGetInGetOutExcelResult(
                            file
                          );
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                        showSuccess("Đã xuất Excel kết quả từ file upload");
                      } catch (err: any) {
                        console.error("Lỗi export từ file:", err);
                        showError(
                          "Xuất kết quả thất bại: " + (err?.message || err)
                        );
                      } finally {
                        setUploadLoading(false);
                      }
                    }
                    e.currentTarget.value = "";
                  }}
                />
                {uploadLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-excel mr-2"></i>
                    Export kết quả (từ file)
                  </>
                )}
              </label>
              <button
                onClick={exportToExcel}
                disabled={exportLoading}
                className={`px-4 py-2 rounded ${
                  exportLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {exportLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>
                    Xuất Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detail Information */}
        {selectedItem && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin chi tiết
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Đóng"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số vận đơn
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.soVanDon}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số hiệu
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.soHieu}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số seal
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.soSeal}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại cont
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.loaiCont}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tính chất cont
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.tinhChatCont}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Đơn giá
                    </label>
                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {selectedItem.donGia
                        ? selectedItem.donGia.toLocaleString("vi-VN")
                        : "0"}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số tiền
                    </label>
                    <p className="mt-1 text-sm font-semibold text-green-600">
                      {selectedItem.soTien
                        ? selectedItem.soTien.toLocaleString("vi-VN")
                        : "0"}{" "}
                      VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số tờ khai
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.soToKhai}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tờ khai
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.ngayToKhai}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã DN khai phí
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.maDoanhNghiepKhaiPhi}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên DN khai phí
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.tenDoanhNghiepKhaiPhi}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã DN XNK
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.maDoanhNghiepXNK}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên DN XNK
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.tenDoanhNghiepXNK}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số tiếp nhận khai phí
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.soTiepNhanKhaiPhi}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày khai phí
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem.ngayKhaiPhi}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng tiền phí
                    </label>
                    <p className="mt-1 text-sm font-semibold text-green-600">
                      {selectedItem.tongTienPhi
                        ? selectedItem.tongTienPhi.toLocaleString("vi-VN")
                        : "0"}{" "}
                      VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái ngân hàng
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                        selectedItem.trangThaiNganHang
                      )}`}
                    >
                      {selectedItem.trangThaiNganHang}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                        selectedItem.trangThai
                      )}`}
                    >
                      {selectedItem.trangThai}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin bổ sung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số biên lai
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.soBienLai}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày biên lai
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.ngayBienLai}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày thanh toán
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.ngayTt}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Transaction ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.transId}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mã loại cont
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.maLoaiCont}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mã tính chất cont
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.maTcCont}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tổng trọng lượng
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.tongTrongLuong || 0}{" "}
                        {selectedItem.donViTinh}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Đơn vị tính
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.donViTinh}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ghi chú
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.ghiChu}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetinGetoutPage;
