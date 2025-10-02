import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import * as XLSX from "xlsx";
import { CrmApiService } from "../../utils/crmApi";

const ReceiptListPage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-01-31");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // Load data from API
  const loadDataFromApi = async () => {
    if (!dateFrom || !dateTo) {
      setFilteredData([]);
      setIsEmpty(true);
      setError("Vui lòng chọn khoảng thời gian");
      return;
    }

    // Validate date range
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (fromDate > toDate) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      setFilteredData([]);
      setIsEmpty(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsEmpty(false);

      const response = await CrmApiService.getBaoCaoBlThu(dateFrom, dateTo);

      console.log("🔍 API Response:", response);

      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Map API response to our format
        const mappedData = response.data.map((item: any, index: number) => {
          console.log(`📋 Mapping item ${index + 1}:`, item);
          console.log(`🏢 Company name fields:`, {
            tenDvi: item.tenDvi,
            tenDoanhNghiep: item.tenDoanhNghiep,
            tenDN: item.tenDN,
          });

          const mappedItem = {
            stt: index + 1,
            so: item.soBienLai || item.so || item.soBienLai || "",
            ngay: item.ngayTao || item.ngay || item.ngayTao || "",
            tenDN: item.tenDvi || item.tenDoanhNghiep || item.tenDN || "",
            tongCong: Number(
              item.tongTien || item.tongCong || item.tongTien || 0
            ),
            tMuc1: Number(item.tMuc1 || 0),
            tMuc2: Number(item.tMuc2 || 0),
            tMuc3: Number(item.tMuc3 || 0),
            tMuc4: Number(item.tMuc4 || 0),
          };

          console.log(`✅ Mapped item ${index + 1}:`, mappedItem);
          return mappedItem;
        });

        console.log("✅ Mapped data:", mappedData);
        setFilteredData(mappedData);
        setIsEmpty(false);
      } else {
        // Show empty state when API returns no data
        console.log("📭 API trả về dữ liệu rỗng hoặc không hợp lệ");
        setFilteredData([]);
        setIsEmpty(true);
        setError(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu từ API:", err);
      setError("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
      setFilteredData([]);
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filtered data on component mount
  useEffect(() => {
    loadDataFromApi();
  }, []);

  const totalAmount = filteredData.reduce(
    (sum, item) => sum + item.tongCong,
    0
  );
  const totalTMuc1 = filteredData.reduce((sum, item) => sum + item.tMuc1, 0);
  const totalTMuc2 = filteredData.reduce((sum, item) => sum + item.tMuc2, 0);
  const totalTMuc3 = filteredData.reduce((sum, item) => sum + item.tMuc3, 0);
  const totalTMuc4 = filteredData.reduce((sum, item) => sum + item.tMuc4, 0);
  const totalRecords = filteredData.length;

  // Export to Excel function
  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert(
        "Không có dữ liệu để xuất Excel. Vui lòng chọn khoảng thời gian khác."
      );
      return;
    }

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare header data
      const currentDate = new Date().toLocaleDateString("vi-VN");
      const fromDateFormatted = new Date(dateFrom).toLocaleDateString("vi-VN");
      const toDateFormatted = new Date(dateTo).toLocaleDateString("vi-VN");

      const headerData = [
        ["BẢNG KÊ BIÊN LAI THU PHÍ"],
        [`Từ ngày: ${fromDateFormatted} - Đến ngày: ${toDateFormatted}`],
        [`Ngày xuất báo cáo: ${currentDate}`],
        [`Tổng số bản ghi: ${totalRecords} biên lai`],
        [], // Empty row
        [
          "STT",
          "Số",
          "Ngày",
          "Tên doanh nghiệp",
          "Tổng số",
          "T.Mức 1",
          "T.Mức 2",
          "T.Mức 3",
          "T.Mức 4",
        ],
      ];

      // Prepare data rows
      const dataRows = filteredData.map((item) => [
        item.stt,
        item.so,
        item.ngay,
        item.tenDN,
        item.tongCong,
        item.tMuc1,
        item.tMuc2,
        item.tMuc3,
        item.tMuc4,
      ]);

      // Prepare total row
      const totalRow = [
        "",
        "",
        "",
        `Tổng cộng biên lai đã thu: ${totalRecords} biên lai - Tổng số tiền đã thu: ${totalAmount.toLocaleString()}`,
        totalAmount,
        totalTMuc1,
        totalTMuc2,
        totalTMuc3,
        totalTMuc4,
      ];

      // Combine all data
      const allData = [...headerData, ...dataRows, totalRow];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(allData);

      // Set column widths
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Số
        { wch: 12 }, // Ngày
        { wch: 60 }, // Tên doanh nghiệp
        { wch: 15 }, // Tổng số
        { wch: 12 }, // T.Mức 1
        { wch: 12 }, // T.Mức 2
        { wch: 12 }, // T.Mức 3
        { wch: 12 }, // T.Mức 4
      ];
      ws["!cols"] = colWidths;

      // Merge cells for header
      if (!ws["!merges"]) ws["!merges"] = [];
      ws["!merges"].push(
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Date range
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Export date
        { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } }, // Total records
        {
          s: { r: allData.length - 1, c: 0 },
          e: { r: allData.length - 1, c: 3 },
        } // Total row text
      );

      // Style cells
      const headerRowIndex = 5; // Header row starts at index 5
      const totalRowIndex = allData.length - 1;

      // Style title
      const titleCell = "A1";
      if (ws[titleCell]) {
        ws[titleCell].s = {
          font: { bold: true, size: 16 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // Style header info rows
      for (let row = 1; row <= 3; row++) {
        const cellAddress = `A${row + 1}`;
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center" },
          };
        }
      }

      // Style column headers
      for (let col = 0; col < 9; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: headerRowIndex,
          c: col,
        });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "366092" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      // Style data rows
      for (let row = headerRowIndex + 1; row < totalRowIndex; row++) {
        for (let col = 0; col < 9; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              alignment: {
                horizontal: col >= 4 ? "right" : col === 0 ? "center" : "left",
                vertical: "center",
              },
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } },
              },
            };

            // Format numbers
            if (col >= 4 && typeof ws[cellAddress].v === "number") {
              ws[cellAddress].z = "#,##0";
            }
          }
        }
      }

      // Style total row
      for (let col = 0; col < 9; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: totalRowIndex,
          c: col,
        });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { fgColor: { rgb: "FFFF00" } },
            alignment: {
              horizontal: col >= 4 ? "right" : "left",
              vertical: "center",
            },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };

          // Format numbers in total row
          if (col >= 4 && typeof ws[cellAddress].v === "number") {
            ws[cellAddress].z = "#,##0";
          }
        }
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Bảng kê BL thu");

      // Generate filename
      const filename = `BangKe_BienLai_${fromDateFormatted.replace(
        /\//g,
        "-"
      )}_${toDateFormatted.replace(/\//g, "-")}_${currentDate.replace(
        /\//g,
        "-"
      )}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      // Show success message
      alert(`✅ Đã xuất Excel thành công!
      
