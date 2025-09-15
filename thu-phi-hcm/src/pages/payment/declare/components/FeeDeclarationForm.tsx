export default function FeeDeclarationForm({ id }: { id?: string }) {
  return (
    <div className="min-h-screen">
      <form id="feeDeclarationForm" className="w-full">
        <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <div className="grid grid-cols-2 gap-4">
            {/* DOANH NGHIỆP KHAI PHÍ */}
            <div>
              <h3 className="font-bold mb-2">DOANH NGHIỆP KHAI PHÍ</h3>
              <div className="bg-white p-2">
                <div className="mb-2">
                  <label className="block text-sm font-bold  mb-1">
                    Mã doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border px-2 py-1"
                    name="companyTaxCode"
                    defaultValue="0201392117"
                    placeholder="VD: 0201392117"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-bold   mb-1">
                    Tên doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border px-2 py-1"
                    name="companyName"
                    defaultValue="Công ty TNHH đầu tư vận tải Hải Sơn"
                    placeholder="VD: Công ty TNHH đầu tư vận tải Hải Sơn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold   mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <input
                    className="w-full border px-2 py-1"
                    name="companyAddress"
                    defaultValue="Số 123 Đường Hải Sơn, Phường 15, Quận 11, TP.HCM"
                    placeholder="VD: Số 123 Đường Hải Sơn, Phường 15, Quận 11, TP.HCM"
                  />
                </div>
              </div>
            </div>
            {/* DOANH NGHIỆP XUẤT NHẬP KHẨU */}
            <div>
              <h3 className="font-bold mb-2">DOANH NGHIỆP XUẤT NHẬP KHẨU</h3>
              <div className="bg-white p-2">
                <div className="mb-2">
                  <label className="block text-sm font-bold   mb-1">
                    Mã doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border px-2 py-1"
                    name="importExportCompanyTaxCode"
                    defaultValue="0201392117"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-bold   mb-1">
                    Tên doanh nghiệp <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border px-2 py-1"
                    name="importExportCompanyName"
                    defaultValue="Công ty TNHH đầu tư vận tải Hải Sơn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold   mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <input
                    className="w-full border px-2 py-1"
                    name="importExportCompanyAddress"
                    defaultValue="Số 123 Đường Hải Sơn, Phường 15, Quận 11, TP.HCM"
                  />
                </div>
              </div>
            </div>
            {/* TỜ KHAI PHÍ */}
            <div>
              <h3 className="font-bold mb-2">TỜ KHAI HẢI QUAN</h3>
              <div className="bg-white p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold ">Số tờ khai <span className="text-red-500">*</span></label>
                    <input 
                      className="w-full border px-2 py-1 mb-1" 
                      name="customsDeclarationNumber"
                      defaultValue="123123234324"
                      placeholder="VD: 123123234324"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold ">Ngày tờ khai <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      className="w-full border px-2 py-1" 
                      name="customsDeclarationDate"
                      defaultValue="2022-02-16"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold ">Mã Hải quan</label>
                    <select className="w-full border px-2 py-1" name="maHaiQuan">
                      <option>-- Chọn --</option>
                      <option value="HQHCM01">HQHCM01 - Chi cục Hải quan TP.HCM</option>
                      <option value="01AC">01AC - Chi cục HQ Gia Lâm</option>
                      <option value="01B1">01B1 - Chi cục HQ CK Sân bay quốc tế Nội Bài</option>
                      <option value="01B2">01B2 - Chi cục HQ CK Sân bay quốc tế Nội Bài</option>
                      <option value="01B3">01B3 - Chi cục HQ CK Sân bay quốc tế Nội Bài</option>
                      <option value="01B4">01B4 - CC HQ CK Sân bay QT Nội Bài - Đội Thủ tục hàng hóa XNK - CSCS</option>
                      <option value="01B5">01B5 - Chi cục HQ CK Sân bay quốc tế Nội Bài</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold ">Mã loại hình</label>
                    <select className="w-full border px-2 py-1" name="maLoaiHinh">
                      <option>-- Chọn --</option>
                      <option value="A12">A12 - Nhập kinh doanh sản xuất</option>
                      <option value="A21">A21 - Chuyển tiêu thụ nội địa từ nguồn tạm nhập</option>
                      <option value="A31">A31 - Nhập hàng XK bị trả lại</option>
                      <option value="A41">A41 - Nhập kinh doanh của doanh nghiệp đầu tư</option>
                      <option value="A42">A42 - Chuyển tiêu thụ nội địa khác</option>
                      <option value="A44">A44 - Nhập vào khu phi thuế quan từ nội địa</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold ">
                      Mã lưu kho/ Dịch vụ
                    </label>
                    <select className="w-full border px-2 py-1" name="maLuuKho">
                      <option>-- Chọn --</option>
                      <option value="KHO123">KHO123 - Kho lưu trữ hàng hóa 123</option>
                      <option value="02ABA01">02ABA01 - CT DVHH TAN SON NHAT</option>
                      <option value="02ABAAB">02ABAAB - SB QT TAN SON NHAT</option>
                      <option value="02ABC01">02ABC01 - KHO THU GOM HANG LE</option>
                      <option value="02ABD01">02ABD01 - GIAN HANG XUAT CANH</option>
                      <option value="02ABD02">02ABD02 - KHO CHINH</option>
                      <option value="02ABF01">02ABF01 - SUAT AN HANG KHONG</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold ">Nước xuất khẩu</label>
                    <select className="w-full border px-2 py-1" name="nuocXuatKhau">
                      <option>-- Chọn --</option>
                      <option value="VN">VN - Vietnam</option>
                      <option value="US">US - United States</option>
                      <option value="CN">CN - China</option>
                      <option value="AD">AD - Andorra</option>
                      <option value="AE">AE - United Arab Emirates</option>
                      <option value="AF">AF - Afganistan</option>
                      <option value="AG">AG - Antigua and Barbuda</option>
                      <option value="AI">AI - Anguilla</option>
                      <option value="AL">AL - Albania</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">TỜ KHAI PHÍ</h3>
              <div className="bg-white p-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold   mb-1">
                      Số tiếp nhận khai phí
                    </label>
                    <input
                      className="w-full border px-2 py-1"
                      name="feeDeclarationReceiptNumber"
                      defaultValue="000000000000"
                      placeholder="VD: 000000000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold  mb-1">
                      Ngày khai phí (tự động)
                    </label>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 h-[33px]"
                      name="feeDeclarationDate"
                      defaultValue="2022-02-16"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold ">Nhóm loại phí</label>
                    <select className="w-full border px-2 py-1" name="nhomLoaiPhi">
                      <option>-- Chọn --</option>
                      <option value="HẠ TẦNG CẢNG BIỂN">HẠ TẦNG CẢNG BIỂN</option>
                      <option value="TP001">TP001 - Hàng tạm nhập tái xuất; Hàng tái xuất tạm nhập; Hàng quá cảnh</option>
                      <option value="TP002">TP002 - Hàng hóa nhập khẩu, xuất khẩu mở tờ khai ngoài TP.HCM</option>
                      <option value="TP003">TP003 - Hàng hóa nhập khẩu, xuất khẩu mở tờ khai tại TP.HCM</option>
                      <option value="TP004">TP004 - Hàng gửi kho ngoại quan; Hàng chuyển khẩu được đưa vào khu vực kho bãi thuộc các cảng biển thành phố (không đưa vào kho ngoại quan và khu vực trung chuyển)</option>
                      <option value="PHÍ DỊCH VỤ CẢNG">PHÍ DỊCH VỤ CẢNG</option>
                      <option value="PHÍ XẾP DỠ HÀNG HÓA">PHÍ XẾP DỠ HÀNG HÓA</option>
                      <option value="PHÍ LƯU KHO">PHÍ LƯU KHO</option>
                      <option value="PHÍ VẬN CHUYỂN">PHÍ VẬN CHUYỂN</option>
                      <option value="PHÍ THUẾ XUẤT NHẬP KHẨU">PHÍ THUẾ XUẤT NHẬP KHẨU</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold  mb-1">
                      Loại thanh toán
                    </label>
                    <select className="w-full border px-2 py-1">
                      <option>Chuyển khoản ngân hàng</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold  mb-1">Ghi chú</label>
                    <textarea
                      className="w-full border px-2 py-1"
                      rows={3}
                      name="notes"
                      defaultValue="Tờ khai phí cho hàng container từ Hải Sơn"
                      placeholder="VD: Tờ khai phí cho hàng container từ Hải Sơn"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 ">
          <div className="">
            <h3 className="font-bold mb-2">THÔNG TIN THU PHÍ</h3>
            <div className="bg-white p-2">
              {[
                "Số thông báo nộp phí",
                "Tổng tiền phí (VND) - Tạm tính",
                "Trạng thái ngân hàng",
                "Số biên lai",
                "Ngày biên lai",
                "Kí hiệu biên lai",
                "Mẫu biên lai",
                "Mã tra cứu biên lai",
                "Xem biên lai",
              ].map((label, idx) => (
                <div className="mb-2" key={idx}>
                  <label className="block text-sm font-bold ">{label}</label>
                  <input
                    className="w-full border px-2 py-1"
                    placeholder="..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2 mt-4 uppercase">
          Thông tin hàng hóa tờ khai
        </h3>
        <div className="bg-white p-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">
                  Mã hiệu phương thức vận chuyển
                </label>
                <select className="w-full border px-2 py-1  h-[35px]" name="maPhuongThucVC">
                  <option>-- Chọn --</option>
                  <option value="1">1 - Đường không</option>
                  <option value="2">2 - Đường biển (Container)</option>
                  <option value="3">3 - Đường biển (Hàng rời, lỏng)</option>
                  <option value="4">4 - Đường bộ (Xe tải)</option>
                  <option value="5">5 - Đường sắt</option>
                  <option value="6">6 - Đường sông</option>
                  <option value="7">7 - Khác</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">Phương tiện vận chuyển</label>
                <select className="w-full border px-2 py-1  h-[35px]" name="phuongTienVC">
                  <option>-- Chọn --</option>
                  <option value="CONTAINER SHIP">CONTAINER SHIP</option>
                  <option value="AIRPLANE">Máy bay</option>
                  <option value="SHIP">Tàu biển</option>
                  <option value="CONTAINER_SHIP">Tàu container</option>
                  <option value="BULK_CARRIER">Tàu chở hàng rời</option>
                  <option value="TRUCK">Xe tải</option>
                  <option value="TRAIN">Tàu hỏa</option>
                  <option value="BARGE">Sà lan</option>
                  <option value="FERRY">Phà</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">Mã địa điểm xếp hàng</label>
                <select className="w-full border px-2 py-1  h-[35px]" name="maDiaDiemXepHang">
                  <option>-- Chọn --</option>
                  <option value="CANGCATLAI">CANGCATLAI - Cảng Cát Lái</option>
                  <option value="VNADTT">VNADTT - CỬA KHẨU A DOT (THUA THIEN-HUE)</option>
                  <option value="VNAPIT">VNAPIT - LỚI MỎ A PA CHAI</option>
                  <option value="VNATH">VNATH - CẢNG AN THỚI</option>
                  <option value="VNBAAT">VNBAAT - CỬA KHẨU BÁC HÀ (LAO CAI)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">Mã địa điểm dỡ hàng</label>
                <select className="w-full border px-2 py-1  h-[35px]" name="maDiaDiemDoHang">
                  <option>-- Chọn --</option>
                  <option value="CANGHAIPHONG">CANGHAIPHONG - Cảng Hải Phòng</option>
                  <option value="VNHCM">VNHCM - Cảng Sài Gòn (TP.HCM)</option>
                  <option value="VNHAN">VNHAN - Cảng Hải Phòng</option>
                  <option value="VNDAD">VNDAD - Cảng Đà Nẵng</option>
                  <option value="VNQNH">VNQNH - Cảng Quy Nhơn</option>
                  <option value="VNVUT">VNVUT - Cảng Vũng Tàu</option>
                  <option value="VNCAN">VNCAN - Cảng Cần Thơ</option>
                  <option value="VNPHU">VNPHU - Cảng Phú Mỹ</option>
                  <option value="VNCAT">VNCAT - Cảng Cát Lái</option>
                  <option value="VNTSN">VNTSN - Sân bay Tân Sơn Nhất</option>
                  <option value="VNNOI">VNNOI - Sân bay Nội Bài</option>
                  <option value="VNDAD_AIR">VNDAD_AIR - Sân bay Đà Nẵng</option>
                  <option value="VNCXR">VNCXR - Cửa khẩu Cầu Treo</option>
                  <option value="VNLAO">VNLAO - Cửa khẩu Lao Bảo</option>
                  <option value="VNMOC">VNMOC - Cửa khẩu Móng Cái</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">Mã phân loại hàng hóa</label>
                <select className="w-full border px-2 py-1 h-[35px]" name="maPhanLoaiHangHoa">
                  <option>-- Chọn --</option>
                  <option value="XNK">XNK - Xuất nhập khẩu</option>
                  <option value="A">A - Hàng quá biều, quá tặng</option>
                  <option value="B">B - Hàng an ninh, quốc phòng</option>
                  <option value="C">C - Hàng cứu trợ khẩn cấp</option>
                  <option value="D">D - Hàng phòng chống thiên tai, dịch bệnh</option>
                  <option value="E">E - Hàng tạm nhập tái xuất</option>
                  <option value="F">F - Hàng quá cảnh</option>
                  <option value="G">G - Hàng chuyển khẩu</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold ">Mục đích vận chuyển</label>
                <select
                  className="w-full border px-2 py-1 h-[35px]"
                  name="mucDichVC"
                >
                  <option>-- Chọn --</option>
                  <option value="Xuất khẩu hàng dệt may">Xuất khẩu hàng dệt may</option>
                  <option value="Vận chuyển hàng hóa là hành lý cá nhân">Vận chuyển hàng hóa là hành lý cá nhân</option>
                  <option value="Vận chuyển hàng hóa giữa 2 khu vực lưu giữ hàng hóa chịu sự giám sát hải quan">Vận chuyển hàng hóa giữa 2 khu vực lưu giữ hàng hóa chịu sự giám sát hải quan</option>
                  <option value="BAG">BAG - Vận chuyển hàng hóa là hành lý cá nhân</option>
                  <option value="BTB">BTB - Vận chuyển hàng hóa giữa 2 khu vực lưu giữ hàng hóa chịu sự giám sát hải quan</option>
                  <option value="BTG">BTG - Vận chuyển hàng hóa XK từ kho ngoại quan, CFS, CY đến cửa khẩu xuất</option>
                  <option value="CIS">CIS - Vận chuyển hàng hóa NK về địa điểm: KT tập trung/p biến giới/hàng CPN, chân cổng tĩnh, CSF</option>
                  <option value="Nhập khẩu hàng điện tử">Nhập khẩu hàng điện tử</option>
                  <option value="Xuất khẩu hàng may mặc">Xuất khẩu hàng may mặc</option>
                  <option value="Vận chuyển hàng hóa nông sản">Vận chuyển hàng hóa nông sản</option>
                </select>
              </div>
            </div>
            <div className="bg-[#ebf6ff] rounded-xl p-2">
              <div className="flex justify-center mb-2 text-center font-semibold uppercase text-[16px]">
                Danh mục các loại hình hàng hóa đề xuất miễn, giảm phí <br />
                theo quy định từ ngày 01/08/2022
              </div>
              <label className="flex items-center gap-2 mb-1 uppercase GXN01">
                <input
                  type="radio"
                  name="MIEN_GIAM_MA"
                  className="appearance-none w-4 h-4 border border-gray-400 rounded-none
      checked:after:content-['✓'] checked:after:text-green-600 
      checked:after:flex checked:after:items-center checked:after:justify-center 
      checked:after:w-full checked:after:h-full bg-white"
                  value="GXN01"
                />
                <span className="lbl">
                  Hàng hóa vận chuyển bằng đường thủy nội địa - <b>GXN01</b>
                </span>
              </label>
              <label className="flex items-center gap-2 mb-1 uppercase MHQC">
                <input
                  type="radio"
                  name="MIEN_GIAM_MA"
                  className="appearance-none w-4 h-4 border border-gray-400 rounded-none
      checked:after:content-['✓'] checked:after:text-green-600 
      checked:after:flex checked:after:items-center checked:after:justify-center 
      checked:after:w-full checked:after:h-full bg-white"
                  value="MHQC"
                />
                <span className="lbl">
                  Hàng quá cảnh, hàng chuyển khẩu vận chuyển bằng phương tiện
                  thủy nội địa qua Campuchia - <b>MHQC</b>
                </span>
              </label>
              <label className="flex items-center gap-2 mb-1 uppercase MKNQ">
                <input
                  type="radio"
                  name="MIEN_GIAM_MA"
                  className="appearance-none w-4 h-4 border border-gray-400 rounded-none
      checked:after:content-['✓'] checked:after:text-green-600 
      checked:after:flex checked:after:items-center checked:after:justify-center 
      checked:after:w-full checked:after:h-full bg-white"
                  value="MKNQ"
                />
                <span className="lbl">
                  Hàng gửi kho ngoại quan vận chuyển bằng phương tiện thủy nội
                  địa qua Campuchia - <b>MKNQ</b>
                </span>
              </label>
              <label className="flex items-center gap-2 mb-1 uppercase MTNTX">
                <input
                  type="radio"
                  name="MIEN_GIAM_MA"
                  className="appearance-none w-4 h-4 border border-gray-400 rounded-none
      checked:after:content-['✓'] checked:after:text-green-600 
      checked:after:flex checked:after:items-center checked:after:justify-center 
      checked:after:w-full checked:after:h-full bg-white"
                  value="MTNTX"
                />
                <span className="lbl">
                  Hàng tạm nhập tái xuất vận chuyển bằng phương tiện thủy nội
                  địa qua Campuchia - <b>MTNTX</b>
                </span>
              </label>
              <label className="flex items-center gap-2 mb-1 uppercase MXN01">
                <input
                  type="radio"
                  name="MIEN_GIAM_MA"
                  className="appearance-none w-4 h-4 border border-gray-400 rounded-none
      checked:after:content-['✓'] checked:after:text-green-600 
      checked:after:flex checked:after:items-center checked:after:justify-center 
      checked:after:w-full checked:after:h-full bg-white"
                  value="MXN01"
                />
                <span className="lbl">
                  Hàng xuất nhập khẩu vận chuyển bằng phương tiện thủy nội địa
                  qua Campuchia- <b>MXN01</b>
                </span>
              </label>
              <hr className="border-t border-[#bbb]" />
              <label className="flex items-center gap-2 mt-2  uppercase MXN01">
                <span className="bg-orange-400 flex items-center px-2 py-1">
                  <input
                    type="radio"
                    name="MIEN_GIAM_MA"
                    className="appearance-none w-4 h-4 border border-gray-400 rounded-none
        checked:after:content-['✓'] checked:after:text-green-600 
        checked:after:flex checked:after:items-center checked:after:justify-center 
        checked:after:w-full checked:after:h-full bg-white"
                    value=""
                  />
                  <span className="lbl ml-2">
                    Bỏ chọn tất cả (Nếu không chọn các danh mục loại hình hàng
                    hóa trên)
                  </span>
                </span>
              </label>
              <div className="italic text-red-600 bg-[#ebf6ff] p-2 rounded">
                <b>Ghi chú:&nbsp;</b>
                Doanh nghiệp hoàn toàn chịu trách nhiệm về tính chính xác đối
                với các thông tin lựa chọn thuộc đối tượng miễn, giảm phí khi
                khai báo trên hệ thống
                <a
                  className="text-blue-600 underline"
                  target="_blank"
                  href="/Files/hdsd/NGH%e1%bb%8a QUYẾT 102020NQ-HĐND SỬA ĐỔI.pdf"
                >
                  Chi tiết quy định...
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
}
