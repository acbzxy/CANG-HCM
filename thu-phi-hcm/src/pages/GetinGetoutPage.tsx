import React from "react";

const GetinGetoutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          GETIN/GETOUT
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Getin Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-sign-in-alt text-blue-600 text-2xl mr-3"></i>
              <h2 className="text-xl font-semibold text-blue-800">GETIN</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Quản lý thông tin hàng hóa nhập khẩu vào cảng
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Xem chi tiết
            </button>
          </div>

          {/* Getout Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-sign-out-alt text-green-600 text-2xl mr-3"></i>
              <h2 className="text-xl font-semibold text-green-800">GETOUT</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Quản lý thông tin hàng hóa xuất khẩu ra khỏi cảng
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
              Xem chi tiết
            </button>
          </div>

          {/* Statistics Card */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-chart-bar text-purple-600 text-2xl mr-3"></i>
              <h2 className="text-xl font-semibold text-purple-800">THỐNG KÊ</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Báo cáo thống kê Getin/Getout theo thời gian
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
              Xem báo cáo
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <i className="fas fa-sign-in-alt text-blue-500 mr-3"></i>
                  <span className="text-gray-700">Container ABC123 - GETIN</span>
                </div>
                <span className="text-sm text-gray-500">2 giờ trước</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <i className="fas fa-sign-out-alt text-green-500 mr-3"></i>
                  <span className="text-gray-700">Container XYZ789 - GETOUT</span>
                </div>
                <span className="text-sm text-gray-500">4 giờ trước</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <i className="fas fa-sign-in-alt text-blue-500 mr-3"></i>
                  <span className="text-gray-700">Container DEF456 - GETIN</span>
                </div>
                <span className="text-sm text-gray-500">6 giờ trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetinGetoutPage;
