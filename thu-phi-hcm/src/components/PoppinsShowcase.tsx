import React from 'react';

const PoppinsShowcase: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🎨 SVN-Poppins Font System  
        </h1>
        <p className="text-xl font-medium text-gray-600 max-w-3xl mx-auto">
          Font SVN-Poppins đã được áp dụng cho toàn bộ hệ thống thu phí Hải quan TP.HCM - Modern, Versatile, Professional
        </p>
      </div>

      {/* Font Weight Showcase */}
      <div className="grid gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Light (font-light)</h3>
          <p className="text-2xl font-light text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-light text-gray-600">
            Font nhẹ nhàng, thanh thoát cho ghi chú và văn bản phụ. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-600 mb-3">Regular (font-normal)</h3>
          <p className="text-2xl font-normal text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-normal text-gray-600">
            Font chuẩn cho nội dung chính, dễ đọc và rõ ràng. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-yellow-600 mb-3">Medium (font-medium)</h3>
          <p className="text-2xl font-medium text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-medium text-gray-600">
            Font trung bình cho thông tin quan trọng. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-600 mb-3">SemiBold (font-semibold)</h3>
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-semibold text-gray-600">
            Font bán đậm cho tiêu đề phụ và làm nổi bật. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-600 mb-3">Bold (font-bold)</h3>
          <p className="text-2xl font-bold text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-bold text-gray-600">
            Font đậm cho tiêu đề và thông tin đặc biệt quan trọng. The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-600 mb-3">ExtraBold (font-extrabold)</h3>
          <p className="text-2xl font-extrabold text-gray-700 mb-2">
            Hệ thống thu phí Hải quan TP.HCM
          </p>
          <p className="font-extrabold text-gray-600">
            Font rất đậm cho tiêu đề chính và logo. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>

      {/* Practical Application Examples */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✨ Ví dụ ứng dụng thực tế với Montserrat
        </h2>
        
        {/* Declaration Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">📋 Tờ khai khai báo nộp phí</h3>
              <p className="font-semibold text-blue-600 text-lg">Mã số: TK-2024-001</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-600">Trạng thái:</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-full text-sm">
                ✅ Đã ký số
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium text-gray-600">Doanh nghiệp:</p>
              <p className="font-semibold text-gray-800">Công ty TNHH Xuất Nhập Khẩu ABC</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Ngày khai báo:</p>
              <p className="font-semibold text-gray-800">09/09/2024</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Tổng tiền phí:</p>
              <p className="text-2xl font-bold text-green-600">2,500,000 VNĐ</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Hải quan:</p>
              <p className="font-semibold text-gray-800">Cảng Sài Gòn</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Xem chi tiết
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              In biên lai
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              Tải XML
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-extrabold text-blue-600 mb-2">1,247</div>
            <div className="font-semibold text-gray-600">Tờ khai hôm nay</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-extrabold text-green-600 mb-2">95.8%</div>
            <div className="font-semibold text-gray-600">Tỷ lệ thành công</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-extrabold text-purple-600 mb-2">28.5B</div>
            <div className="font-semibold text-gray-600">Tổng thu VNĐ</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-extrabold text-orange-600 mb-2">156</div>
            <div className="font-semibold text-gray-600">Doanh nghiệp</div>
          </div>
        </div>
      </div>

      {/* Font Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
          <div className="text-4xl font-extrabold mb-2">8</div>
          <div className="font-semibold">Font Weights</div>
          <div className="text-sm opacity-90 mt-1">300-800</div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg">
          <div className="text-4xl font-extrabold mb-2">✓</div>
          <div className="font-semibold">Italic Support</div>
          <div className="text-sm opacity-90 mt-1">Tất cả weights</div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg">
          <div className="text-4xl font-extrabold mb-2">🇻🇳</div>
          <div className="font-semibold">Tiếng Việt</div>
          <div className="text-sm opacity-90 mt-1">Dấu hoàn hảo</div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg">
          <div className="text-4xl font-extrabold mb-2">∞</div>
          <div className="font-semibold">Google Fonts</div>
          <div className="text-sm opacity-90 mt-1">CDN nhanh</div>
        </div>
      </div>

      {/* Typography Samples */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📝 Typography Samples
        </h2>
        
        <div className="space-y-6">
          {/* Headings */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Heading 1 - Open Sans ExtraBold</h1>
            <h2 className="text-3xl font-bold text-gray-700 mb-2">Heading 2 - Open Sans Bold</h2>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Heading 3 - Open Sans SemiBold</h3>
            <h4 className="text-xl font-medium text-gray-600 mb-2">Heading 4 - Open Sans Medium</h4>
            <h5 className="text-lg font-normal text-gray-600 mb-2">Heading 5 - Open Sans Regular</h5>
            <h6 className="text-base font-light text-gray-600">Heading 6 - Open Sans Light</h6>
          </div>

          {/* Paragraphs */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-normal text-gray-700 mb-4">
              <strong className="font-bold">Đoạn văn thường:</strong> Hệ thống thu phí Hải quan Thành phố Hồ Chí Minh được thiết kế để 
              hỗ trợ các doanh nghiệp trong việc khai báo và nộp phí hải quan một cách thuận tiện và hiệu quả. 
              Với giao diện thân thiện và các tính năng mạnh mẽ, hệ thống giúp tối ưu hóa quy trình làm việc.
            </p>
            
            <p className="text-base font-light text-gray-600 italic mb-4">
              Đoạn văn nhẹ và in nghiêng: Open Sans với thiết kế hiện đại và dễ đọc, 
              mang lại trải nghiệm người dùng tuyệt vời cho các ứng dụng web và mobile.
            </p>
            
            <blockquote className="border-l-4 border-blue-500 pl-4 font-medium text-gray-700 italic">
              "Open Sans là một trong những font family phổ biến nhất trên web, 
              được thiết kế với mục tiêu tối ưu cho độ rõ nét và dễ đọc."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">🎨 Font SVN-Poppins đã sẵn sàng!</h2>
        <p className="text-xl font-medium mb-6">
          Toàn bộ hệ thống thu phí Hải quan TP.HCM giờ đây sử dụng font SVN-Poppins 
          - Modern, versatile, và professional appearance với 9 font weights
        </p>
        <div className="flex justify-center space-x-4">
          <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg font-semibold">
            ✅ 9 Weights
          </span>
          <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg font-semibold">
            ✅ Full Italic
          </span>
          <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg font-semibold">
            ✅ Modern Design
          </span>
          <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg font-semibold">
            ✅ Vietnamese OK
          </span>
        </div>
      </div>
    </div>
  );
};

export default PoppinsShowcase;
