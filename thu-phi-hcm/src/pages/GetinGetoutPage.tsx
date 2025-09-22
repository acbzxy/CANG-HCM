import React, { useState } from "react";
import * as XLSX from 'xlsx';

interface SearchResult {
  id: number;
  billNumber: string;
  containerNumber: string;
  loaiCont: string;
  tinhChatCont: string;
  donGia: number;
  soTien: number;
  soToKhai: string;
  ngayToKhai: string;
  maDoanhNghiepKhaiPhi: string;
  tenDoanhNghiepKhaiPhi: string;
  soTiepNhanKhaiPhi: string;
  ngayKhaiPhi: string;
  tongTienPhi: number;
  trangThaiNganHang: string;
  arrivalDate?: string;
  departureDate?: string;
  goodsType: string;
  weight: string;
  status: string;
  warehouse: string;
  shipper?: string;
  consignee?: string;
  vesselName?: string;
  voyageNumber?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  customsDeclaration?: string;
  remarks?: string;
}

const GetinGetoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'getin' | 'getout'>('getin');
  const [searchBillNumber, setSearchBillNumber] = useState('');
  const [searchContainerNumber, setSearchContainerNumber] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  // Mock data for Getin
  const getinData: SearchResult[] = [
    {
      id: 1,
      billNumber: "BL001234567",
      containerNumber: "ABC1234567",
      loaiCont: "20ft",
      tinhChatCont: "Hàng hóa thường",
      donGia: 50000,
      soTien: 1275000,
      soToKhai: "TK001234567",
      ngayToKhai: "2025-01-15",
      maDoanhNghiepKhaiPhi: "DN001",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH ABC",
      soTiepNhanKhaiPhi: "TN001234567",
      ngayKhaiPhi: "2025-01-15",
      tongTienPhi: 1500000,
      trangThaiNganHang: "Đã thanh toán",
      arrivalDate: "2025-01-15",
      goodsType: "Container",
      weight: "25.5 T",
      status: "Đã nhập",
      warehouse: "Kho A1",
      shipper: "Công ty TNHH ABC",
      consignee: "Công ty TNHH XYZ",
      vesselName: "MV HANOI",
      voyageNumber: "V001",
      portOfLoading: "Singapore",
      portOfDischarge: "Cảng Sài Gòn",
      customsDeclaration: "TKH001234567",
      remarks: "Hàng hóa điện tử"
    },
    {
      id: 2,
      billNumber: "BL001234568",
      containerNumber: "DEF4567890",
      loaiCont: "40ft",
      tinhChatCont: "Hàng hóa đặc biệt",
      donGia: 60000,
      soTien: 1812000,
      soToKhai: "TK001234568",
      ngayToKhai: "2025-01-14",
      maDoanhNghiepKhaiPhi: "DN003",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH DEF",
      soTiepNhanKhaiPhi: "TN001234568",
      ngayKhaiPhi: "2025-01-14",
      tongTienPhi: 1800000,
      trangThaiNganHang: "Đang xử lý",
      arrivalDate: "2025-01-14",
      goodsType: "Container",
      weight: "30.2 T",
      status: "Đang xử lý",
      warehouse: "Kho B2",
      shipper: "Công ty TNHH DEF",
      consignee: "Công ty TNHH GHI",
      vesselName: "MV HO CHI MINH",
      voyageNumber: "V002",
      portOfLoading: "Hong Kong",
      portOfDischarge: "Cảng Sài Gòn",
      customsDeclaration: "TKH001234568",
      remarks: "Hàng hóa may mặc"
    },
    {
      id: 3,
      billNumber: "BL001234569",
      containerNumber: "GHI7890123",
      loaiCont: "20ft",
      tinhChatCont: "Hàng hóa lạnh",
      donGia: 70000,
      soTien: 2016000,
      soToKhai: "TK001234569",
      ngayToKhai: "2025-01-13",
      maDoanhNghiepKhaiPhi: "DN005",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH JKL",
      soTiepNhanKhaiPhi: "TN001234569",
      ngayKhaiPhi: "2025-01-13",
      tongTienPhi: 2000000,
      trangThaiNganHang: "Đã thanh toán",
      arrivalDate: "2025-01-13",
      goodsType: "Container",
      weight: "28.8 T",
      status: "Đã nhập",
      warehouse: "Kho C3",
      shipper: "Công ty TNHH JKL",
      consignee: "Công ty TNHH MNO",
      vesselName: "MV SAIGON",
      voyageNumber: "V003",
      portOfLoading: "Bangkok",
      portOfDischarge: "Cảng Sài Gòn",
      customsDeclaration: "TKH001234569",
      remarks: "Hàng hóa thực phẩm"
    },
    {
      id: 4,
      billNumber: "BL001234570",
      containerNumber: "JKL0123456",
      loaiCont: "40ft",
      tinhChatCont: "Hàng hóa nguy hiểm",
      donGia: 80000,
      soTien: 2568000,
      soToKhai: "TK001234570",
      ngayToKhai: "2025-01-12",
      maDoanhNghiepKhaiPhi: "DN007",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH PQR",
      soTiepNhanKhaiPhi: "TN001234570",
      ngayKhaiPhi: "2025-01-12",
      tongTienPhi: 2200000,
      trangThaiNganHang: "Chờ xác nhận",
      arrivalDate: "2025-01-12",
      goodsType: "Container",
      weight: "32.1 T",
      status: "Chờ kiểm tra",
      warehouse: "Kho A2",
      shipper: "Công ty TNHH PQR",
      consignee: "Công ty TNHH STU",
      vesselName: "MV VIETNAM",
      voyageNumber: "V004",
      portOfLoading: "Shanghai",
      portOfDischarge: "Cảng Sài Gòn",
      customsDeclaration: "TKH001234570",
      remarks: "Hàng hóa cơ khí"
    }
  ];

  // Mock data for Getout
  const getoutData: SearchResult[] = [
    {
      id: 1,
      billNumber: "BL002345678",
      containerNumber: "XYZ7890123",
      loaiCont: "20ft",
      tinhChatCont: "Hàng hóa thường",
      donGia: 55000,
      soTien: 1501500,
      soToKhai: "TK002345678",
      ngayToKhai: "2025-01-15",
      maDoanhNghiepKhaiPhi: "DN009",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH VWX",
      soTiepNhanKhaiPhi: "TN002345678",
      ngayKhaiPhi: "2025-01-15",
      tongTienPhi: 1600000,
      trangThaiNganHang: "Đã thanh toán",
      departureDate: "2025-01-15",
      goodsType: "Container",
      weight: "27.3 T",
      status: "Đã xuất",
      warehouse: "Kho D1",
      shipper: "Công ty TNHH VWX",
      consignee: "Công ty TNHH YZA",
      vesselName: "MV HANOI",
      voyageNumber: "V005",
      portOfLoading: "Cảng Sài Gòn",
      portOfDischarge: "Singapore",
      customsDeclaration: "TKH002345678",
      remarks: "Hàng hóa điện tử xuất khẩu"
    },
    {
      id: 2,
      billNumber: "BL002345679",
      containerNumber: "MNO3456789",
      loaiCont: "40ft",
      tinhChatCont: "Hàng hóa đặc biệt",
      donGia: 65000,
      soTien: 1930500,
      soToKhai: "TK002345679",
      ngayToKhai: "2025-01-14",
      maDoanhNghiepKhaiPhi: "DN011",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH BCD",
      soTiepNhanKhaiPhi: "TN002345679",
      ngayKhaiPhi: "2025-01-14",
      tongTienPhi: 1900000,
      trangThaiNganHang: "Đang xử lý",
      departureDate: "2025-01-14",
      goodsType: "Container",
      weight: "29.7 T",
      status: "Đang chuẩn bị",
      warehouse: "Kho E2",
      shipper: "Công ty TNHH BCD",
      consignee: "Công ty TNHH EFG",
      vesselName: "MV HO CHI MINH",
      voyageNumber: "V006",
      portOfLoading: "Cảng Sài Gòn",
      portOfDischarge: "Hong Kong",
      customsDeclaration: "TKH002345679",
      remarks: "Hàng hóa may mặc xuất khẩu"
    },
    {
      id: 3,
      billNumber: "BL002345680",
      containerNumber: "PQR6789012",
      loaiCont: "20ft",
      tinhChatCont: "Hàng hóa lạnh",
      donGia: 75000,
      soTien: 1980000,
      soToKhai: "TK002345680",
      ngayToKhai: "2025-01-13",
      maDoanhNghiepKhaiPhi: "DN013",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH HIJ",
      soTiepNhanKhaiPhi: "TN002345680",
      ngayKhaiPhi: "2025-01-13",
      tongTienPhi: 2100000,
      trangThaiNganHang: "Đã thanh toán",
      departureDate: "2025-01-13",
      goodsType: "Container",
      weight: "26.4 T",
      status: "Đã xuất",
      warehouse: "Kho F3",
      shipper: "Công ty TNHH HIJ",
      consignee: "Công ty TNHH KLM",
      vesselName: "MV SAIGON",
      voyageNumber: "V007",
      portOfLoading: "Cảng Sài Gòn",
      portOfDischarge: "Bangkok",
      customsDeclaration: "TKH002345680",
      remarks: "Hàng hóa thực phẩm xuất khẩu"
    },
    {
      id: 4,
      billNumber: "BL002345681",
      containerNumber: "STU9012345",
      loaiCont: "40ft",
      tinhChatCont: "Hàng hóa nguy hiểm",
      donGia: 85000,
      soTien: 2703000,
      soToKhai: "TK002345681",
      ngayToKhai: "2025-01-12",
      maDoanhNghiepKhaiPhi: "DN015",
      tenDoanhNghiepKhaiPhi: "Công ty TNHH NOP",
      soTiepNhanKhaiPhi: "TN002345681",
      ngayKhaiPhi: "2025-01-12",
      tongTienPhi: 2300000,
      trangThaiNganHang: "Chờ xác nhận",
      departureDate: "2025-01-12",
      goodsType: "Container",
      weight: "31.8 T",
      status: "Chờ xác nhận",
      warehouse: "Kho D2",
      shipper: "Công ty TNHH NOP",
      consignee: "Công ty TNHH QRS",
      vesselName: "MV VIETNAM",
      voyageNumber: "V008",
      portOfLoading: "Cảng Sài Gòn",
      portOfDischarge: "Shanghai",
      customsDeclaration: "TKH002345681",
      remarks: "Hàng hóa cơ khí xuất khẩu"
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

  // Hàm tìm kiếm
  const handleSearch = () => {
    const currentData = activeTab === 'getin' ? getinData : getoutData;
    let results = currentData;

    if (searchBillNumber.trim()) {
      results = results.filter(item => 
        item.billNumber.toLowerCase().includes(searchBillNumber.toLowerCase())
      );
    }

    if (searchContainerNumber.trim()) {
      results = results.filter(item => 
        item.containerNumber.toLowerCase().includes(searchContainerNumber.toLowerCase())
      );
    }

    setSearchResults(results);
    setSelectedItem(null);
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchBillNumber('');
    setSearchContainerNumber('');
    setSearchResults([]);
    setSelectedItem(null);
  };

  // Hàm xem chi tiết
  const handleViewDetails = (item: SearchResult) => {
    setSelectedItem(item);
  };

  const exportToExcel = () => {
    const dataToExport = searchResults.length > 0 ? searchResults : (activeTab === 'getin' ? getinData : getoutData);
    const tabName = activeTab === 'getin' ? 'GETIN' : 'GETOUT';
    
    // Chuẩn bị dữ liệu cho Excel
    const excelData = dataToExport.map((item, index) => ({
      'STT': index + 1,
      'Số vận đơn': item.billNumber,
      'Số hiệu cont': item.containerNumber,
      'Loại cont': item.loaiCont,
      'Tính chất cont': item.tinhChatCont,
      'Đơn giá': item.donGia,
      'Số tiền': item.soTien,
      'Số tờ khai': item.soToKhai,
      'Ngày tờ khai': item.ngayToKhai,
      'Mã DN khai phí': item.maDoanhNghiepKhaiPhi,
      'Tên DN khai phí': item.tenDoanhNghiepKhaiPhi,
      'Số tiếp nhận khai phí': item.soTiepNhanKhaiPhi,
      'Ngày khai phí': item.ngayKhaiPhi,
      'Tổng tiền phí': item.tongTienPhi,
      'Trạng thái ngân hàng': item.trangThaiNganHang,
      'Trạng thái': item.status,
      'Kho/Bãi': item.warehouse,
      'Người gửi': item.shipper,
      'Người nhận': item.consignee,
      'Tên tàu': item.vesselName,
      'Số chuyến': item.voyageNumber,
      'Cảng xếp': item.portOfLoading,
      'Cảng dỡ': item.portOfDischarge,
      'Tờ khai hải quan': item.customsDeclaration,
      'Loại hàng': item.goodsType,
      'Trọng lượng': item.weight,
      [activeTab === 'getin' ? 'Ngày nhập' : 'Ngày xuất']: activeTab === 'getin' ? item.arrivalDate : item.departureDate,
      'Ghi chú': item.remarks
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
  const displayData = searchResults.length > 0 ? searchResults : currentData;

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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-search mr-2"></i>
                Tìm kiếm
              </button>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                {displayData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          activeTab === 'getin' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.billNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.containerNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.loaiCont}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={item.tinhChatCont}>
                        {item.tinhChatCont}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.donGia.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-blue-600">
                      {item.soTien.toLocaleString('vi-VN')} VNĐ
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
                      <div className="max-w-xs truncate" title={item.tenDoanhNghiepKhaiPhi}>
                        {item.tenDoanhNghiepKhaiPhi}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.soTiepNhanKhaiPhi}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ngayKhaiPhi}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-green-600">
                      {item.tongTienPhi.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.trangThaiNganHang)}`}>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Hiển thị {displayData.length} kết quả
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={exportToExcel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <i className="fas fa-download mr-2"></i>
                Xuất Excel
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
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số vận đơn</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.billNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số hiệu container</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.containerNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại cont</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.loaiCont}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tính chất cont</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.tinhChatCont}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đơn giá</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold text-blue-600">
                      {selectedItem.donGia.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold text-green-600">
                      {selectedItem.soTien.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tờ khai</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.soToKhai}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tờ khai</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.ngayToKhai}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã DN khai phí</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.maDoanhNghiepKhaiPhi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên DN khai phí</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.tenDoanhNghiepKhaiPhi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiếp nhận khai phí</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.soTiepNhanKhaiPhi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày khai phí</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.ngayKhaiPhi}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng tiền phí</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold text-green-600">
                      {selectedItem.tongTienPhi.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái ngân hàng</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(selectedItem.trangThaiNganHang)}`}>
                      {selectedItem.trangThaiNganHang}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kho/Bãi</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.warehouse}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Người gửi</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.shipper}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Người nhận</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.consignee}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bổ sung</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên tàu</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.vesselName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số chuyến</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.voyageNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cảng xếp</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.portOfLoading}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cảng dỡ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.portOfDischarge}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tờ khai hải quan</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.customsDeclaration}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Loại hàng</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.goodsType}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trọng lượng</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.weight}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {activeTab === 'getin' ? 'Ngày nhập' : 'Ngày xuất'}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.arrivalDate || selectedItem.departureDate}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.remarks}</p>
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
