import React, { useState } from "react";
import * as XLSX from 'xlsx';

const GetinGetoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'getin' | 'getout'>('getin');

  // Mock data for Getin
  const getinData = [
    {
      id: 1,
      billNumber: "BL001234567",
      containerNumber: "ABC1234567",
      arrivalDate: "2025-01-15",
      goodsType: "Container",
      weight: "25.5 T",
      status: "Đã nhập",
      warehouse: "Kho A1"
    },
    {
      id: 2,
      billNumber: "BL001234568",
      containerNumber: "DEF4567890",
      arrivalDate: "2025-01-14",
      goodsType: "Container",
      weight: "30.2 T",
      status: "Đang xử lý",
      warehouse: "Kho B2"
    },
    {
      id: 3,
      billNumber: "BL001234569",
      containerNumber: "GHI7890123",
      arrivalDate: "2025-01-13",
      goodsType: "Container",
      weight: "28.8 T",
      status: "Đã nhập",
      warehouse: "Kho C3"
    },
    {
      id: 4,
      billNumber: "BL001234570",
      containerNumber: "JKL0123456",
      arrivalDate: "2025-01-12",
      goodsType: "Container",
      weight: "32.1 T",
      status: "Chờ kiểm tra",
      warehouse: "Kho A2"
    }
  ];

  // Mock data for Getout
  const getoutData = [
    {
      id: 1,
      billNumber: "BL002345678",
      containerNumber: "XYZ7890123",
      departureDate: "2025-01-15",
      goodsType: "Container",
      weight: "27.3 T",
      status: "Đã xuất",
      warehouse: "Kho D1"
    },
    {
      id: 2,
      billNumber: "BL002345679",
      containerNumber: "MNO3456789",
      departureDate: "2025-01-14",
      goodsType: "Container",
      weight: "29.7 T",
      status: "Đang chuẩn bị",
      warehouse: "Kho E2"
    },
    {
      id: 3,
      billNumber: "BL002345680",
      containerNumber: "PQR6789012",
      departureDate: "2025-01-13",
      goodsType: "Container",
      weight: "26.4 T",
      status: "Đã xuất",
      warehouse: "Kho F3"
    },
    {
      id: 4,
      billNumber: "BL002345681",
      containerNumber: "STU9012345",
      departureDate: "2025-01-12",
      goodsType: "Container",
      weight: "31.8 T",
      status: "Chờ xác nhận",
      warehouse: "Kho D2"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã nhập':
      case 'Đã xuất':
        return 'bg-green-100 text-green-800';
      case 'Đang xử lý':
      case 'Đang chuẩn bị':
        return 'bg-yellow-100 text-yellow-800';
      case 'Chờ kiểm tra':
      case 'Chờ xác nhận':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToExcel = () => {
    const currentData = activeTab === 'getin' ? getinData : getoutData;
    const tabName = activeTab === 'getin' ? 'GETIN' : 'GETOUT';
    
    // Chuẩn bị dữ liệu cho Excel
    const excelData = currentData.map((item, index) => ({
      'STT': index + 1,
      'Số vận đơn': item.billNumber,
      'Số hiệu cont': item.containerNumber,
      [activeTab === 'getin' ? 'Ngày Nhập' : 'Ngày Xuất']: activeTab === 'getin' ? (item as any).arrivalDate : (item as any).departureDate,
      'Loại Hàng': item.goodsType,
      'Trọng Lượng': item.weight,
      'Trạng Thái': item.status,
      'Kho/Bãi': item.warehouse
    }));

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tabName);

    // Xuất file
    const fileName = `GetinGetout_${tabName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const currentData = activeTab === 'getin' ? getinData : getoutData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            QUẢN LÝ GETIN/GETOUT
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin hàng hóa nhập/xuất cảng
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('getin')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'getin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              GETIN
            </button>
            <button
              onClick={() => setActiveTab('getout')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'getout'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              GETOUT
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số vận đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số hiệu cont
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'getin' ? 'Ngày Nhập' : 'Ngày Xuất'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trọng Lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kho/Bãi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          activeTab === 'getin' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.billNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.containerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(item as any).arrivalDate || (item as any).departureDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.goodsType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Hiển thị {currentData.length} kết quả
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={exportToExcel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <i className="fas fa-download mr-2"></i>
                Xuất Excel
              </button>
              <button className={`px-4 py-2 text-white rounded ${
                activeTab === 'getin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              }`}>
                <i className="fas fa-plus mr-2"></i>
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetinGetoutPage;
