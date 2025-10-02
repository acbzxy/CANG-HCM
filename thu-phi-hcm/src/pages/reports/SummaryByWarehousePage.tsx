import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CrmApiService } from "../../utils/crmApi";

const SummaryByWarehousePage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-12-31");
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // Load data from API
  const loadDataFromApi = async () => {
    if (!dateFrom || !dateTo) {
      setWarehouseData([]);
      setIsEmpty(true);
      setError("Vui lòng chọn khoảng thời gian");
      return;
    }

    // Validate date range
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (fromDate > toDate) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      setWarehouseData([]);
      setIsEmpty(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsEmpty(false);

      const response = await CrmApiService.getBaoCaoTheoKho(dateFrom, dateTo);

      console.log("🔍 Warehouse API Response:", response);

      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Map API response to our format
        const mappedData = response.data.map((item: any, index: number) => {
          console.log(`📋 Mapping warehouse item ${index + 1}:`, item);

          return {
            warehouse: item.maKho || `Kho ${index + 1}`,
            totalReceipts: Number(item.soBienLai || 0),
            totalAmount: Number(item.tongTien || 0),
            percentage: Number(item.tyLePhanTram || 0),
            status: "Hoạt động", // Static value as API doesn't provide this
          };
        });

        console.log("✅ Mapped warehouse data:", mappedData);
        setWarehouseData(mappedData);
        setIsEmpty(false);
      } else {
        console.log("📭 API trả về dữ liệu rỗng hoặc không hợp lệ");
        setWarehouseData([]);
        setIsEmpty(true);
        setError(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu từ API:", err);
      setError("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
      setWarehouseData([]);
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    loadDataFromApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🏪
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Tổng Hợp Theo Kho
                </h1>
                <p className="text-gray-600">
                  Báo cáo tổng hợp thu phí theo kho
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>Từ ngày:</span>
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
              <Button
                variant="success"
                icon={<span>📊</span>}
                disabled={
                  loading || error || isEmpty || warehouseData.length === 0
                }
              >
                Xuất Báo Cáo
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <div className="text-red-600 font-medium mb-2">{error}</div>
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
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {warehouseData.map((item, index) => (
              <Card
                key={index}
                hover
                variant="elevated"
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    🏪
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.warehouse}
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{item.totalReceipts}</span>{" "}
                      biên lai
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {Number(item.totalAmount).toLocaleString("vi-VN")} VNĐ
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.percentage.toFixed(1)}% tổng thu
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Table */}
        {!loading && !error && !isEmpty && warehouseData.length > 0 && (
          <Card
            className="animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">
                Chi Tiết Theo Kho
              </h2>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Kho
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Số biên lai
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Tỷ lệ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {warehouseData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {item.warehouse}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.totalReceipts}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          {Number(item.totalAmount).toLocaleString("vi-VN")} VNĐ
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.percentage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SummaryByWarehousePage;