📄 File: ${filename}
📊 Số bản ghi: ${totalRecords}
💰 Tổng tiền: ${totalAmount.toLocaleString()} VNĐ
📅 Khoảng thời gian: ${fromDateFormatted} - ${toDateFormatted}

File đã được lưu vào thư mục Downloads của bạn.`);
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      alert(
        "❌ Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!\n\nChi tiết lỗi: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header & Table Header Combined */}
      <div className="sticky top-20 z-10 bg-gray-100 shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToExcel}
                disabled={
                  !!(loading || error || isEmpty || filteredData.length === 0)
                }
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  loading || error || isEmpty || filteredData.length === 0
                    ? "text-gray-400 bg-gray-300 border-gray-300 cursor-not-allowed"
                    : "text-white bg-green-600 border-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
              >
                📊 Export excel
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>Ngày biên lai từ:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  title="Chọn ngày bắt đầu"
                  placeholder="Chọn ngày bắt đầu"
                />
                <span>Đến:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  title="Chọn ngày kết thúc"
                  placeholder="Chọn ngày kết thúc"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDataFromApi}
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Tìm kiếm"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {loading ? "..." : totalRecords} Đơn
              </span>
              {loading && (
                <span className="ml-2 text-blue-600">Đang tải...</span>
              )}
              {error && <span className="ml-2 text-red-600">{error}</span>}
              {isEmpty && !loading && (
                <span className="ml-2 text-gray-500">Không có dữ liệu</span>
              )}
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="border-b border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-12 bg-gray-100">
                    STT
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32 bg-gray-100">
                    Số
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32 bg-gray-100">
                    Ngày
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1 bg-gray-100">
                    Tên doanh nghiệp
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24 bg-gray-100">
                    Tổng số
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">
                    T.Mức
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">
                    T.Mức
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">
                    T.Mức
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-20 bg-gray-100">
                    T.Mức
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Excel-like Data Table */}
        <div className="flex-1 bg-white border-l border-r border-gray-300">
          <div className="overflow-x-auto h-full">
            <table className="w-full border-collapse">
              <thead className="invisible">
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-12">
                    STT
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32">
                    Số
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-32">
                    Ngày
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center flex-1">
                    Tên doanh nghiệp
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-24">
                    Tổng số
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">
                    T.Mức
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">
                    T.Mức
                  </th>
                  <th className="border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">
                    T.Mức
                  </th>
                  <th className="px-3 py-2 text-xs font-medium text-gray-700 text-center w-20">
                    T.Mức
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-red-500 text-4xl mb-2">⚠️</div>
                        <div className="text-red-600 font-medium mb-2">
                          {error}
                        </div>
                        <div className="text-gray-500 text-sm mb-4">
                          Vui lòng kiểm tra kết nối mạng và thử lại
                        </div>
                        <button
                          onClick={loadDataFromApi}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          🔄 Thử lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 text-4xl mb-2">📄</div>
                        <div className="text-gray-600 font-medium mb-2">
                          Không có dữ liệu trong khoảng thời gian đã chọn
                        </div>
                        <div className="text-gray-500 text-sm mb-4">
                          Từ {dateFrom} đến {dateTo}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Vui lòng chọn khoảng thời gian khác
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.stt}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">
                        {item.stt}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs">
                        {item.so || "-"}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-center">
                        {item.ngay || "-"}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs">
                        {item.tenDN || "-"}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-medium">
                        {Number(item.tongCong || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">
                        {Number(item.tMuc1 || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">
                        {Number(item.tMuc2 || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="border-r border-gray-300 px-3 py-2 text-xs text-right">
                        {Number(item.tMuc3 || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 py-2 text-xs text-right">
                        {Number(item.tMuc4 || 0).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                )}
                {/* Total Row - chỉ hiển thị khi có dữ liệu */}
                {!loading && !error && !isEmpty && filteredData.length > 0 && (
                  <tr className="bg-yellow-100 border-t-2 border-gray-400 font-bold sticky bottom-0">
                    <td
                      className="border-r border-gray-300 px-3 py-2 text-xs text-center bg-yellow-100"
                      colSpan={4}
                    >
                      Tổng cộng biên lai đã thu: {totalRecords} biên lai - Tổng
                      số tiền đã thu: {totalAmount.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold text-red-600 bg-yellow-100">
                      {totalAmount.toLocaleString("vi-VN")}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">
                      {totalTMuc1.toLocaleString("vi-VN")}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">
                      {totalTMuc2.toLocaleString("vi-VN")}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-2 text-xs text-right font-bold bg-yellow-100">
                      {totalTMuc3.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-3 py-2 text-xs text-right font-bold bg-yellow-100">
                      {totalTMuc4.toLocaleString("vi-VN")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed Pagination - chỉ hiển thị khi có dữ liệu */}
        {!loading && !error && !isEmpty && filteredData.length > 0 && (
          <div className="sticky bottom-0 z-10 bg-gray-100 border-t border-gray-300 px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="text-sm text-gray-600">
              Hiển thị 1-{totalRecords} trong tổng số {totalRecords} bản ghi
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                ‹ Trước
              </Button>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                1
              </span>
              <Button variant="outline" size="sm" disabled>
                Sau ›
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptListPage;
