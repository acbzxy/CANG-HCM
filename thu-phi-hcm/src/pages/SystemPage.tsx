import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const SystemPage: React.FC = () => {
  const location = useLocation()
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [activeTab, setActiveTab] = useState('users') // 'users' hoặc 'permissions'
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showAddCustomsModal, setShowAddCustomsModal] = useState(false)
  const [customsFormData, setCustomsFormData] = useState({
    code: '',
    name: '',
    level: '',
    address: '',
    phone: '',
    fax: '',
    note: '',
    status: 'Hoạt động'
  })
  const [customsList, setCustomsList] = useState([
    {
      id: 1,
      code: 'C19A',
      name: 'Chi cục HQ Chí Thanh',
      description: 'Chi cục Hải quan Chí Thanh - Tp.HCM',
      isActive: true
    },
    {
      id: 2,
      code: 'C19C',
      name: 'Chi cục HQ Cần Thơ Lộc Thạnh',
      description: 'Chi cục Hải quan Cần Thơ - TP.Cần Thơ',
      isActive: false
    },
    {
      id: 3,
      code: 'C19B',
      name: 'Chi cục HQ Cà Mau',
      description: 'Chi cục Hải quan Cà Mau - TP.Cà Mau',
      isActive: true
    },
    {
      id: 4,
      code: 'C19M',
      name: 'Chi cục HQ An Giang',
      description: 'Chi cục Hải quan An Giang - TP.Long Xuyên',
      isActive: true
    },
    {
      id: 5,
      code: 'C1302',
      name: 'Chi cục HQ Bình Phước',
      description: 'Chi cục Hải quan Bình Phước - TP.Đồng Xoài',
      isActive: true
    },
    {
      id: 6,
      code: 'G1101',
      name: 'Chi cục HQ Tây Ninh',
      description: 'Chi cục Hải quan Tây Ninh - TP.Tây Ninh',
      isActive: true
    },
    {
      id: 7,
      code: 'G1102',
      name: 'Chi cục HQ Kiên Giang',
      description: 'Chi cục Hải quan Kiên Giang - TP.Rạch Giá',
      isActive: false
    },
    {
      id: 8,
      code: 'G543',
      name: 'Chi cục HQ Đồng Tháp',
      description: 'Chi cục Hải quan Đồng Tháp - TP.Cao Lãnh',
      isActive: true
    }
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  
  // Search states cho danh mục hải quan
  const [customsSearchCode, setCustomsSearchCode] = useState('')
  const [customsSearchName, setCustomsSearchName] = useState('')
  
  // Search states cho danh mục ngân hàng TM  
  const [banksSearchCode, setBanksSearchCode] = useState('')
  const [banksSearchName, setBanksSearchName] = useState('')

  // Search states cho quản lý người dùng
  const [userSearchDepartment, setUserSearchDepartment] = useState('')
  const [userSearchOffice, setUserSearchOffice] = useState('')
  const [userSearchPosition, setUserSearchPosition] = useState('')
  const [userSearchUsername, setUserSearchUsername] = useState('')
  const [userSearchFullName, setUserSearchFullName] = useState('')

  // Search states cho quản lý thông tin doanh nghiệp
  const [businessSearchStatus, setBusinessSearchStatus] = useState('')
  const [businessSearchCode, setBusinessSearchCode] = useState('')
  const [businessSearchName, setBusinessSearchName] = useState('')

  // Detail View Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailModalData, setDetailModalData] = useState<any>(null)
  const [detailModalTitle, setDetailModalTitle] = useState('')

  // Danh mục ngân hàng TM
  const [banksList, setBanksList] = useState([
    { id: 1, code: 'VCB', name: 'Vietcombank', description: 'Ngân hàng TMCP Ngoại thương Việt Nam', isActive: true },
    { id: 2, code: 'VTB', name: 'Vietinbank', description: 'Ngân hàng TMCP Công thương Việt Nam', isActive: true },
    { id: 3, code: 'BIDV', name: 'BIDV', description: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', isActive: true },
    { id: 4, code: 'VPB', name: 'VPBank', description: 'Ngân hàng TMCP Việt Nam Thịnh vượng', isActive: true },
    { id: 5, code: 'TPB', name: 'TPBank', description: 'Ngân hàng TMCP Tiền Phong', isActive: false },
    { id: 6, code: 'MSB', name: 'MSB', description: 'Ngân hàng TMCP Hàng Hải Việt Nam', isActive: true },
    { id: 7, code: 'SCB', name: 'SCB', description: 'Ngân hàng TMCP Sài Gòn', isActive: true },
    { id: 8, code: 'OCB', name: 'OCB', description: 'Ngân hàng TMCP Phương Đông', isActive: false },
    { id: 9, code: 'TCB', name: 'Techcombank', description: 'Ngân hàng TMCP Kỹ thương Việt Nam', isActive: true },
    { id: 10, code: 'MBB', name: 'MBBank', description: 'Ngân hàng TMCP Quân Đội', isActive: true },
    { id: 11, code: 'ACB', name: 'ACB', description: 'Ngân hàng TMCP Á Châu', isActive: true },
    { id: 12, code: 'SHB', name: 'SHB', description: 'Ngân hàng TMCP Sài Gòn - Hà Nội', isActive: false }
  ])

  // Kho/Bãi/Cảng
  const [warehousesList, setWarehousesList] = useState([
    { id: 1, code: 'WH001', name: 'Kho Cát Lái', maHaiQuan: 'HQ001', maCK: 'CK001', diaChi: '123 Đường Nguyễn Tất Thành, Q.4, TP.HCM', ghiChu: 'Kho container chính', isActive: true },
    { id: 2, code: 'WH002', name: 'Cảng Sài Gòn', maHaiQuan: 'HQ002', maCK: 'CK002', diaChi: '456 Đường Đồng Văn Cống, Q.2, TP.HCM', ghiChu: 'Cảng container quốc tế', isActive: true },
    { id: 3, code: 'WH003', name: 'Bãi Hiệp Phước', maHaiQuan: 'HQ003', maCK: 'CK003', diaChi: '789 Đường Nguyễn Hữu Cảnh, Q.Bình Thạnh, TP.HCM', ghiChu: 'Bãi container nội địa', isActive: false },
    { id: 4, code: 'WH004', name: 'Cảng Nhà Bè', maHaiQuan: 'HQ004', maCK: 'CK004', diaChi: '15 Đường Nguyễn Bình, Q.Nhà Bè, TP.HCM', ghiChu: 'Cảng sông nội địa', isActive: true },
    { id: 5, code: 'WH005', name: 'Kho Tân Thuận', maHaiQuan: 'HQ005', maCK: 'CK005', diaChi: '88 Đường Huỳnh Tấn Phát, Q.7, TP.HCM', ghiChu: 'Kho xuất nhập khẩu', isActive: true },
    { id: 6, code: 'WH006', name: 'Bãi container Đồng Nai', maHaiQuan: 'HQ006', maCK: 'CK006', diaChi: '252 Đường Quốc lộ 1A, Biên Hòa, Đồng Nai', ghiChu: 'Bãi trung chuyển hàng hóa', isActive: true },
    { id: 7, code: 'WH007', name: 'Cảng Bà Rịa', maHaiQuan: 'HQ007', maCK: 'CK007', diaChi: '77 Đường Lê Duẩn, TP.Bà Rịa, BR-VT', ghiChu: 'Cảng biển Bà Rịa - Vũng Tàu', isActive: true },
    { id: 8, code: 'WH008', name: 'Kho An Phú', maHaiQuan: 'HQ008', maCK: 'CK008', diaChi: '333 Đường Xa lộ Hà Nội, Q.2, TP.HCM', ghiChu: 'Kho hàng nông sản', isActive: false },
    { id: 9, code: 'WH009', name: 'Bãi Tân Cảng', maHaiQuan: 'HQ009', maCK: 'CK009', diaChi: '144 Đường Nguyễn Tất Thành, Q.4, TP.HCM', ghiChu: 'Bãi container Tân Cảng', isActive: true },
    { id: 10, code: 'WH010', name: 'Cảng Long An', maHaiQuan: 'HQ010', maCK: 'CK010', diaChi: '666 Đường Hùng Vương, TP.Tân An, Long An', ghiChu: 'Cảng sông Long An', isActive: true },
    { id: 11, code: 'WH011', name: 'Kho Phú Hữu', maHaiQuan: 'HQ011', maCK: 'CK011', diaChi: '555 Đường Mai Chí Thọ, Q.2, TP.HCM', ghiChu: 'Kho logistics Phú Hữu', isActive: true },
    { id: 12, code: 'WH012', name: 'Bãi Gò Dầu', maHaiQuan: 'HQ012', maCK: 'CK012', diaChi: '999 Đường Tỉnh lộ 15, Gò Dầu, Tây Ninh', ghiChu: 'Bãi hàng hóa biên giới', isActive: false },
    { id: 13, code: 'WH013', name: 'Cảng Cần Thơ', maHaiQuan: 'HQ013', maCK: 'CK013', diaChi: '321 Đường 3/2, Q.Ninh Kiều, Cần Thơ', ghiChu: 'Cảng sông miền Tây', isActive: true },
    { id: 14, code: 'WH014', name: 'Kho Bình Dương', maHaiQuan: 'HQ014', maCK: 'CK014', diaChi: '147 Đường Mỹ Phước Tân Vạn, Bến Cát, Bình Dương', ghiChu: 'Kho công nghiệp', isActive: true },
    { id: 15, code: 'WH015', name: 'Bãi Thủ Đức', maHaiQuan: 'HQ015', maCK: 'CK015', diaChi: '258 Đường Võ Văn Ngân, TP.Thủ Đức, TP.HCM', ghiChu: 'Bãi tập kết hàng hóa', isActive: true }
  ])

  // Trạm thu phí
  const [tollStationsList, setTollStationsList] = useState([
    { id: 1, code: 'TTP001', name: 'Trạm Thu Đức', maSoThue: '0312345001', diaChi: '123 Đường Võ Văn Ngân, TP.Thủ Đức, TP.HCM', tenGiaoDich: 'Thu phí Quốc lộ 1A', isActive: true },
    { id: 2, code: 'TTP002', name: 'Trạm Bình Triệu', maSoThue: '0312345002', diaChi: '456 Đường Hanoi Highway, Q.Bình Thạnh, TP.HCM', tenGiaoDich: 'Thu phí Xa lộ Hà Nội', isActive: true },
    { id: 3, code: 'TTP003', name: 'Trạm An Sương', maSoThue: '0312345003', diaChi: '789 Đường Quốc lộ 22, Q.12, TP.HCM', tenGiaoDich: 'Thu phí Quốc lộ 22', isActive: false },
    { id: 4, code: 'TTP004', name: 'Trạm Bình Chánh', maSoThue: '0312345004', diaChi: '147 Đường Võ Văn Vân, H.Bình Chánh, TP.HCM', tenGiaoDich: 'Thu phí Vành đai 3', isActive: true },
    { id: 5, code: 'TTP005', name: 'Trạm Nhà Bè', maSoThue: '0312345005', diaChi: '258 Đường Nguyễn Bình, Q.Nhà Bè, TP.HCM', tenGiaoDich: 'Thu phí cầu Phú Mỹ', isActive: true },
    { id: 6, code: 'TTP006', name: 'Trạm Long Thành', maSoThue: '0312345006', diaChi: '369 Đường Quốc lộ 51, H.Long Thành, Đồng Nai', tenGiaoDich: 'Thu phí cao tốc Long Thành', isActive: true },
    { id: 7, code: 'TTP007', name: 'Trạm Dầu Giây', maSoThue: '0312345007', diaChi: '741 Đường Quốc lộ 1A, H.Thống Nhất, Đồng Nai', tenGiaoDich: 'Thu phí Dầu Giây', isActive: true },
    { id: 8, code: 'TTP008', name: 'Trạm Phan Thiết', maSoThue: '0312345008', diaChi: '852 Đường Quốc lộ 1A, TP.Phan Thiết, Bình Thuận', tenGiaoDich: 'Thu phí Phan Thiết', isActive: false },
    { id: 9, code: 'TTP009', name: 'Trạm Cần Thơ', maSoThue: '0312345009', diaChi: '963 Đường Quốc lộ 1A, Q.Cái Răng, Cần Thơ', tenGiaoDich: 'Thu phí cầu Cần Thơ', isActive: true },
    { id: 10, code: 'TTP010', name: 'Trạm An Giang', maSoThue: '0312345010', diaChi: '159 Đường Quốc lộ 80, TP.Long Xuyên, An Giang', tenGiaoDich: 'Thu phí Quốc lộ 80', isActive: true },
    { id: 11, code: 'TTP011', name: 'Trạm Tây Ninh', maSoThue: '0312345011', diaChi: '357 Đường Quốc lộ 22, TP.Tây Ninh, Tây Ninh', tenGiaoDich: 'Thu phí biên giới Tây Ninh', isActive: true },
    { id: 12, code: 'TTP012', name: 'Trạm Bà Rịa', maSoThue: '0312345012', diaChi: '468 Đường Quốc lộ 51, TP.Bà Rịa, BR-VT', tenGiaoDich: 'Thu phí Bà Rịa - Vũng Tàu', isActive: false },
    { id: 13, code: 'TTP013', name: 'Trạm Đồng Nai', maSoThue: '0312345013', diaChi: '579 Đường Võ Nguyên Giáp, TP.Biên Hòa, Đồng Nai', tenGiaoDich: 'Thu phí Biên Hòa', isActive: true },
    { id: 14, code: 'TTP014', name: 'Trạm Bình Dương', maSoThue: '0312345014', diaChi: '680 Đường Mỹ Phước Tân Vạn, TP.Thủ Dầu Một, Bình Dương', tenGiaoDich: 'Thu phí Bình Dương', isActive: true },
    { id: 15, code: 'TTP015', name: 'Trạm Long An', maSoThue: '0312345015', diaChi: '791 Đường Hùng Vương, TP.Tân An, Long An', tenGiaoDich: 'Thu phí Long An', isActive: true }
  ])

  // Địa điểm lưu kho
  const [storageLocationsList, setStorageLocationsList] = useState([
    { id: 1, code: 'SL001', name: 'Kho Quận 1', tenKhac: 'Kho Q1', diaChi: '123 Đường Nguyễn Huệ, Q.1, TP.HCM', dienGiai: 'Kho lưu trữ trung tâm', loai: 'Trung tâm', isActive: true },
    { id: 2, code: 'SL002', name: 'Kho Quận 7', tenKhac: 'Kho Q7', diaChi: '456 Đường Nguyễn Thị Thập, Q.7, TP.HCM', dienGiai: 'Kho lưu trữ phụ', loai: 'Phụ trợ', isActive: true },
    { id: 3, code: 'SL003', name: 'Kho Thủ Đức', tenKhac: 'Kho TD', diaChi: '789 Đường Võ Văn Ngân, TP.Thủ Đức, TP.HCM', dienGiai: 'Kho công nghiệp', loai: 'Công nghiệp', isActive: false },
    { id: 4, code: 'SL004', name: 'Kho Bình Thạnh', tenKhac: 'Kho BT', diaChi: '147 Đường Xô Viết Nghệ Tĩnh, Q.Bình Thạnh, TP.HCM', dienGiai: 'Kho lưu trữ tạm thời', loai: 'Tạm thời', isActive: true },
    { id: 5, code: 'SL005', name: 'Kho Gò Vấp', tenKhac: 'Kho GV', diaChi: '258 Đường Phan Văn Trị, Q.Gò Vấp, TP.HCM', dienGiai: 'Kho phân phối', loai: 'Phân phối', isActive: true },
    { id: 6, code: 'SL006', name: 'Kho Tân Bình', tenKhac: 'Kho TB', diaChi: '369 Đường Hoàng Văn Thụ, Q.Tân Bình, TP.HCM', dienGiai: 'Kho gần sân bay', loai: 'Sân bay', isActive: true },
    { id: 7, code: 'SL007', name: 'Kho Quận 12', tenKhac: 'Kho Q12', diaChi: '741 Đường Quốc lộ 22, Q.12, TP.HCM', dienGiai: 'Kho biên giới', loai: 'Biên giới', isActive: true },
    { id: 8, code: 'SL008', name: 'Kho Bình Chánh', tenKhac: 'Kho BC', diaChi: '852 Đường Võ Văn Vân, H.Bình Chánh, TP.HCM', dienGiai: 'Kho ngoại ô', loai: 'Ngoại ô', isActive: false },
    { id: 9, code: 'SL009', name: 'Kho Nhà Bè', tenKhac: 'Kho NB', diaChi: '963 Đường Nguyễn Bình, Q.Nhà Bè, TP.HCM', dienGiai: 'Kho cảng sông', loai: 'Cảng sông', isActive: true },
    { id: 10, code: 'SL010', name: 'Kho Cần Giờ', tenKhac: 'Kho CG', diaChi: '159 Đường Trần Hưng Đạo, H.Cần Giờ, TP.HCM', dienGiai: 'Kho ven biển', loai: 'Ven biển', isActive: true },
    { id: 11, code: 'SL011', name: 'Kho Củ Chi', tenKhac: 'Kho CC', diaChi: '357 Đường Tỉnh lộ 15, H.Củ Chi, TP.HCM', dienGiai: 'Kho nông nghiệp', loai: 'Nông nghiệp', isActive: true },
    { id: 12, code: 'SL012', name: 'Kho Hóc Môn', tenKhac: 'Kho HM', diaChi: '468 Đường Quốc lộ 22, H.Hóc Môn, TP.HCM', dienGiai: 'Kho công nghiệp', loai: 'Công nghiệp', isActive: false },
    { id: 13, code: 'SL013', name: 'Kho Quận 8', tenKhac: 'Kho Q8', diaChi: '579 Đường Phạm Thế Hiển, Q.8, TP.HCM', dienGiai: 'Kho ven sông', loai: 'Ven sông', isActive: true },
    { id: 14, code: 'SL014', name: 'Kho Quận 4', tenKhac: 'Kho Q4', diaChi: '680 Đường Nguyễn Tất Thành, Q.4, TP.HCM', dienGiai: 'Kho cảng biển', loai: 'Cảng biển', isActive: true },
    { id: 15, code: 'SL015', name: 'Kho Quận 2', tenKhac: 'Kho Q2', diaChi: '791 Đường Mai Chí Thọ, TP.Thủ Đức, TP.HCM', dienGiai: 'Kho hiện đại', loai: 'Hiện đại', isActive: true }
  ])
  
  // Search states for storage locations
  const [storageLocationSearchCode, setStorageLocationSearchCode] = useState('')
  const [storageLocationSearchName, setStorageLocationSearchName] = useState('')
  
  // Search states for transport methods
  const [transportMethodSearchCode, setTransportMethodSearchCode] = useState('')
  const [transportMethodSearchName, setTransportMethodSearchName] = useState('')
  
  // Search states for receipt templates
  const [receiptTemplateSearchDiemThu, setReceiptTemplateSearchDiemThu] = useState('')
  const [receiptTemplateSearchCode, setReceiptTemplateSearchCode] = useState('')
  const [receiptTemplateSearchKyHieu, setReceiptTemplateSearchKyHieu] = useState('')
  
  // Search states for tariffs
  const [tariffSearchBieuCuoc, setTariffSearchBieuCuoc] = useState('')
  const [tariffSearchBieuCuocThue, setTariffSearchBieuCuocThue] = useState('')
  const [tariffSearchMaBieuCuoc, setTariffSearchMaBieuCuoc] = useState('')
  const [tariffSearchTenBieuCuoc, setTariffSearchTenBieuCuoc] = useState('')
  
  // Search states for form types
  const [formTypeSearchNhom, setFormTypeSearchNhom] = useState('')
  const [formTypeSearchMa, setFormTypeSearchMa] = useState('')
  const [formTypeSearchTen, setFormTypeSearchTen] = useState('')
  
  // Search states for payment types
  const [paymentTypeSearchMa, setPaymentTypeSearchMa] = useState('')
  const [paymentTypeSearchTen, setPaymentTypeSearchTen] = useState('')
  
  // Search states for container types
  const [containerTypeSearchMa, setContainerTypeSearchMa] = useState('')
  const [containerTypeSearchTen, setContainerTypeSearchTen] = useState('')
  
  // Search states for units
  const [unitSearchDonViTinh, setUnitSearchDonViTinh] = useState('')
  const [unitSearchMa, setUnitSearchMa] = useState('')
  const [unitSearchTen, setUnitSearchTen] = useState('')

  // Doanh nghiệp  
  const [enterprisesList, setEnterprisesList] = useState([
    { id: 1, code: 'EN001', name: 'Công ty ABC', description: 'Công ty TNHH ABC - Logistics', isActive: true },
    { id: 2, code: 'EN002', name: 'Công ty XYZ', description: 'Công ty CP XYZ - Vận tải', isActive: true },
    { id: 3, code: 'EN003', name: 'Công ty DEF', description: 'Công ty TNHH DEF - Thương mại', isActive: true }
  ])

  // Phương thức vận chuyển
  const [transportMethodsList, setTransportMethodsList] = useState([
    { id: 1, code: 'TM001', name: 'Đường bộ', tenKhac: 'Road', dienGiai: 'Vận chuyển hàng hóa bằng xe tải, container trên đường bộ', naccs: 'RD01', isActive: true },
    { id: 2, code: 'TM002', name: 'Đường thủy', tenKhac: 'Sea', dienGiai: 'Vận chuyển bằng tàu biển, sà lan qua cảng biển', naccs: 'SE02', isActive: true },
    { id: 3, code: 'TM003', name: 'Đường sắt', tenKhac: 'Rail', dienGiai: 'Vận chuyển bằng tàu hỏa, container trên đường ray', naccs: 'RL03', isActive: false },
    { id: 4, code: 'TM004', name: 'Đường hàng không', tenKhac: 'Air', dienGiai: 'Vận chuyển bằng máy bay cargo qua sân bay', naccs: 'AR04', isActive: true },
    { id: 5, code: 'TM005', name: 'Kết hợp', tenKhac: 'Multi', dienGiai: 'Vận chuyển đa phương thức, kết hợp nhiều loại', naccs: 'MT05', isActive: true },
    { id: 6, code: 'TM006', name: 'Đường ống', tenKhac: 'Pipeline', dienGiai: 'Vận chuyển dầu khí qua hệ thống đường ống', naccs: 'PL06', isActive: true },
    { id: 7, code: 'TM007', name: 'Courier', tenKhac: 'Express', dienGiai: 'Chuyển phát nhanh bưu phẩm, hàng nhỏ', naccs: 'CR07', isActive: true },
    { id: 8, code: 'TM008', name: 'Bưu điện', tenKhac: 'Post', dienGiai: 'Vận chuyển qua hệ thống bưu chính quốc gia', naccs: 'PS08', isActive: false },
    { id: 9, code: 'TM009', name: 'Xe máy', tenKhac: 'Motorbike', dienGiai: 'Giao hàng bằng xe máy trong nội thành', naccs: 'MB09', isActive: true },
    { id: 10, code: 'TM010', name: 'Thủy nội địa', tenKhac: 'River', dienGiai: 'Vận chuyển trên sông, kênh rạch nội địa', naccs: 'RV10', isActive: true },
    { id: 11, code: 'TM011', name: 'Container', tenKhac: 'FCL', dienGiai: 'Vận chuyển hàng hóa bằng container đầy', naccs: 'CT11', isActive: true },
    { id: 12, code: 'TM012', name: 'Lẻ (LCL)', tenKhac: 'LCL', dienGiai: 'Vận chuyển hàng rời, ghép chung container', naccs: 'LC12', isActive: false },
    { id: 13, code: 'TM013', name: 'Rơ-moóc', tenKhac: 'Trailer', dienGiai: 'Vận chuyển bằng xe đầu kéo rơ-moóc lớn', naccs: 'TR13', isActive: true },
    { id: 14, code: 'TM014', name: 'Xe tải nhỏ', tenKhac: 'Pickup', dienGiai: 'Vận chuyển hàng nhỏ bằng xe bán tải', naccs: 'PU14', isActive: true },
    { id: 15, code: 'TM015', name: 'Xe chuyên dụng', tenKhac: 'Special', dienGiai: 'Xe chuyên dụng cho hàng đặc biệt', naccs: 'SP15', isActive: true }
  ])

  // Mẫu ký hiệu biên lai
  const [receiptTemplatesList, setReceiptTemplatesList] = useState([
    { id: 1, mauBL: 'Mẫu A1', kyHieuBL: '01B1O0-001', tuSo: '0000001', denSo: '0001000', ngayHieuLuc: '2024-01-01', diemThuPhi: 'Trạm A1 - Cầu Rạch Miễu', ghiChu: 'Biên lai thu phí cầu đường', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Admin', isActive: true },
    { id: 2, mauBL: 'Mẫu B2', kyHieuBL: '01B2O0-002', tuSo: '0001001', denSo: '0002000', ngayHieuLuc: '2024-01-15', diemThuPhi: 'Trạm B2 - Cầu Phú Mỹ', ghiChu: 'Biên lai phí hạ tầng giao thông', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Manager', isActive: true },
    { id: 3, mauBL: 'Mẫu C3', kyHieuBL: '01C3O0-003', tuSo: '0002001', denSo: '0003000', ngayHieuLuc: '2024-02-01', diemThuPhi: 'Trạm C3 - Cầu Cần Thơ', ghiChu: 'Hết hiệu lực theo quyết định 123', trangThai: 'Hết hiệu lực', phatHanh: 'Chưa phát hành', nguoiTao: 'Admin', isActive: false },
    { id: 4, mauBL: 'Mẫu D4', kyHieuBL: '01D4O0-004', tuSo: '0003001', denSo: '0004000', ngayHieuLuc: '2024-02-15', diemThuPhi: 'Trạm D4 - Cầu Mỹ Thuận', ghiChu: 'Biên lai thu phí vận tải', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Operator', isActive: true },
    { id: 5, mauBL: 'Mẫu E5', kyHieuBL: '01E5O0-005', tuSo: '0004001', denSo: '0005000', ngayHieuLuc: '2024-03-01', diemThuPhi: 'Trạm E5 - Cầu An Thái', ghiChu: 'Phí dịch vụ hạ tầng', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Admin', isActive: true },
    { id: 6, mauBL: 'Mẫu F6', kyHieuBL: '01F6O0-006', tuSo: '0005001', denSo: '0006000', ngayHieuLuc: '2024-03-15', diemThuPhi: 'Trạm F6 - Cầu Bến Tre', ghiChu: 'Chờ phê duyệt từ cục thuế', trangThai: 'Chờ phê duyệt', phatHanh: 'Chưa phát hành', nguoiTao: 'Manager', isActive: true },
    { id: 7, mauBL: 'Mẫu G7', kyHieuBL: '01G7O0-007', tuSo: '0006001', denSo: '0007000', ngayHieuLuc: '2024-04-01', diemThuPhi: 'Trạm G7 - Cầu Vàm Cống', ghiChu: 'Biên lai mới được cấp phép', trangThai: 'Chưa sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Operator', isActive: true },
    { id: 8, mauBL: 'Mẫu H8', kyHieuBL: '01H8O0-008', tuSo: '0007001', denSo: '0008000', ngayHieuLuc: '2024-04-15', diemThuPhi: 'Trạm H8 - Cầu Long Kiển', ghiChu: 'Hết hiệu lực do hết hạn sử dụng', trangThai: 'Hết hiệu lực', phatHanh: 'Chưa phát hành', nguoiTao: 'Admin', isActive: false },
    { id: 9, mauBL: 'Mẫu I9', kyHieuBL: '01I9O0-009', tuSo: '0008001', denSo: '0009000', ngayHieuLuc: '2024-05-01', diemThuPhi: 'Trạm I9 - Cầu Đồng Nai', ghiChu: 'Biên lai thu phí cao tốc', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Manager', isActive: true },
    { id: 10, mauBL: 'Mẫu J10', kyHieuBL: '01J10O0-010', tuSo: '0009001', denSo: '0010000', ngayHieuLuc: '2024-05-15', diemThuPhi: 'Trạm J10 - Cầu Sài Gòn', ghiChu: 'Phí sử dụng cơ sở hạ tầng', trangThai: 'Chưa sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Operator', isActive: true },
    { id: 11, mauBL: 'Mẫu K11', kyHieuBL: '01K11O0-011', tuSo: '0010001', denSo: '0011000', ngayHieuLuc: '2024-06-01', diemThuPhi: 'Trạm K11 - Cầu Thủ Thiêm', ghiChu: 'Chờ xét duyệt từ ban giám đốc', trangThai: 'Chờ phê duyệt', phatHanh: 'Chưa phát hành', nguoiTao: 'Admin', isActive: true },
    { id: 12, mauBL: 'Mẫu L12', kyHieuBL: '01L12O0-012', tuSo: '0011001', denSo: '0012000', ngayHieuLuc: '2024-06-15', diemThuPhi: 'Trạm L12 - Cầu Phú Long', ghiChu: 'Biên lai thu phí đặc biệt', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Manager', isActive: true },
    { id: 13, mauBL: 'Mẫu M13', kyHieuBL: '01M13O0-013', tuSo: '0012001', denSo: '0013000', ngayHieuLuc: '2024-07-01', diemThuPhi: 'Trạm M13 - Cầu Bình Lợi', ghiChu: 'Ngừng sử dụng theo chỉ đạo mới', trangThai: 'Hết hiệu lực', phatHanh: 'Chưa phát hành', nguoiTao: 'Operator', isActive: false },
    { id: 14, mauBL: 'Mẫu N14', kyHieuBL: '01N14O0-014', tuSo: '0013001', denSo: '0014000', ngayHieuLuc: '2024-07-15', diemThuPhi: 'Trạm N14 - Cầu Bình Triệu', ghiChu: 'Áp dụng mức phí mới 2024', trangThai: 'Chưa sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Admin', isActive: true },
    { id: 15, mauBL: 'Mẫu O15', kyHieuBL: '01O15O0-015', tuSo: '0014001', denSo: '0015000', ngayHieuLuc: '2024-08-01', diemThuPhi: 'Trạm O15 - Cầu Kênh Tẻ', ghiChu: 'Biên lai thí điểm giai đoạn 1', trangThai: 'Đang sử dụng', phatHanh: 'Đã phát hành', nguoiTao: 'Manager', isActive: true }
  ])

  // Loại biểu cước
  const [tariffTypesList, setTariffTypesList] = useState([
    { id: 1, code: 'TT001', name: 'Biểu cước A', description: 'Biểu cước container đầy', isActive: true },
    { id: 2, code: 'TT002', name: 'Biểu cước B', description: 'Biểu cước container rỗng', isActive: true },
    { id: 3, code: 'TT003', name: 'Biểu cước C', description: 'Biểu cước hàng lẻ', isActive: false }
  ])

  // Biểu cước
  const [tariffsList, setTariffsList] = useState([
    { id: 1, maBieuCuoc: 'BC001', tenBieuCuoc: 'Container 20ft FCL', nhomLoaiHinh: 'Container đầy', loaiCont: '20DC', tinhChatCont: 'FCL', dvt: 'Chuyến', hang: 'Tổng hợp', sort: 1, donGia: '2500000', bieuCuoc: 'Biểu cước A', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 2, maBieuCuoc: 'BC002', tenBieuCuoc: 'Container 40ft FCL', nhomLoaiHinh: 'Container đầy', loaiCont: '40DC', tinhChatCont: 'FCL', dvt: 'Chuyến', hang: 'Tổng hợp', sort: 2, donGia: '3500000', bieuCuoc: 'Biểu cước A', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 3, maBieuCuoc: 'BC003', tenBieuCuoc: 'Container 20ft LCL', nhomLoaiHinh: 'Container lẻ', loaiCont: '20DC', tinhChatCont: 'LCL', dvt: 'Tấn', hang: 'Hàng tổng hợp', sort: 3, donGia: '180000', bieuCuoc: 'Biểu cước B', bieuCuocThue: 'BC Thuế GTGT', isActive: true },
    { id: 4, maBieuCuoc: 'BC004', tenBieuCuoc: 'Container 40ft HC', nhomLoaiHinh: 'Container cao', loaiCont: '40HC', tinhChatCont: 'FCL', dvt: 'Chuyến', hang: 'Hàng đặc biệt', sort: 4, donGia: '3800000', bieuCuoc: 'Biểu cước A', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 5, maBieuCuoc: 'BC005', tenBieuCuoc: 'Rơ moóc 20ft', nhomLoaiHinh: 'Rơ moóc', loaiCont: '20TR', tinhChatCont: 'Trailer', dvt: 'Chuyến', hang: 'Vận tải đường bộ', sort: 5, donGia: '1800000', bieuCuoc: 'Biểu cước C', bieuCuocThue: 'BC Thuế GTGT', isActive: true },
    { id: 6, maBieuCuoc: 'BC006', tenBieuCuoc: 'Xe tải 8 tấn', nhomLoaiHinh: 'Xe tải', loaiCont: 'TRUCK8', tinhChatCont: 'Tải thường', dvt: 'Tấn', hang: 'Hàng tiêu dùng', sort: 6, donGia: '220000', bieuCuoc: 'Biểu cước B', bieuCuocThue: 'BC Thuế VAT', isActive: false },
    { id: 7, maBieuCuoc: 'BC007', tenBieuCuoc: 'Container 45ft', nhomLoaiHinh: 'Container lớn', loaiCont: '45DC', tinhChatCont: 'FCL', dvt: 'Chuyến', hang: 'Hàng xuất khẩu', sort: 7, donGia: '4200000', bieuCuoc: 'Biểu cước A', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 8, maBieuCuoc: 'BC008', tenBieuCuoc: 'Xe đầu kéo + Rơ moóc', nhomLoaiHinh: 'Combo vận tải', loaiCont: 'COMBO', tinhChatCont: 'Đặc biệt', dvt: 'Chuyến', hang: 'Logistics', sort: 8, donGia: '2800000', bieuCuoc: 'Biểu cước C', bieuCuocThue: 'BC Thuế GTGT', isActive: true },
    { id: 9, maBieuCuoc: 'BC009', tenBieuCuoc: 'Container lạnh 20ft', nhomLoaiHinh: 'Container lạnh', loaiCont: '20RF', tinhChatCont: 'Reefer', dvt: 'Chuyến', hang: 'Hàng lạnh', sort: 9, donGia: '3200000', bieuCuoc: 'Biểu cước D', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 10, maBieuCuoc: 'BC010', tenBieuCuoc: 'Xe tải nhỏ 3 tấn', nhomLoaiHinh: 'Xe tải nhỏ', loaiCont: 'TRUCK3', tinhChatCont: 'Tải nhẹ', dvt: 'Tấn', hang: 'Hàng nội địa', sort: 10, donGia: '180000', bieuCuoc: 'Biểu cước B', bieuCuocThue: 'BC Thuế GTGT', isActive: true },
    { id: 11, maBieuCuoc: 'BC011', tenBieuCuoc: 'Container tank 20ft', nhomLoaiHinh: 'Container tank', loaiCont: '20TK', tinhChatCont: 'Tank', dvt: 'Chuyến', hang: 'Hóa chất', sort: 11, donGia: '3800000', bieuCuoc: 'Biểu cước D', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 12, maBieuCuoc: 'BC012', tenBieuCuoc: 'Rơ moóc phẳng', nhomLoaiHinh: 'Rơ moóc đặc biệt', loaiCont: 'FLAT', tinhChatCont: 'Flatbed', dvt: 'Chuyến', hang: 'Máy móc', sort: 12, donGia: '2200000', bieuCuoc: 'Biểu cước C', bieuCuocThue: 'BC Thuế GTGT', isActive: true },
    { id: 13, maBieuCuoc: 'BC013', tenBieuCuoc: 'Xe ben 15 tấn', nhomLoaiHinh: 'Xe chuyên dụng', loaiCont: 'DUMP', tinhChatCont: 'Ben', dvt: 'Chuyến', hang: 'Vật liệu xây dựng', sort: 13, donGia: '2600000', bieuCuoc: 'Biểu cước E', bieuCuocThue: 'BC Thuế VAT', isActive: false },
    { id: 14, maBieuCuoc: 'BC014', tenBieuCuoc: 'Container 40ft Open Top', nhomLoaiHinh: 'Container mở', loaiCont: '40OT', tinhChatCont: 'Open Top', dvt: 'Chuyến', hang: 'Hàng siêu trường', sort: 14, donGia: '3600000', bieuCuoc: 'Biểu cước A', bieuCuocThue: 'BC Thuế VAT', isActive: true },
    { id: 15, maBieuCuoc: 'BC015', tenBieuCuoc: 'Xe container tự tháo', nhomLoaiHinh: 'Xe đặc biệt', loaiCont: 'SELF', tinhChatCont: 'Tự tháo', dvt: 'Chuyến', hang: 'Hàng rời', sort: 15, donGia: '3100000', bieuCuoc: 'Biểu cước E', bieuCuocThue: 'BC Thuế GTGT', isActive: true }
  ])

  // Loại hình
  const [formTypesList, setFormTypesList] = useState([
    { id: 1, nhomLoaiHinh: 'Xuất nhập khẩu', maLoaiHinh: 'LH001', tenLoaiHinh: 'Xuất khẩu container đầy', dienGiai: 'Container đầy xuất khẩu qua cảng', isActive: true },
    { id: 2, nhomLoaiHinh: 'Xuất nhập khẩu', maLoaiHinh: 'LH002', tenLoaiHinh: 'Nhập khẩu container đầy', dienGiai: 'Container đầy nhập khẩu từ cảng', isActive: true },
    { id: 3, nhomLoaiHinh: 'Xuất nhập khẩu', maLoaiHinh: 'LH003', tenLoaiHinh: 'Container rỗng xuất', dienGiai: 'Container rỗng xuất đi nước ngoài', isActive: true },
    { id: 4, nhomLoaiHinh: 'Nội địa', maLoaiHinh: 'LH004', tenLoaiHinh: 'Vận chuyển nội địa', dienGiai: 'Vận chuyển hàng hóa trong nước', isActive: true },
    { id: 5, nhomLoaiHinh: 'Quá cảnh', maLoaiHinh: 'LH005', tenLoaiHinh: 'Quá cảnh container', dienGiai: 'Container quá cảnh qua Việt Nam', isActive: false },
    { id: 6, nhomLoaiHinh: 'Đặc biệt', maLoaiHinh: 'LH006', tenLoaiHinh: 'Hàng nguy hiểm', dienGiai: 'Vận chuyển hàng nguy hiểm theo quy định', isActive: true },
    { id: 7, nhomLoaiHinh: 'Đặc biệt', maLoaiHinh: 'LH007', tenLoaiHinh: 'Hàng siêu trường siêu trọng', dienGiai: 'Hàng có kích thước hoặc trọng lượng vượt chuẩn', isActive: true },
    { id: 8, nhomLoaiHinh: 'Nội địa', maLoaiHinh: 'LH008', tenLoaiHinh: 'Liên vận quốc tế', dienGiai: 'Vận chuyển liên vận với các nước láng giềng', isActive: true },
    { id: 9, nhomLoaiHinh: 'Xuất nhập khẩu', maLoaiHinh: 'LH009', tenLoaiHinh: 'Container lạnh', dienGiai: 'Container lạnh cho hàng đông lạnh', isActive: true },
    { id: 10, nhomLoaiHinh: 'Đặc biệt', maLoaiHinh: 'LH010', tenLoaiHinh: 'Container tank', dienGiai: 'Container chuyên dụng chở chất lỏng', isActive: true },
    { id: 11, nhomLoaiHinh: 'Nội địa', maLoaiHinh: 'LH011', tenLoaiHinh: 'Xe tải thường', dienGiai: 'Vận chuyển bằng xe tải thông thường', isActive: true },
    { id: 12, nhomLoaiHinh: 'Quá cảnh', maLoaiHinh: 'LH012', tenLoaiHinh: 'Quá cảnh hàng lẻ', dienGiai: 'Hàng lẻ quá cảnh không thay đổi phương tiện', isActive: false },
    { id: 13, nhomLoaiHinh: 'Đặc biệt', maLoaiHinh: 'LH013', tenLoaiHinh: 'Hàng dự án', dienGiai: 'Hàng hóa phục vụ các dự án đầu tư', isActive: true },
    { id: 14, nhomLoaiHinh: 'Xuất nhập khẩu', maLoaiHinh: 'LH014', tenLoaiHinh: 'Container Open Top', dienGiai: 'Container mở nóc cho hàng siêu cao', isActive: true },
    { id: 15, nhomLoaiHinh: 'Nội địa', maLoaiHinh: 'LH015', tenLoaiHinh: 'Rơ moóc chuyên dụng', dienGiai: 'Rơ moóc chuyên chở container và hàng nặng', isActive: true }
  ])

  // Loại thanh toán
  const [paymentTypesList, setPaymentTypesList] = useState([
    { id: 1, maLoaiThanhToan: 'LTT001', tenLoaiThanhToan: 'Tiền mặt tại quầy', dienGiai: 'Thanh toán bằng tiền mặt trực tiếp tại quầy thu phí', isActive: true },
    { id: 2, maLoaiThanhToan: 'LTT002', tenLoaiThanhToan: 'Chuyển khoản ngân hàng', dienGiai: 'Chuyển khoản qua hệ thống ngân hàng điện tử', isActive: true },
    { id: 3, maLoaiThanhToan: 'LTT003', tenLoaiThanhToan: 'Thẻ tín dụng/ghi nợ', dienGiai: 'Thanh toán qua thẻ tín dụng hoặc thẻ ghi nợ', isActive: true },
    { id: 4, maLoaiThanhToan: 'LTT004', tenLoaiThanhToan: 'Ví điện tử', dienGiai: 'Thanh toán qua các ví điện tử như MoMo, ZaloPay', isActive: true },
    { id: 5, maLoaiThanhToan: 'LTT005', tenLoaiThanhToan: 'QR Code', dienGiai: 'Thanh toán bằng cách quét mã QR', isActive: true },
    { id: 6, maLoaiThanhToan: 'LTT006', tenLoaiThanhToan: 'Séc ngân hàng', dienGiai: 'Thanh toán bằng séc của các ngân hàng', isActive: false },
    { id: 7, maLoaiThanhToan: 'LTT007', tenLoaiThanhToan: 'Trả góp', dienGiai: 'Thanh toán theo hình thức trả góp', isActive: true },
    { id: 8, maLoaiThanhToan: 'LTT008', tenLoaiThanhToan: 'Bù trừ công nợ', dienGiai: 'Bù trừ với các khoản công nợ hiện có', isActive: true },
    { id: 9, maLoaiThanhToan: 'LTT009', tenLoaiThanhToan: 'Ủy nhiệm chi', dienGiai: 'Thanh toán thông qua ủy nhiệm chi ngân hàng', isActive: true },
    { id: 10, maLoaiThanhToan: 'LTT010', tenLoaiThanhToan: 'Thanh toán online', dienGiai: 'Thanh toán trực tuyến qua website', isActive: true },
    { id: 11, maLoaiThanhToan: 'LTT011', tenLoaiThanhToan: 'Phiếu thu tạm ứng', dienGiai: 'Thanh toán bằng phiếu thu tạm ứng', isActive: false },
    { id: 12, maLoaiThanhToan: 'LTT012', tenLoaiThanhToan: 'Bảo lãnh ngân hàng', dienGiai: 'Thanh toán thông qua bảo lãnh ngân hàng', isActive: true },
    { id: 13, maLoaiThanhToan: 'LTT013', tenLoaiThanhToan: 'Trái phiếu', dienGiai: 'Thanh toán bằng trái phiếu doanh nghiệp', isActive: false },
    { id: 14, maLoaiThanhToan: 'LTT014', tenLoaiThanhToan: 'Cryptocurrency', dienGiai: 'Thanh toán bằng tiền điện tử (thí điểm)', isActive: false },
    { id: 15, maLoaiThanhToan: 'LTT015', tenLoaiThanhToan: 'Thanh toán quốc tế', dienGiai: 'Thanh toán bằng ngoại tệ cho các giao dịch quốc tế', isActive: true }
  ])

  // Loại container
  const [containerTypesList, setContainerTypesList] = useState([
    { id: 1, maLoaiContainer: 'CNT001', tenLoaiContainer: '20ft Dry Container', dienGiai: 'Container khô 20 feet tiêu chuẩn cho hàng khô', isActive: true },
    { id: 2, maLoaiContainer: 'CNT002', tenLoaiContainer: '40ft Dry Container', dienGiai: 'Container khô 40 feet tiêu chuẩn cho hàng khô', isActive: true },
    { id: 3, maLoaiContainer: 'CNT003', tenLoaiContainer: '20ft Reefer Container', dienGiai: 'Container lạnh 20 feet cho hàng đông lạnh', isActive: true },
    { id: 4, maLoaiContainer: 'CNT004', tenLoaiContainer: '40ft Reefer Container', dienGiai: 'Container lạnh 40 feet cho hàng đông lạnh', isActive: true },
    { id: 5, maLoaiContainer: 'CNT005', tenLoaiContainer: '40ft High Cube', dienGiai: 'Container cao 40 feet cho hàng có chiều cao lớn', isActive: true },
    { id: 6, maLoaiContainer: 'CNT006', tenLoaiContainer: '20ft Open Top', dienGiai: 'Container mở nóc 20 feet cho hàng siêu cao', isActive: true },
    { id: 7, maLoaiContainer: 'CNT007', tenLoaiContainer: '40ft Open Top', dienGiai: 'Container mở nóc 40 feet cho hàng siêu cao', isActive: true },
    { id: 8, maLoaiContainer: 'CNT008', tenLoaiContainer: '20ft Flat Rack', dienGiai: 'Container sàn phẳng 20 feet cho hàng siêu trường', isActive: false },
    { id: 9, maLoaiContainer: 'CNT009', tenLoaiContainer: '40ft Flat Rack', dienGiai: 'Container sàn phẳng 40 feet cho hàng siêu trường', isActive: true },
    { id: 10, maLoaiContainer: 'CNT010', tenLoaiContainer: '20ft Tank Container', dienGiai: 'Container bồn 20 feet cho chất lỏng', isActive: true },
    { id: 11, maLoaiContainer: 'CNT011', tenLoaiContainer: '40ft Tank Container', dienGiai: 'Container bồn 40 feet cho chất lỏng', isActive: true },
    { id: 12, maLoaiContainer: 'CNT012', tenLoaiContainer: '45ft High Cube', dienGiai: 'Container cao 45 feet cho hàng có thể tích lớn', isActive: true },
    { id: 13, maLoaiContainer: 'CNT013', tenLoaiContainer: '20ft Bulk Container', dienGiai: 'Container rời 20 feet cho hàng rời', isActive: false },
    { id: 14, maLoaiContainer: 'CNT014', tenLoaiContainer: '40ft Ventilated', dienGiai: 'Container thông gió 40 feet cho hàng cần thoáng khí', isActive: true },
    { id: 15, maLoaiContainer: 'CNT015', tenLoaiContainer: '20ft Insulated', dienGiai: 'Container cách nhiệt 20 feet cho hàng nhạy cảm nhiệt độ', isActive: true }
  ])

  // Đơn vị tính
  const [unitsList, setUnitsList] = useState([
    { id: 1, maDonViTinh: 'DVT001', tenDonViTinh: 'Tấn', loaiDonViTinh: 'Khối lượng', dienGiai: 'Đơn vị tính theo khối lượng tấn (1000kg)', isActive: true },
    { id: 2, maDonViTinh: 'DVT002', tenDonViTinh: 'Kilogram (Kg)', loaiDonViTinh: 'Khối lượng', dienGiai: 'Đơn vị tính theo khối lượng kilogram', isActive: true },
    { id: 3, maDonViTinh: 'DVT003', tenDonViTinh: 'Mét khối (m³)', loaiDonViTinh: 'Thể tích', dienGiai: 'Đơn vị tính theo thể tích mét khối', isActive: true },
    { id: 4, maDonViTinh: 'DVT004', tenDonViTinh: 'Lít', loaiDonViTinh: 'Thể tích', dienGiai: 'Đơn vị tính theo thể tích lít', isActive: true },
    { id: 5, maDonViTinh: 'DVT005', tenDonViTinh: 'Chuyến', loaiDonViTinh: 'Số lượng', dienGiai: 'Đơn vị tính theo số chuyến vận chuyển', isActive: true },
    { id: 6, maDonViTinh: 'DVT006', tenDonViTinh: 'Container', loaiDonViTinh: 'Hàng container', dienGiai: 'Đơn vị tính theo số container', isActive: true },
    { id: 7, maDonViTinh: 'DVT007', tenDonViTinh: 'Xe', loaiDonViTinh: 'Số lượng', dienGiai: 'Đơn vị tính theo số lượng xe', isActive: false },
    { id: 8, maDonViTinh: 'DVT008', tenDonViTinh: 'Mét', loaiDonViTinh: 'Chiều dài', dienGiai: 'Đơn vị tính theo chiều dài mét', isActive: true },
    { id: 9, maDonViTinh: 'DVT009', tenDonViTinh: 'Kilomét', loaiDonViTinh: 'Chiều dài', dienGiai: 'Đơn vị tính theo khoảng cách kilomét', isActive: true },
    { id: 10, maDonViTinh: 'DVT010', tenDonViTinh: 'Giờ', loaiDonViTinh: 'Thời gian', dienGiai: 'Đơn vị tính theo thời gian giờ', isActive: true },
    { id: 11, maDonViTinh: 'DVT011', tenDonViTinh: 'Ngày', loaiDonViTinh: 'Thời gian', dienGiai: 'Đơn vị tính theo thời gian ngày', isActive: true },
    { id: 12, maDonViTinh: 'DVT012', tenDonViTinh: 'Lần', loaiDonViTinh: 'Số lượng', dienGiai: 'Đơn vị tính theo số lần thực hiện', isActive: true },
    { id: 13, maDonViTinh: 'DVT013', tenDonViTinh: 'Mét vuông (m²)', loaiDonViTinh: 'Diện tích', dienGiai: 'Đơn vị tính theo diện tích mét vuông', isActive: false },
    { id: 14, maDonViTinh: 'DVT014', tenDonViTinh: 'Hecta', loaiDonViTinh: 'Diện tích', dienGiai: 'Đơn vị tính theo diện tích hecta', isActive: true },
    { id: 15, maDonViTinh: 'DVT015', tenDonViTinh: 'Tỷ lệ phần trăm (%)', loaiDonViTinh: 'Tỷ lệ', dienGiai: 'Đơn vị tính theo tỷ lệ phần trăm', isActive: true }
  ])

  // Modal states cho tất cả danh mục
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false)
  const [showAddTollStationModal, setShowAddTollStationModal] = useState(false)
  const [showAddStorageLocationModal, setShowAddStorageLocationModal] = useState(false)
  const [showAddEnterpriseModal, setShowAddEnterpriseModal] = useState(false)
  const [showAddTransportMethodModal, setShowAddTransportMethodModal] = useState(false)
  const [showAddReceiptTemplateModal, setShowAddReceiptTemplateModal] = useState(false)
  const [showAddTariffTypeModal, setShowAddTariffTypeModal] = useState(false)
  const [showAddTariffModal, setShowAddTariffModal] = useState(false)
  const [showAddFormTypeModal, setShowAddFormTypeModal] = useState(false)
  const [showAddPaymentTypeModal, setShowAddPaymentTypeModal] = useState(false)
  const [showAddContainerTypeModal, setShowAddContainerTypeModal] = useState(false)
  const [showAddUnitModal, setShowAddUnitModal] = useState(false)

  // Form data states cho tất cả danh mục (copy structure từ customsFormData)
  const [bankFormData, setBankFormData] = useState({
    code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
  })
  const [warehouseFormData, setWarehouseFormData] = useState({
    code: '', name: '', maHaiQuan: '', maCK: '', diaChi: '', ghiChu: '', status: 'Hoạt động'
  })
  const [tollStationFormData, setTollStationFormData] = useState({
    code: '', name: '', tenTram: '', maSoThue: '', soDienThoai: '', soTax: '', email: '', diaChi: '', cap: '', tuNgay: '', ngayKetThuc: '', trangThai: 'Hoạt động'
  })
  const [storageLocationFormData, setStorageLocationFormData] = useState({
    code: '', name: '', tenKhac: '', diaChi: '', tenKho: '', maHQ: '', dienGiai: '', hienThi: 'Hoạt động', diaHau: '', ghiChu: ''
  })
  const [enterpriseFormData, setEnterpriseFormData] = useState({
    code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
  })
  const [transportMethodFormData, setTransportMethodFormData] = useState({
    code: '', name: '', tenKhac: '', soTK: '', maPH: '', maHQ: '', namDK: '', vnaccs: 'Có', trangThai: 'Hoạt động'
  })
  const [receiptTemplateFormData, setReceiptTemplateFormData] = useState({
    mauBL: '', kyHieuBL: '', tuSo: '', denSo: '', ngayHieuLuc: '', diemThuPhi: '', ghiChu: '', trangThai: 'Chưa sử dụng', phatHanh: 'Chưa phát hành'
  })
  const [tariffTypeFormData, setTariffTypeFormData] = useState({
    code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
  })
  const [tariffFormData, setTariffFormData] = useState({
    maBieuCuoc: '', tenBieuCuoc: '', dvtBieuCuoc: '', nhomLoaiHinh: '', loaiHang: '', donGia: '', stt: '', dienGiai: '', trangThai: 'Hoạt động'
  })
  const [formTypeFormData, setFormTypeFormData] = useState({
    nhomLoaiHinh: '', maLoaiHinh: '', tenLoaiHinh: '', dienGiai: '', trangThai: 'Hoạt động'
  })
  const [paymentTypeFormData, setPaymentTypeFormData] = useState({
    maLoaiThanhToan: '', tenLoaiThanhToan: '', dienGiai: '', trangThai: 'Hoạt động'
  })
  const [containerTypeFormData, setContainerTypeFormData] = useState({
    maLoaiContainer: '', tenLoaiContainer: '', dienGiai: '', trangThai: 'Hoạt động'
  })
  const [unitFormData, setUnitFormData] = useState({
    maDonViTinh: '', tenDonViTinh: '', loaiDonViTinh: '', dienGiai: '', trangThai: 'Hoạt động'
  })

  const [groupFormData, setGroupFormData] = useState({
    department: '',
    groupCode: '',
    groupName: '',
    note: '',
    status: 'Hoạt động'
  })
  const [groups, setGroups] = useState([
    {
      id: 1,
      department: 'Phòng Quản lý IT',
      groupCode: 'IT001',
      groupName: 'Nhóm Quản trị Hệ thống',
      note: '',
      status: 'Hoạt động',
      isActive: true
    },
    {
      id: 2,
      department: 'Phòng Kế toán',
      groupCode: 'KT002',
      groupName: 'Nhóm Thu Phí Cảng',
      note: '',
      status: 'Hoạt động',
      isActive: true
    }
  ])
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'test123',
      fullName: 'Đội trưởng',
      department: '03CC - Chi cục HQCK cảng KV2',
      functionGroup: 'Nhóm quản lý',
      position: 'Phó phòng',
      isActive: true
    },
    {
      id: 2,
      username: 'admin001',
      fullName: 'Trần Văn Nam',
      department: '01CV - Cảng vụ TPHCM',
      functionGroup: 'Nhóm kỹ thuật',
      position: 'Trưởng phòng',
      isActive: true
    },
    {
      id: 3,
      username: 'user456',
      fullName: 'Nguyễn Thị Lan',
      department: '02CC - Chi cục HQCK cảng KV1',
      functionGroup: 'Nhóm tài chính',
      position: 'Kế toán trưởng',
      isActive: false
    },
    {
      id: 4,
      username: 'manager789',
      fullName: 'Lê Hoàng Minh',
      department: '04CC - Chi cục HQCK cảng KV3',
      functionGroup: 'Nhóm vận hành',
      position: 'Chuyên viên',
      isActive: true
    },
    {
      id: 5,
      username: 'support2024',
      fullName: 'Phạm Thị Hương',
      department: '05CC - Chi cục HQCK cảng KV4',
      functionGroup: 'Nhóm hỗ trợ',
      position: 'Nhân viên',
      isActive: true
    },
    {
      id: 6,
      username: 'tech888',
      fullName: 'Vũ Đức Long',
      department: '06CC - Chi cục HQCK cảng KV5',
      functionGroup: 'Nhóm IT',
      position: 'Chuyên viên IT',
      isActive: false
    },
    {
      id: 7,
      username: 'analyst456',
      fullName: 'Ngô Thị Lan',
      department: '07PT - Phòng Phân tích',
      functionGroup: 'Nhóm nghiệp vụ',
      position: 'Chuyên viên',
      isActive: true
    },
    {
      id: 8,
      username: 'quality123',
      fullName: 'Đặng Văn Minh',
      department: '08CL - Phòng Chất lượng',
      functionGroup: 'Nhóm quản lý',
      position: 'Trưởng phòng',
      isActive: true
    },
    {
      id: 9,
      username: 'support789',
      fullName: 'Bùi Thị Linh',
      department: '09HT - Phòng Hỗ trợ',
      functionGroup: 'Nhóm kỹ thuật',
      position: 'Nhân viên',
      isActive: false
    },
    {
      id: 10,
      username: 'security001',
      fullName: 'Trương Văn An',
      department: '10AT - Phòng An toàn',
      functionGroup: 'Nhóm bảo vệ',
      position: 'Trưởng ca',
      isActive: true
    },
    {
      id: 11,
      username: 'legal456',
      fullName: 'Phan Thị Luật',
      department: '11PL - Phòng Pháp lý',
      functionGroup: 'Nhóm pháp chế',
      position: 'Chuyên viên',
      isActive: false
    },
    {
      id: 12,
      username: 'archive789',
      fullName: 'Lý Văn Tài',
      department: '12LT - Phòng Lưu trữ',
      functionGroup: 'Nhóm tài liệu',
      position: 'Thủ kho',
      isActive: true
    }
  ])
  
  // Danh sách doanh nghiệp
  const [businessList, setBusinessList] = useState([
    {
      id: 1,
      code: 'DN001',
      name: 'Công ty TNHH XNK Sài Gòn',
      username: 'saigonimport',
      fullName: 'Trần Văn An',
      position: 'Giám đốc',
      department: 'Phòng Xuất nhập khẩu',
      status: 'Đã cấp quyền',
      isActive: true
    },
    {
      id: 2,
      code: 'DN002', 
      name: 'Tập đoàn Logistics Việt Nam',
      username: 'vnlogistics',
      fullName: 'Nguyễn Thị Bình',
      position: 'Trưởng phòng',
      department: 'Phòng Vận tải',
      status: 'Chờ quyết',
      isActive: true
    },
    {
      id: 3,
      code: 'DN003',
      name: 'Công ty CP Cảng Cát Lái',
      username: 'catlaiport',
      fullName: 'Lê Văn Cường',
      position: 'Chủ tịch HĐQT',
      department: 'Ban Điều hành',
      status: 'Đã cấp quyền',
      isActive: false
    },
    {
      id: 4,
      code: 'DN004',
      name: 'Công ty TNHH Kho vận ABC',
      username: 'abcstorage',
      fullName: 'Phạm Thị Dung',
      position: 'Giám đốc',
      department: 'Phòng Kinh doanh',
      status: 'Đã cấp quyền',
      isActive: true
    },
    {
      id: 5,
      code: 'DN005',
      name: 'Công ty CP Vận tải Biển Đông',
      username: 'eastseatrans',
      fullName: 'Võ Văn Em',
      position: 'Phó Giám đốc',
      department: 'Phòng Vận hành',
      status: 'Chờ quyết',
      isActive: true
    },
    {
      id: 6,
      code: 'DN006',
      name: 'Công ty TNHH Hàng hóa Quốc tế',
      username: 'intlcargo',
      fullName: 'Đặng Thị Phương',
      position: 'Chuyên viên',
      department: 'Phòng Xuất nhập khẩu',
      status: 'Đã cấp quyền',
      isActive: false
    },
    {
      id: 7,
      code: 'DN007',
      name: 'Tổng Công ty Cảng Sài Gòn',
      username: 'saigonport',
      fullName: 'Hoàng Văn Giang',
      position: 'Trưởng phòng',
      department: 'Phòng Kế hoạch',
      status: 'Đã cấp quyền',
      isActive: true
    },
    {
      id: 8,
      code: 'DN008',
      name: 'Công ty CP Đầu tư Phát triển',
      username: 'devgroup',
      fullName: 'Trịnh Thị Hảo',
      position: 'Giám đốc',
      department: 'Phòng Đầu tư',
      status: 'Chờ quyết',
      isActive: true
    },
    {
      id: 9,
      code: 'DN009',
      name: 'Công ty TNHH Dịch vụ Hải quan',
      username: 'customsservice',
      fullName: 'Bùi Văn Ích',
      position: 'Chuyên viên',
      department: 'Phòng Nghiệp vụ',
      status: 'Đã cấp quyền',
      isActive: false
    },
    {
      id: 10,
      code: 'DN010',
      name: 'Công ty CP Logistics Miền Nam',
      username: 'southlogistics',
      fullName: 'Ngô Thị Kim',
      position: 'Phó Giám đốc',
      department: 'Phòng Vận hành',
      status: 'Chờ quyết',
      isActive: true
    },
    {
      id: 11,
      code: 'DN011',
      name: 'Công ty TNHH Xuất khẩu Thuỷ sản',
      username: 'seafoodexport',
      fullName: 'Lý Văn Long',
      position: 'Giám đốc',
      department: 'Phòng Sản xuất',
      status: 'Đã cấp quyền',
      isActive: true
    },
    {
      id: 12,
      code: 'DN012',
      name: 'Tập đoàn Dệt may Việt Nam',
      username: 'textilegroup',
      fullName: 'Mai Thị Minh',
      position: 'Trưởng phòng',
      department: 'Phòng Xuất khẩu',
      status: 'Đã cấp quyền',
      isActive: true
    }
  ])

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthDate: '',
    department: '',
    office: '',
    teamManager: '',
    tollStation: '',
    position: '',
    email: '',
    phone: '',
    address: ''
  })
  
  // Universal detail view function
  const showDetailView = (title: string, data: any) => {
    setDetailModalTitle(title)
    setDetailModalData(data)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setDetailModalData(null)
    setDetailModalTitle('')
  }

  const handleViewDetail = (userId: string, userName: string) => {
    const user = users.find(u => u.username === userId && u.fullName === userName)
    if (user) {
      showDetailView('Chi tiết tài khoản người dùng', user)
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userId}" - "${userName}"?`)
    if (confirmed) {
      // Xóa user khỏi danh sách
      setUsers(prev => prev.filter(user => user.username !== userId))
      alert(`Đã xóa tài khoản: ${userId} - ${userName}`)
    }
  }

  const handleAddNewUser = () => {
    setShowAddUserModal(true)
  }

  const handleCloseModal = () => {
    setShowAddUserModal(false)
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      birthDate: '',
      department: '',
      office: '',
      teamManager: '',
      tollStation: '',
      position: '',
      email: '',
      phone: '',
      address: ''
    })
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

    const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    
    // Tạo user mới
    const newUser = {
      id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
      username: formData.username,
      fullName: formData.fullName,
      department: formData.department,
      functionGroup: 'Nhóm mới', // Default group
      position: formData.position,
      isActive: true // Mặc định active
    }
    
    // Thêm user mới vào đầu danh sách
    setUsers(prev => [newUser, ...prev])
    
    // Reset về trang 1 để hiển thị user mới
    setCurrentPage(1)
    
    console.log('Form data:', formData)
    alert('Tạo tài khoản thành công!')
    handleCloseModal()
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleAddNewGroup = () => {
    setShowAddGroupModal(true)
  }

  const handleCloseGroupModal = () => {
    setShowAddGroupModal(false)
    setGroupFormData({
      department: '',
      groupCode: '',
      groupName: '',
      note: '',
      status: 'Hoạt động'
    })
  }

  const handleGroupFormChange = (field: string, value: string) => {
    setGroupFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitGroupForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Tạo group mới
    const newGroup = {
      id: groups.length + 1,
      department: groupFormData.department,
      groupCode: groupFormData.groupCode,
      groupName: groupFormData.groupName,
      note: groupFormData.note,
      status: groupFormData.status,
      isActive: groupFormData.status === 'Hoạt động'
    }

    // Thêm group mới vào danh sách
    setGroups(prev => [...prev, newGroup])

    console.log('Group form data:', groupFormData)
    alert('Cập nhật nhóm chức năng thành công!')
    handleCloseGroupModal()
  }

  const handleDeleteGroup = (groupId: number, groupName: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${groupName}"?`)
    if (confirmed) {
      // Xóa group khỏi danh sách
      setGroups(prev => prev.filter(group => group.id !== groupId))
      alert(`Đã xóa nhóm: ${groupName}`)
    }
  }

  const handleCustomsFormChange = (field: string, value: string) => {
    setCustomsFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Search handler cho danh mục hải quan
  const handleCustomsSearch = () => {
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1)
  }



  // Filtered list cho danh mục hải quan
  const filteredCustomsList = customsList.filter(customs => {
    const codeMatch = customsSearchCode === '' || 
      customs.code.toLowerCase().includes(customsSearchCode.toLowerCase())
    const nameMatch = customsSearchName === '' || 
      customs.name.toLowerCase().includes(customsSearchName.toLowerCase())
    return codeMatch && nameMatch
  })

  // Search handler cho danh mục ngân hàng TM
  const handleBanksSearch = () => {
    setCurrentPage(1)
  }

  // Filtered list cho danh mục ngân hàng TM
  const filteredBanksList = banksList.filter(bank => {
    const codeMatch = banksSearchCode === '' || 
      bank.code.toLowerCase().includes(banksSearchCode.toLowerCase())
    const nameMatch = banksSearchName === '' || 
      bank.name.toLowerCase().includes(banksSearchName.toLowerCase())
    return codeMatch && nameMatch
  })

  // Search handler cho quản lý người dùng
  const handleUsersSearch = () => {
    setCurrentPage(1)
  }

  // Filtered list cho quản lý người dùng
  const filteredUsersList = users.filter(user => {
    const departmentMatch = userSearchDepartment === '' || 
      user.department.toLowerCase().includes(userSearchDepartment.toLowerCase())
    const officeMatch = userSearchOffice === '' || 
      user.department.toLowerCase().includes(userSearchOffice.toLowerCase())
    const positionMatch = userSearchPosition === '' || 
      user.position.toLowerCase().includes(userSearchPosition.toLowerCase())
    const usernameMatch = userSearchUsername === '' || 
      user.username.toLowerCase().includes(userSearchUsername.toLowerCase())
    const fullNameMatch = userSearchFullName === '' || 
      user.fullName.toLowerCase().includes(userSearchFullName.toLowerCase())
    return departmentMatch && officeMatch && positionMatch && usernameMatch && fullNameMatch
  })

  // Search handler cho quản lý thông tin doanh nghiệp
  const handleBusinessSearch = () => {
    setCurrentPage(1)
  }

  // Filtered list cho quản lý thông tin doanh nghiệp
  const filteredBusinessList = businessList.filter(business => {
    const statusMatch = businessSearchStatus === '' || business.status === businessSearchStatus
    const codeMatch = businessSearchCode === '' || 
      business.code.toLowerCase().includes(businessSearchCode.toLowerCase())
    const nameMatch = businessSearchName === '' || 
      business.name.toLowerCase().includes(businessSearchName.toLowerCase())
    return statusMatch && codeMatch && nameMatch
  })

  const handleSubmitCustomsForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Tạo customs mới
    const newCustoms = {
      id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
      code: customsFormData.code,
      name: customsFormData.name,
      description: `${customsFormData.name} - ${customsFormData.address}`,
      isActive: customsFormData.status === 'Hoạt động'
    }
    
    // Thêm vào đầu danh sách
    setCustomsList(prev => [newCustoms, ...prev])
    
    // Reset về trang 1 để hiển thị item mới
    setCurrentPage(1)
    
    alert('Đã thêm hải quan mới thành công!')
    
    // Reset form
    setCustomsFormData({
      code: '',
      name: '',
      level: '',
      address: '',
      phone: '',
      fax: '',
      note: '',
      status: 'Hoạt động'
    })
    
    // Đóng modal
    setShowAddCustomsModal(false)
  }

  const handleCloseCustomsModal = () => {
    setShowAddCustomsModal(false)
    // Reset form khi đóng
    setCustomsFormData({
      code: '',
      name: '',
      level: '',
      address: '',
      phone: '',
      fax: '',
      note: '',
      status: 'Hoạt động'
    })
  }

  const handleDeleteCustoms = (customsId: number, customsName: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${customsName}"?`)
    if (confirmed) {
      setCustomsList(prev => {
        const newList = prev.filter(customs => customs.id !== customsId)
        
        // Điều chỉnh trang nếu trang hiện tại không còn items
        const newTotalPages = Math.ceil(newList.length / itemsPerPage)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
        
        return newList
      })
      alert(`Đã xóa: ${customsName}`)
    }
  }

  const handleViewCustomsDetail = (customsName: string) => {
    const customs = customsList.find(c => c.name === customsName)
    if (customs) {
      showDetailView('Chi tiết danh mục hải quan', customs)
    }
  }

  // Helper function để tạo handlers cho từng danh mục
  const createHandlers = (listSetter: any, modalSetter: any, formSetter: any, formState: any, title: string) => {
    const handleFormChange = (field: string, value: string) => {
      formSetter((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: formState.code,
        name: formState.name,
        description: `${formState.name} - ${formState.address}`,
        isActive: formState.status === 'Hoạt động'
      }
      
      listSetter((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1)
      alert(`Đã thêm ${title.toLowerCase().replace('danh mục ', '')} mới thành công!`)
      
      formSetter({
        code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
      })
      modalSetter(false)
    }

    const handleClose = () => {
      modalSetter(false)
      formSetter({
        code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
      })
    }

    const handleDelete = (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        listSetter((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    }

    const handleViewDetail = (itemName: string, list: any[]) => {
      const item = list.find(i => i.name === itemName || i.tenLoaiHinh === itemName || i.tenLoaiThanhToan === itemName || i.tenLoaiContainer === itemName || i.tenDonViTinh === itemName)
      if (item) {
        showDetailView(`Chi tiết ${title.toLowerCase()}`, item)
      }
    }

    return { handleFormChange, handleSubmit, handleClose, handleDelete, handleViewDetail }
  }

  // Custom handlers cho banks với add new item ở đầu danh sách
  const bankHandlers = {
    handleFormChange: (field: string, value: string) => {
      setBankFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: bankFormData.code,
        name: bankFormData.name,
        description: `${bankFormData.name} - ${bankFormData.address}`,
        isActive: bankFormData.status === 'Hoạt động'
      }
      
      setBanksList((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1) // Reset về trang 1 để hiển thị item mới
      
      alert('Đã thêm ngân hàng mới thành công!')
      
      // Reset form
      setBankFormData({
        code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
      })
      
      setShowAddBankModal(false)
    },
    handleClose: () => {
      setShowAddBankModal(false)
      setBankFormData({
        code: '', name: '', level: '', address: '', phone: '', fax: '', note: '', status: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setBanksList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          
          // Điều chỉnh trang nếu trang hiện tại không còn items
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = banksList.find(i => i.name === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục ngân hàng TM', item)
      }
    }
  }
  
  // Custom handlers cho warehouses với structure khác
  const warehouseHandlers = {
    handleFormChange: (field: string, value: string) => {
      setWarehouseFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: warehouseFormData.code,
        name: warehouseFormData.name,
        maHaiQuan: warehouseFormData.maHaiQuan,
        maCK: warehouseFormData.maCK,
        diaChi: warehouseFormData.diaChi,
        ghiChu: warehouseFormData.ghiChu,
        isActive: warehouseFormData.status === 'Hoạt động'
      }
      
      setWarehousesList((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1)
      alert(`Đã thêm kho/bãi/cảng mới thành công!`)
      
      setWarehouseFormData({
        code: '', name: '', maHaiQuan: '', maCK: '', diaChi: '', ghiChu: '', status: 'Hoạt động'
      })
      setShowAddWarehouseModal(false)
    },
    handleClose: () => {
      setShowAddWarehouseModal(false)
      setWarehouseFormData({
        code: '', name: '', maHaiQuan: '', maCK: '', diaChi: '', ghiChu: '', status: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setWarehousesList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = warehousesList.find(i => i.name === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục Kho/Bãi/Cảng', item)
      }
    }
  }
  
  // Custom handlers cho toll stations với structure khác
  const tollStationHandlers = {
    handleFormChange: (field: string, value: string) => {
      setTollStationFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: tollStationFormData.code,
        name: tollStationFormData.name,
        maSoThue: tollStationFormData.maSoThue,
        diaChi: tollStationFormData.diaChi,
        tenGiaoDich: tollStationFormData.tenTram,
        isActive: tollStationFormData.trangThai === 'Hoạt động'
      }
      
      setTollStationsList((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1)
      alert(`Đã thêm trạm thu phí mới thành công!`)
      
      setTollStationFormData({
        code: '', name: '', tenTram: '', maSoThue: '', soDienThoai: '', soTax: '', email: '', diaChi: '', cap: '', tuNgay: '', ngayKetThuc: '', trangThai: 'Hoạt động'
      })
      setShowAddTollStationModal(false)
    },
    handleClose: () => {
      setShowAddTollStationModal(false)
      setTollStationFormData({
        code: '', name: '', tenTram: '', maSoThue: '', soDienThoai: '', soTax: '', email: '', diaChi: '', cap: '', tuNgay: '', ngayKetThuc: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setTollStationsList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = tollStationsList.find(i => i.name === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục trạm thu phí', item)
      }
    }
  }
  
  // Filter function for storage locations search
  const filteredStorageLocationsList = storageLocationsList.filter(item => {
    const codeMatch = item.code.toLowerCase().includes(storageLocationSearchCode.toLowerCase())
    const nameMatch = item.name.toLowerCase().includes(storageLocationSearchName.toLowerCase())
    return codeMatch && nameMatch
  })
  
  // Search handlers for storage locations
  const handleStorageLocationCodeSearch = (value: string) => {
    setStorageLocationSearchCode(value)
    setCurrentPage(1) // Reset to first page when searching
  }
  
  const handleStorageLocationNameSearch = (value: string) => {
    setStorageLocationSearchName(value)
    setCurrentPage(1) // Reset to first page when searching
  }
  
  // Custom handlers cho storage locations với structure khác
  const storageLocationHandlers = {
    handleFormChange: (field: string, value: string) => {
      setStorageLocationFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: storageLocationFormData.code,
        name: storageLocationFormData.name,
        tenKhac: storageLocationFormData.tenKhac,
        diaChi: storageLocationFormData.diaChi,
        dienGiai: storageLocationFormData.dienGiai,
        loai: storageLocationFormData.tenKho, // Sử dụng tenKho làm loại
        isActive: storageLocationFormData.hienThi === 'Hoạt động'
      }
      
      setStorageLocationsList((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1)
      alert(`Đã thêm địa điểm lưu kho mới thành công!`)
      
      setStorageLocationFormData({
        code: '', name: '', tenKhac: '', diaChi: '', tenKho: '', maHQ: '', dienGiai: '', hienThi: 'Hoạt động', diaHau: '', ghiChu: ''
      })
      setShowAddStorageLocationModal(false)
    },
    handleClose: () => {
      setShowAddStorageLocationModal(false)
      setStorageLocationFormData({
        code: '', name: '', tenKhac: '', diaChi: '', tenKho: '', maHQ: '', dienGiai: '', hienThi: 'Hoạt động', diaHau: '', ghiChu: ''
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setStorageLocationsList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = storageLocationsList.find(i => i.name === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục địa điểm lưu kho', item)
      }
    }
  }
  
  // Filter function for transport methods search
  const filteredTransportMethodsList = transportMethodsList.filter(item => {
    const codeMatch = item.code.toLowerCase().includes(transportMethodSearchCode.toLowerCase())
    const nameMatch = item.name.toLowerCase().includes(transportMethodSearchName.toLowerCase())
    return codeMatch && nameMatch
  })
  
  // Search handlers for transport methods
  const handleTransportMethodCodeSearch = (value: string) => {
    setTransportMethodSearchCode(value)
    setCurrentPage(1) // Reset to first page when searching
  }
  
  const handleTransportMethodNameSearch = (value: string) => {
    setTransportMethodSearchName(value)
    setCurrentPage(1) // Reset to first page when searching
  }
  
  // Custom handlers cho transport methods với structure khác
  const transportMethodHandlers = {
    handleFormChange: (field: string, value: string) => {
      setTransportMethodFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(), // Sử dụng timestamp để đảm bảo unique ID
        code: transportMethodFormData.code,
        name: transportMethodFormData.name,
        tenKhac: transportMethodFormData.tenKhac,
        dienGiai: `${transportMethodFormData.maPH} - ${transportMethodFormData.maHQ} - ${transportMethodFormData.namDK}`,
        naccs: transportMethodFormData.vnaccs,
        isActive: transportMethodFormData.trangThai === 'Hoạt động'
      }
      
      setTransportMethodsList((prev: any[]) => [newItem, ...prev]) // Thêm vào đầu danh sách
      setCurrentPage(1)
      alert(`Đã thêm phương thức vận chuyển mới thành công!`)
      
      setTransportMethodFormData({
        code: '', name: '', tenKhac: '', soTK: '', maPH: '', maHQ: '', namDK: '', vnaccs: 'Có', trangThai: 'Hoạt động'
      })
      setShowAddTransportMethodModal(false)
    },
    handleClose: () => {
      setShowAddTransportMethodModal(false)
      setTransportMethodFormData({
        code: '', name: '', tenKhac: '', soTK: '', maPH: '', maHQ: '', namDK: '', vnaccs: 'Có', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setTransportMethodsList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = transportMethodsList.find(i => i.name === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục phương thức vận chuyển', item)
      }
    }
  }
  
  // Filter function for receipt templates search
  const filteredReceiptTemplatesList = receiptTemplatesList.filter(item => {
    const diemThuMatch = receiptTemplateSearchDiemThu === '' || item.diemThuPhi.toLowerCase().includes(receiptTemplateSearchDiemThu.toLowerCase())
    const codeMatch = receiptTemplateSearchCode === '' || item.kyHieuBL.toLowerCase().includes(receiptTemplateSearchCode.toLowerCase())
    const kyHieuMatch = receiptTemplateSearchKyHieu === '' || item.kyHieuBL.toLowerCase().includes(receiptTemplateSearchKyHieu.toLowerCase())
    return diemThuMatch && codeMatch && kyHieuMatch
  })
  
  // Search handlers for receipt templates
  const handleReceiptTemplateSearchDiemThu = (value: string) => {
    setReceiptTemplateSearchDiemThu(value)
    setCurrentPage(1)
  }
  
  const handleReceiptTemplateSearchCode = (value: string) => {
    setReceiptTemplateSearchCode(value)
    setCurrentPage(1)
  }
  
  const handleReceiptTemplateSearchKyHieu = (value: string) => {
    setReceiptTemplateSearchKyHieu(value)
    setCurrentPage(1)
  }
  
  // Custom handlers cho receipt templates với structure khác
  const receiptTemplateHandlers = {
    handleFormChange: (field: string, value: string) => {
      setReceiptTemplateFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        mauBL: receiptTemplateFormData.mauBL,
        kyHieuBL: receiptTemplateFormData.kyHieuBL,
        tuSo: receiptTemplateFormData.tuSo,
        denSo: receiptTemplateFormData.denSo,
        ngayHieuLuc: receiptTemplateFormData.ngayHieuLuc,
        diemThuPhi: receiptTemplateFormData.diemThuPhi,
        ghiChu: receiptTemplateFormData.ghiChu,
        trangThai: receiptTemplateFormData.trangThai,
        phatHanh: receiptTemplateFormData.phatHanh,
        nguoiTao: 'Admin',
        isActive: receiptTemplateFormData.trangThai === 'Đang sử dụng'
      }
      
      setReceiptTemplatesList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm mẫu ký hiệu biên lai mới thành công!`)
      
      setReceiptTemplateFormData({
        mauBL: '', kyHieuBL: '', tuSo: '', denSo: '', ngayHieuLuc: '', diemThuPhi: '', ghiChu: '', trangThai: 'Chưa sử dụng', phatHanh: 'Chưa phát hành'
      })
      setShowAddReceiptTemplateModal(false)
    },
    handleClose: () => {
      setShowAddReceiptTemplateModal(false)
      setReceiptTemplateFormData({
        mauBL: '', kyHieuBL: '', tuSo: '', denSo: '', ngayHieuLuc: '', diemThuPhi: '', ghiChu: '', trangThai: 'Chưa sử dụng', phatHanh: 'Chưa phát hành'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setReceiptTemplatesList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = receiptTemplatesList.find(i => i.kyHieuBL === itemName || i.mauBL === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục mẫu ký hiệu biên lai', item)
      }
    }
  }
  
  // Filter function for tariffs search
  const filteredTariffsList = tariffsList.filter(item => {
    const bieuCuocMatch = tariffSearchBieuCuoc === '' || item.bieuCuoc === tariffSearchBieuCuoc
    const bieuCuocThueMatch = tariffSearchBieuCuocThue === '' || item.bieuCuocThue === tariffSearchBieuCuocThue
    const maBieuCuocMatch = tariffSearchMaBieuCuoc === '' || item.maBieuCuoc.toLowerCase().includes(tariffSearchMaBieuCuoc.toLowerCase())
    const tenBieuCuocMatch = tariffSearchTenBieuCuoc === '' || item.tenBieuCuoc.toLowerCase().includes(tariffSearchTenBieuCuoc.toLowerCase())
    return bieuCuocMatch && bieuCuocThueMatch && maBieuCuocMatch && tenBieuCuocMatch
  })

  // Search handlers for tariffs
  const handleTariffSearchBieuCuoc = (value: string) => {
    setTariffSearchBieuCuoc(value)
    setCurrentPage(1)
  }

  const handleTariffSearchBieuCuocThue = (value: string) => {
    setTariffSearchBieuCuocThue(value)
    setCurrentPage(1)
  }

  const handleTariffSearchMaBieuCuoc = (value: string) => {
    setTariffSearchMaBieuCuoc(value)
    setCurrentPage(1)
  }

  const handleTariffSearchTenBieuCuoc = (value: string) => {
    setTariffSearchTenBieuCuoc(value)
    setCurrentPage(1)
  }

  // Custom handlers cho tariffs với structure khác
  const tariffHandlers = {
    handleFormChange: (field: string, value: string) => {
      setTariffFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        maBieuCuoc: tariffFormData.maBieuCuoc,
        tenBieuCuoc: tariffFormData.tenBieuCuoc,
        nhomLoaiHinh: tariffFormData.nhomLoaiHinh,
        loaiCont: tariffFormData.loaiHang || 'N/A',
        tinhChatCont: 'Standard',
        dvt: tariffFormData.dvtBieuCuoc,
        hang: tariffFormData.loaiHang,
        sort: parseInt(tariffFormData.stt) || 0,
        donGia: tariffFormData.donGia,
        bieuCuoc: 'Biểu cước A',
        bieuCuocThue: 'BC Thuế VAT',
        isActive: tariffFormData.trangThai === 'Hoạt động'
      }
      
      setTariffsList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm biểu cước mới thành công!`)
      
      setTariffFormData({
        maBieuCuoc: '', tenBieuCuoc: '', dvtBieuCuoc: '', nhomLoaiHinh: '', loaiHang: '', donGia: '', stt: '', dienGiai: '', trangThai: 'Hoạt động'
      })
      setShowAddTariffModal(false)
    },
    handleClose: () => {
      setShowAddTariffModal(false)
      setTariffFormData({
        maBieuCuoc: '', tenBieuCuoc: '', dvtBieuCuoc: '', nhomLoaiHinh: '', loaiHang: '', donGia: '', stt: '', dienGiai: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setTariffsList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = tariffsList.find(i => i.tenBieuCuoc === itemName || i.maBieuCuoc === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục biểu cước', item)
      }
    }
  }

  const enterpriseHandlers = createHandlers(setEnterprisesList, setShowAddEnterpriseModal, setEnterpriseFormData, enterpriseFormData, 'Danh mục doanh nghiệp')
  const tariffTypeHandlers = createHandlers(setTariffTypesList, setShowAddTariffTypeModal, setTariffTypeFormData, tariffTypeFormData, 'Danh mục loại biểu cước')
  
  // Filter function for form types search
  const filteredFormTypesList = formTypesList.filter(item => {
    const nhomMatch = formTypeSearchNhom === '' || item.nhomLoaiHinh === formTypeSearchNhom
    const maMatch = formTypeSearchMa === '' || item.maLoaiHinh.toLowerCase().includes(formTypeSearchMa.toLowerCase())
    const tenMatch = formTypeSearchTen === '' || item.tenLoaiHinh.toLowerCase().includes(formTypeSearchTen.toLowerCase())
    return nhomMatch && maMatch && tenMatch
  })

  // Search handlers for form types
  const handleFormTypeSearchNhom = (value: string) => {
    setFormTypeSearchNhom(value)
    setCurrentPage(1)
  }

  const handleFormTypeSearchMa = (value: string) => {
    setFormTypeSearchMa(value)
    setCurrentPage(1)
  }

  const handleFormTypeSearchTen = (value: string) => {
    setFormTypeSearchTen(value)
    setCurrentPage(1)
  }

  // Custom handlers cho form types với structure khác
  const formTypeHandlers = {
    handleFormChange: (field: string, value: string) => {
      setFormTypeFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        nhomLoaiHinh: formTypeFormData.nhomLoaiHinh,
        maLoaiHinh: formTypeFormData.maLoaiHinh,
        tenLoaiHinh: formTypeFormData.tenLoaiHinh,
        dienGiai: formTypeFormData.dienGiai,
        isActive: formTypeFormData.trangThai === 'Hoạt động'
      }
      
      setFormTypesList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm loại hình mới thành công!`)
      
      setFormTypeFormData({
        nhomLoaiHinh: '', maLoaiHinh: '', tenLoaiHinh: '', dienGiai: '', trangThai: 'Hoạt động'
      })
      setShowAddFormTypeModal(false)
    },
    handleClose: () => {
      setShowAddFormTypeModal(false)
      setFormTypeFormData({
        nhomLoaiHinh: '', maLoaiHinh: '', tenLoaiHinh: '', dienGiai: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setFormTypesList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = formTypesList.find(i => i.tenLoaiHinh === itemName || i.maLoaiHinh === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục loại hình', item)
      }
    }
  }
  // Filter function for payment types search
  const filteredPaymentTypesList = paymentTypesList.filter(item => {
    const maMatch = paymentTypeSearchMa === '' || item.maLoaiThanhToan.toLowerCase().includes(paymentTypeSearchMa.toLowerCase())
    const tenMatch = paymentTypeSearchTen === '' || item.tenLoaiThanhToan.toLowerCase().includes(paymentTypeSearchTen.toLowerCase())
    return maMatch && tenMatch
  })

  // Search handlers for payment types
  const handlePaymentTypeSearchMa = (value: string) => {
    setPaymentTypeSearchMa(value)
    setCurrentPage(1)
  }

  const handlePaymentTypeSearchTen = (value: string) => {
    setPaymentTypeSearchTen(value)
    setCurrentPage(1)
  }

  // Custom handlers cho payment types với structure khác
  const paymentTypeHandlers = {
    handleFormChange: (field: string, value: string) => {
      setPaymentTypeFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        maLoaiThanhToan: paymentTypeFormData.maLoaiThanhToan,
        tenLoaiThanhToan: paymentTypeFormData.tenLoaiThanhToan,
        dienGiai: paymentTypeFormData.dienGiai,
        isActive: paymentTypeFormData.trangThai === 'Hoạt động'
      }
      
      setPaymentTypesList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm loại thanh toán mới thành công!`)
      
      setPaymentTypeFormData({
        maLoaiThanhToan: '', tenLoaiThanhToan: '', dienGiai: '', trangThai: 'Hoạt động'
      })
      setShowAddPaymentTypeModal(false)
    },
    handleClose: () => {
      setShowAddPaymentTypeModal(false)
      setPaymentTypeFormData({
        maLoaiThanhToan: '', tenLoaiThanhToan: '', dienGiai: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setPaymentTypesList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = paymentTypesList.find(i => i.tenLoaiThanhToan === itemName || i.maLoaiThanhToan === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục loại thanh toán', item)
      }
    }
  }
  // Filter function for container types search
  const filteredContainerTypesList = containerTypesList.filter(item => {
    const maMatch = containerTypeSearchMa === '' || item.maLoaiContainer.toLowerCase().includes(containerTypeSearchMa.toLowerCase())
    const tenMatch = containerTypeSearchTen === '' || item.tenLoaiContainer.toLowerCase().includes(containerTypeSearchTen.toLowerCase())
    return maMatch && tenMatch
  })

  // Search handlers for container types
  const handleContainerTypeSearchMa = (value: string) => {
    setContainerTypeSearchMa(value)
    setCurrentPage(1)
  }

  const handleContainerTypeSearchTen = (value: string) => {
    setContainerTypeSearchTen(value)
    setCurrentPage(1)
  }

  // Custom handlers cho container types với structure khác
  const containerTypeHandlers = {
    handleFormChange: (field: string, value: string) => {
      setContainerTypeFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        maLoaiContainer: containerTypeFormData.maLoaiContainer,
        tenLoaiContainer: containerTypeFormData.tenLoaiContainer,
        dienGiai: containerTypeFormData.dienGiai,
        isActive: containerTypeFormData.trangThai === 'Hoạt động'
      }
      
      setContainerTypesList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm loại container mới thành công!`)
      
      setContainerTypeFormData({
        maLoaiContainer: '', tenLoaiContainer: '', dienGiai: '', trangThai: 'Hoạt động'
      })
      setShowAddContainerTypeModal(false)
    },
    handleClose: () => {
      setShowAddContainerTypeModal(false)
      setContainerTypeFormData({
        maLoaiContainer: '', tenLoaiContainer: '', dienGiai: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setContainerTypesList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = containerTypesList.find(i => i.tenLoaiContainer === itemName || i.maLoaiContainer === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục loại container', item)
      }
    }
  }
  // Filter function for units search
  const filteredUnitsList = unitsList.filter(item => {
    const donViTinhMatch = unitSearchDonViTinh === '' || item.loaiDonViTinh === unitSearchDonViTinh
    const maMatch = unitSearchMa === '' || item.maDonViTinh.toLowerCase().includes(unitSearchMa.toLowerCase())
    const tenMatch = unitSearchTen === '' || item.tenDonViTinh.toLowerCase().includes(unitSearchTen.toLowerCase())
    return donViTinhMatch && maMatch && tenMatch
  })

  // Search handlers for units
  const handleUnitSearchDonViTinh = (value: string) => {
    setUnitSearchDonViTinh(value)
    setCurrentPage(1)
  }

  const handleUnitSearchMa = (value: string) => {
    setUnitSearchMa(value)
    setCurrentPage(1)
  }

  const handleUnitSearchTen = (value: string) => {
    setUnitSearchTen(value)
    setCurrentPage(1)
  }

  // Custom handlers cho units với structure khác
  const unitHandlers = {
    handleFormChange: (field: string, value: string) => {
      setUnitFormData((prev: any) => ({ ...prev, [field]: value }))
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      const newItem = {
        id: Date.now(),
        maDonViTinh: unitFormData.maDonViTinh,
        tenDonViTinh: unitFormData.tenDonViTinh,
        loaiDonViTinh: unitFormData.loaiDonViTinh,
        dienGiai: unitFormData.dienGiai,
        isActive: unitFormData.trangThai === 'Hoạt động'
      }
      
      setUnitsList((prev: any[]) => [newItem, ...prev])
      setCurrentPage(1)
      alert(`Đã thêm đơn vị tính mới thành công!`)
      
      setUnitFormData({
        maDonViTinh: '', tenDonViTinh: '', loaiDonViTinh: '', dienGiai: '', trangThai: 'Hoạt động'
      })
      setShowAddUnitModal(false)
    },
    handleClose: () => {
      setShowAddUnitModal(false)
      setUnitFormData({
        maDonViTinh: '', tenDonViTinh: '', loaiDonViTinh: '', dienGiai: '', trangThai: 'Hoạt động'
      })
    },
    handleDelete: (itemId: number, itemName: string) => {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)
      if (confirmed) {
        setUnitsList((prev: any[]) => {
          const newList = prev.filter((item: any) => item.id !== itemId)
          const newTotalPages = Math.ceil(newList.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newList
        })
        alert(`Đã xóa: ${itemName}`)
      }
    },
    handleViewDetail: (itemName: string) => {
      const item = unitsList.find(i => i.tenDonViTinh === itemName || i.maDonViTinh === itemName)
      if (item) {
        showDetailView('Chi tiết danh mục đơn vị tính', item)
      }
    }
  }

  // Pagination logic - sử dụng filteredCustomsList
  const totalPages = Math.ceil(filteredCustomsList.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCustomsList.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/system/users':
        return 'Quản lý người dùng'
      case '/system/business':
        return 'Quản lý thông tin doanh nghiệp'
      case '/system/password':
        return 'Đổi mật khẩu'
      case '/system/customs':
        return 'Danh mục hải quan'
      case '/system/banks':
        return 'Danh mục ngân hàng TM'
      case '/system/warehouses':
        return 'Danh mục Kho/Bãi/Cảng'
      case '/system/toll-stations':
        return 'Danh mục trạm thu phí'
      case '/system/storage-locations':
        return 'Danh mục địa điểm lưu kho'
      case '/system/enterprises':
        return 'Danh mục doanh nghiệp'
      case '/system/transport-methods':
        return 'Danh mục phương thức vận chuyển'
      case '/system/receipt-templates':
        return 'Danh mục mẫu ký hiệu biên lai'
      case '/system/tariff-types':
        return 'Danh mục loại biểu cước'
      case '/system/tariffs':
        return 'Danh mục biểu cước'
      case '/system/form-types':
        return 'Danh mục loại hình'
      case '/system/payment-types':
        return 'Danh mục loại thanh toán'
      case '/system/container-types':
        return 'Danh mục loại container'
      case '/system/units':
        return 'Danh mục đơn vị tính'
      default:
        return 'Hệ thống'
    }
  }

  // Helper function để generate catalog page content
  const generateCatalogPage = (config: {
    list: any[],
    showModal: boolean,
    setShowModal: any,
    formData: any,
    handleFormChange: any,
    handleSubmit: any,
    handleClose: any,
    handleDelete: any,
    handleViewDetail: any,
    title: string,
    searchPlaceholder: string
  }) => {
    const { list, showModal, setShowModal, formData, 
            handleFormChange, handleSubmit, handleClose, handleDelete, 
            handleViewDetail, title, searchPlaceholder } = config

    const totalPages = Math.ceil(list.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem)

    return (
      <div className="space-y-4">
        {/* Header với filter */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              >
                <i className="fas fa-plus mr-2"></i>
                Thêm mới
              </button>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">
                  Có {list.length}/200 bản ghi - Trang: {currentPage}/{totalPages}
                </div>
                <input
                  type="text"
                  placeholder="Mã"
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
                  <i className="fas fa-search mr-2"></i>
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-xs text-gray-900">{indexOfFirstItem + index + 1}</td>
                    <td className="px-3 py-3 text-xs">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetail(item.name)}
                          className="text-blue-500 hover:text-blue-700" 
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-500 hover:text-red-700" 
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900">{item.code}</td>
                    <td className="px-3 py-3 text-xs text-gray-900">{item.name}</td>
                    <td className="px-3 py-3 text-xs text-gray-900">{item.description}</td>
                    <td className="px-3 py-3 text-xs">
                      <i className={`fas ${item.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 py-3 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, list.length)} của {list.length} bản ghi
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Trước
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                          currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin {title.toLowerCase()}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Mã:</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleFormChange('code', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập mã"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Tên:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập tên"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Cấp:</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => handleFormChange('level', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập cấp"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Địa chỉ:</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Số điện thoại:</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Số fax:</label>
                  <input
                    type="text"
                    value={formData.fax}
                    onChange={(e) => handleFormChange('fax', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập số fax"
                  />
                </div>
                <div className="flex items-start gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">Ghi chú:</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleFormChange('note', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                    placeholder="Nhập ghi chú"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-1/4">Trạng thái:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                    Đóng
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Lưu lại
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const getPageContent = () => {
    switch(location.pathname) {
      case '/system/users':
        return (
          <div>
            {/* Tabs và nút thêm mới */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              {/* Tabs */}
              <div className="px-4 pt-4">
                <div className="flex border-b">
                  <button 
                    className={`px-4 py-2 flex items-center ${
                      activeTab === 'users' 
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => handleTabChange('users')}
                  >
                    <i className="fas fa-list mr-2"></i>
                    Danh sách người dùng
                  </button>
                  <button 
                    className={`px-4 py-2 flex items-center ${
                      activeTab === 'permissions' 
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => handleTabChange('permissions')}
                  >
                    <i className="fas fa-user-cog mr-2"></i>
                    Phân quyền sử dụng chức năng
                  </button>
                </div>
              </div>
              
              {/* Nút thêm mới - chỉ hiển thị ở tab users */}
              {activeTab === 'users' && (
                <div className="px-4 py-3">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                    onClick={handleAddNewUser}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Thêm mới
                  </button>
                </div>
              )}
            </div>

            {/* Nội dung tab users */}
            {activeTab === 'users' && (
              <>
                {/* Filter bar - Text sát với controls và dropdown rộng hơn */}
                <div className="bg-gray-50 py-3 mb-4 px-4">
              <div className="flex flex-wrap items-center gap-3 justify-end">
                {/* Text thông báo sát với controls */}
                <div className="text-sm font-medium text-gray-700">
                  (Có {filteredUsersList.length}/{users.length} Tài khoản)
                </div>
                
                <select 
                  value={userSearchDepartment}
                  onChange={(e) => setUserSearchDepartment(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-60"
                >
                  <option value="">-- Cục quản lý --</option>
                  {[...new Set(users.map(u => u.department.split(' - ')[1] || u.department))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select 
                  value={userSearchOffice}
                  onChange={(e) => setUserSearchOffice(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-60"
                >
                  <option value="">-- Phòng ban --</option>
                  {[...new Set(users.map(u => u.department.split(' - ')[0] || u.department))].map(office => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
                
                <select 
                  value={userSearchPosition}
                  onChange={(e) => setUserSearchPosition(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-52"
                >
                  <option value="">-- Chức vụ --</option>
                  {[...new Set(users.map(u => u.position))].map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                
                <input 
                  type="text" 
                  placeholder="Tài khoản"
                  value={userSearchUsername}
                  onChange={(e) => setUserSearchUsername(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-32"
                />
                
                <input 
                  type="text" 
                  placeholder="Tên tài khoản"
                  value={userSearchFullName}
                  onChange={(e) => setUserSearchFullName(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-36"
                />
                
                <button 
                  onClick={handleUsersSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <i className="fas fa-search mr-2"></i>
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÀI KHOẢN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHÒNG BAN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NHÓM CHỨC NĂNG</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CHỨC VỤ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOẠT ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(() => {
                      // Pagination logic cho users
                      const usersTotalPages = Math.ceil(filteredUsersList.length / itemsPerPage)
                      const usersIndexOfLastItem = currentPage * itemsPerPage
                      const usersIndexOfFirstItem = usersIndexOfLastItem - itemsPerPage
                      const currentUsers = filteredUsersList.slice(usersIndexOfFirstItem, usersIndexOfLastItem)
                      
                      return currentUsers.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{usersIndexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button 
                              className="text-blue-500 hover:text-blue-700" 
                              title="Xem chi tiết"
                              onClick={() => handleViewDetail(user.username, user.fullName)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700" 
                              title="Xóa"
                              onClick={() => handleDeleteUser(user.username, user.fullName)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.functionGroup}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{user.position}</td>
                        <td className="px-4 py-3 text-sm">
                          <i className={`fas ${user.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`} 
                             title={user.isActive ? 'Hoạt động' : 'Không hoạt động'}></i>
                        </td>
                        </tr>
                      ))
                    })()}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Có {filteredUsersList.length}/{users.length} bản ghi - Trang: {currentPage}/{(() => {
                      const usersTotalPages = Math.ceil(filteredUsersList.length / itemsPerPage)
                      return usersTotalPages
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min((() => {
                        const usersTotalPages = Math.ceil(filteredUsersList.length / itemsPerPage)
                        return usersTotalPages
                      })(), 5) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={(() => {
                        const usersTotalPages = Math.ceil(filteredUsersList.length / itemsPerPage)
                        return currentPage === usersTotalPages
                      })()}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </>
            )}

            {/* Nội dung tab permissions */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                {/* Header với nút thêm mới */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-3">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                      onClick={handleAddNewGroup}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Thêm mới
                    </button>
                  </div>
                </div>

                {/* Layout 2 cột */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Cột trái - Bảng nhóm chức năng */}
                  <div className="col-span-5">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 flex items-center justify-between border-b">
                                                            <span className="text-sm font-medium text-gray-700">
                                      <i className="fas fa-users mr-2"></i>
                                      Nhóm chức năng (có {groups.length} bản ghi)
                                    </span>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="STT Tài khoản" 
                            className="border border-gray-300 rounded px-3 py-1 text-xs bg-white w-32 pr-8"
                          />
                          <i className="fas fa-search absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                        </div>
                      </div>

                      {/* Bảng nhóm chức năng */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHÒNG BAN</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ NHÓM</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN NHÓM</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOẠT ĐỘNG</th>
                            </tr>
                          </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                        {groups.map((group, index) => (
                                          <tr key={group.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-xs text-gray-900">{index + 1}</td>
                                            <td className="px-4 py-3 text-xs">
                                              <div className="flex gap-1">
                                                <button 
                                                  className="text-blue-500 hover:text-blue-700" 
                                                  title="Xem chi tiết"
                                                  onClick={() => showDetailView('Chi tiết nhóm chức năng', group)}
                                                >
                                                  <i className="fas fa-eye text-xs"></i>
                                                </button>
                                                <button 
                                                  className="text-red-500 hover:text-red-700" 
                                                  title="Xóa"
                                                  onClick={() => handleDeleteGroup(group.id, group.groupName)}
                                                >
                                                  <i className="fas fa-trash text-xs"></i>
                                                </button>
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{group.department}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500">{group.groupCode}</td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                              <div className="flex items-center">
                                                <input type="checkbox" className="h-3 w-3 text-blue-600 mr-1" defaultChecked />
                                                {group.groupName}
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                              <i className={`fas ${group.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải - Bảng danh sách user */}
                  <div className="col-span-7">
                    {/* Text kết quả tìm kiếm và ô tìm kiếm */}
                    <div className="mb-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        (Danh sách tài khoản trong nhóm có 15 số lượng bản ghi)
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Tìm kiếm..." 
                          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white w-64 pl-10"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÀI KHOẢN</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHÒNG BAN</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CHỨC VỤ</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOẠT ĐỘNG</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">1</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">adminrang1</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Admin rang 1</td>
                              <td className="px-4 py-3 text-sm text-gray-900">03 - Chi cuc HQCK cảng KV</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Admin phòng ba</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">2</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN466</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đàm Minh Nghiệp</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Phó phòng</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">3</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN40</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nguyễn Đình Vĩnh Trung</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đội trưởng</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">4</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN55</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Văn Thị Lệ Thu</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đội phó</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">5</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN35</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Hoàng Văn Ký</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đội phó</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">6</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN11</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nguyễn Thu Thủy</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đội phó</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">7</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN22</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Hoàng Thị Phương Liên</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV3</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">8</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN06</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Trần Thị Nhung</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">9</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN04</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nguyễn Hoàng Long</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">10</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN74</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Mai Văn Hán</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">11</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN13</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Đặng Quang Minh</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">12</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN20</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Hoàng Thu Trang</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">13</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN77</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Vũ Thị Vinh</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">14</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN95</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nguyễn Văn Đạt</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">15</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Xem chi tiết"
                                    onClick={() => alert('Tính năng này đang phát triển')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">QTTGN43</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Vũ Đức Anh</td>
                              <td className="px-4 py-3 text-sm text-gray-900">- Chi cuc HQCK cảng KV2</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Nhân viên</td>
                              <td className="px-4 py-3 text-sm">
                                <i className="fas fa-check text-green-500" title="Hoạt động"></i>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Pagination info */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="text-sm text-gray-700">
                            Có 25 bản ghi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Group Modal */}
            {showAddGroupModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-4 w-1/2 max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b">
                    <h2 className="text-lg font-bold text-gray-800">
                      <i className="fas fa-users text-blue-500 mr-2"></i>
                      Cập nhật nhóm chức năng
                    </h2>
                    <button 
                      onClick={handleCloseGroupModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSubmitGroupForm} className="space-y-4">
                    {/* Phòng ban */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/4">
                        Phòng ban:
                      </label>
                      <select
                        value={groupFormData.department}
                        onChange={(e) => handleGroupFormChange('department', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">- Chọn -</option>
                        <option value="Phòng IT">Phòng IT</option>
                        <option value="Phòng Kế toán">Phòng Kế toán</option>
                        <option value="Phòng Hành chính">Phòng Hành chính</option>
                        <option value="Phòng Kinh doanh">Phòng Kinh doanh</option>
                      </select>
                    </div>

                    {/* Mã nhóm */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/4">
                        Mã nhóm:
                      </label>
                      <input
                        type="text"
                        value={groupFormData.groupCode}
                        onChange={(e) => handleGroupFormChange('groupCode', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập mã nhóm"
                      />
                    </div>

                    {/* Tên nhóm */}
                    <div className="flex items-start gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">
                        Tên nhóm:
                      </label>
                      <textarea
                        value={groupFormData.groupName}
                        onChange={(e) => handleGroupFormChange('groupName', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-20 resize-none"
                        placeholder="Nhập tên nhóm"
                      />
                    </div>

                    {/* Ghi chú */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/4">
                        Ghi chú:
                      </label>
                      <input
                        type="text"
                        value={groupFormData.note}
                        onChange={(e) => handleGroupFormChange('note', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập ghi chú"
                      />
                    </div>

                    {/* Trạng thái */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/4">
                        Trạng thái:
                      </label>
                      <select
                        value={groupFormData.status}
                        onChange={(e) => handleGroupFormChange('status', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Không hoạt động">Không hoạt động</option>
                      </select>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-4 mt-6">
                      <div className="w-1/4"></div>
                      <div className="flex-1">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-700">Dành sách chức năng phân cho nhóm</span>
                        </label>
                      </div>
                    </div>

                    {/* Thành viên trong nhóm */}
                    <div className="mt-6">
                      <div className="bg-gray-100 p-4 rounded">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <i className="fas fa-users text-gray-600 mr-2"></i>
                          Thành viên trong nhóm
                        </h4>
                        <div className="text-xs text-gray-500">
                          Chưa có thành viên nào được thêm vào nhóm này.
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                      <button
                        type="button"
                        onClick={handleCloseGroupModal}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-3 w-1/2 h-fit max-h-[85vh]">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Thêm mới tài khoản</h2>
                    <button 
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSubmitForm} className="space-y-2">
                    {/* Tài khoản */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => handleFormChange('username', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập tài khoản"
                      />
                    </div>

                    {/* Mật khẩu */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => handleFormChange('password', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập mật khẩu"
                      />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu"
                      />
                    </div>

                    {/* Tên đầy đủ */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Tên đầy đủ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleFormChange('fullName', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập tên đầy đủ"
                      />
                    </div>

                    {/* Ngày sinh */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleFormChange('birthDate', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Cục quản lý */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Cục quản lý
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleFormChange('department', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Chọn cục quản lý --</option>
                        <option value="01CV">01CV - Cảng vụ TPHCM</option>
                        <option value="02CC">02CC - Chi cục HQCK cảng KV1</option>
                        <option value="03CC">03CC - Chi cục HQCK cảng KV2</option>
                        <option value="04CC">04CC - Chi cục HQCK cảng KV3</option>
                        <option value="05CC">05CC - Chi cục HQCK cảng KV4</option>
                        <option value="06CC">06CC - Chi cục HQCK cảng KV5</option>
                      </select>
                    </div>

                    {/* Phòng ban */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Phòng ban <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.office}
                        onChange={(e) => handleFormChange('office', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Chọn phòng ban --</option>
                        <option value="P.Kỹ thuật">P.Kỹ thuật</option>
                        <option value="P.Tài chính">P.Tài chính</option>
                        <option value="P.Vận hành">P.Vận hành</option>
                        <option value="P.Hành chính">P.Hành chính</option>
                        <option value="P.IT">P.IT</option>
                      </select>
                    </div>

                    {/* Đội quản lý */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Đội quản lý
                      </label>
                      <select
                        value={formData.teamManager}
                        onChange={(e) => handleFormChange('teamManager', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Chọn đội quản lý --</option>
                        <option value="Đội 1">Đội 1</option>
                        <option value="Đội 2">Đội 2</option>
                        <option value="Đội 3">Đội 3</option>
                        <option value="Đội 4">Đội 4</option>
                      </select>
                    </div>

                    {/* Trạm thu phí */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Trạm thu phí
                      </label>
                      <select
                        value={formData.tollStation}
                        onChange={(e) => handleFormChange('tollStation', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Chọn trạm thu phí --</option>
                        <option value="Trạm 1">Trạm thu phí số 1</option>
                        <option value="Trạm 2">Trạm thu phí số 2</option>
                        <option value="Trạm 3">Trạm thu phí số 3</option>
                        <option value="Trạm 4">Trạm thu phí số 4</option>
                      </select>
                    </div>

                    {/* Chức vụ */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Chức vụ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.position}
                        onChange={(e) => handleFormChange('position', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập chức vụ"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập email"
                      />
                    </div>

                    {/* Điện thoại */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 w-1/3">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleFormChange('address', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t mt-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Lưu lại
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )
                    case '/system/business':
                const businessTotalPages = Math.ceil(filteredBusinessList.length / itemsPerPage)
                const businessIndexOfLastItem = currentPage * itemsPerPage
                const businessIndexOfFirstItem = businessIndexOfLastItem - itemsPerPage
                const currentBusiness = filteredBusinessList.slice(businessIndexOfFirstItem, businessIndexOfLastItem)
                
                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Có {filteredBusinessList.length}/{businessList.length} bản ghi - Trang: {currentPage}/{businessTotalPages}
                          </div>
                          <div className="flex items-center gap-3">
                            <select 
                              value={businessSearchStatus}
                              onChange={(e) => setBusinessSearchStatus(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="">Tất cả trạng thái</option>
                              <option value="Đã cấp quyền">Đã cấp quyền</option>
                              <option value="Chờ quyết">Chờ quyết</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Mã doanh nghiệp"
                              value={businessSearchCode}
                              onChange={(e) => setBusinessSearchCode(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên doanh nghiệp"
                              value={businessSearchName}
                              onChange={(e) => setBusinessSearchName(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button 
                              onClick={handleBusinessSearch}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bảng dữ liệu - sẽ được thêm vào */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÀI KHOẢN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HỌ VÀ TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">CHỨC VỤ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐƠN VỊ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỬA</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentBusiness.map((business, index) => (
                              <tr key={business.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{businessIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => showDetailView('Chi tiết thông tin doanh nghiệp', business)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa "${business.name}"?`)
                                        if (confirmed) {
                                          setBusinessList(prev => prev.filter(b => b.id !== business.id))
                                          alert(`Đã xóa: ${business.name}`)
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{business.username}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{business.fullName}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{business.position}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{business.department}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    business.status === 'Đã cấp quyền' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {business.status}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-xs">
                                  <button 
                                    onClick={() => alert(`Sửa thông tin: ${business.name}`)}
                                    className="text-blue-500 hover:text-blue-700" 
                                    title="Sửa thông tin"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Hiển thị {businessIndexOfFirstItem + 1}-{Math.min(businessIndexOfLastItem, filteredBusinessList.length)} của {filteredBusinessList.length} bản ghi
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              Trước
                            </button>
                            
                            <div className="flex gap-1">
                              {Array.from({ length: Math.min(businessTotalPages, 5) }, (_, i) => {
                                const page = i + 1
                                return (
                                  <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm rounded ${
                                      currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border hover:bg-gray-50'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                )
                              })}
                            </div>
                            
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === businessTotalPages}
                              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              Sau
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              case '/system/password':
                return (
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                    <div className="flex">
                      {/* Left side - Form */}
                      <div className="flex-1 p-6">
                        <form className="space-y-4">
                          {/* Phòng ban trực thuộc */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Phòng ban trực thuộc:
                            </label>
                            <span className="text-sm text-gray-900">HN - LẬP TRÌNH</span>
                          </div>

                          {/* Đội quản lý nhóm */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Đội quản lý nhóm:
                            </label>
                            <span className="text-sm text-gray-900">Admin</span>
                          </div>

                          {/* Tài khoản */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Tài khoản:
                            </label>
                            <span className="text-sm text-gray-900">Admin (Administrator)</span>
                          </div>

                          {/* Mật khẩu hiện tại */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Mật khẩu hiện tại <span className="text-red-500">*</span>:
                            </label>
                            <input
                              type="password"
                              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 max-w-md"
                              required
                            />
                          </div>

                          {/* Mật khẩu mới */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Mật khẩu mới <span className="text-red-500">*</span>:
                            </label>
                            <input
                              type="password"
                              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 max-w-md"
                              required
                            />
                          </div>

                          {/* Xác nhận mật khẩu mới */}
                          <div className="flex items-center gap-4">
                            <label className="w-48 text-sm font-medium text-gray-700">
                              Xác nhận mật khẩu mới <span className="text-red-500">*</span>:
                            </label>
                            <input
                              type="password"
                              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 max-w-md"
                              required
                            />
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 pt-6">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Lưu lại
                            </button>
                            <button
                              type="button"
                              className="px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Reset
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Right side - Password suggestions */}
                      <div className="w-80 bg-gray-50 p-6 border-l">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">
                          Gợi ý để có mật khẩu mạnh:
                        </h4>
                        <ul className="text-xs text-gray-700 space-y-2">
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Có ít nhất 6 ký tự
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Có ít nhất một ký tự thường
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Có ít nhất một chữ hoa
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Có ít nhất một chữ số
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Có ít nhất ký tự đặc biệt
                          </li>
                        </ul>
                      </div>
                    </div>
                                    </div>
                )
              case '/system/customs':
                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddCustomsModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredCustomsList.length}/{customsList.length} bản ghi - Trang: {currentPage}/{totalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã hải quan"
                              value={customsSearchCode}
                              onChange={(e) => setCustomsSearchCode(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên hải quan"
                              value={customsSearchName}
                              onChange={(e) => setCustomsSearchName(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button 
                              onClick={handleCustomsSearch}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((customs, index) => (
                              <tr key={customs.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{indexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleViewCustomsDetail(customs.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteCustoms(customs.id, customs.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{customs.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{customs.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{customs.description}</td>
                                <td className="px-3 py-3 text-xs">
                                  <i className={`fas ${customs.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, customsList.length)} của {customsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              {/* Previous button */}
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {/* Page numbers */}
                              {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              {/* Next button */}
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Customs Modal */}
                    {showAddCustomsModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin hải quan</h2>
                          
                          <form onSubmit={handleSubmitCustomsForm} className="space-y-4">
                            {/* Mã hải quan */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Mã hải quan:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.code}
                                onChange={(e) => handleCustomsFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã hải quan"
                              />
                            </div>

                            {/* Tên hải quan */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Tên hải quan:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.name}
                                onChange={(e) => handleCustomsFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập tên hải quan"
                              />
                            </div>

                            {/* Cấp hải quan */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Cấp hải quan:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.level}
                                onChange={(e) => handleCustomsFormChange('level', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập cấp hải quan"
                              />
                            </div>

                            {/* Địa chỉ */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Địa chỉ:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.address}
                                onChange={(e) => handleCustomsFormChange('address', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập địa chỉ"
                              />
                            </div>

                            {/* Số điện thoại */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Số điện thoại:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.phone}
                                onChange={(e) => handleCustomsFormChange('phone', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập số điện thoại"
                              />
                            </div>

                            {/* Số fax */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Số fax:
                              </label>
                              <input
                                type="text"
                                value={customsFormData.fax}
                                onChange={(e) => handleCustomsFormChange('fax', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập số fax"
                              />
                            </div>

                            {/* Ghi chú */}
                            <div className="flex items-start gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">
                                Ghi chú:
                              </label>
                              <textarea
                                value={customsFormData.note}
                                onChange={(e) => handleCustomsFormChange('note', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                                placeholder="Nhập ghi chú"
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">
                                Trạng thái:
                              </label>
                              <select
                                value={customsFormData.status}
                                onChange={(e) => handleCustomsFormChange('status', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                              <button
                                type="button"
                                onClick={handleCloseCustomsModal}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                              >
                                Đóng
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/banks':
                const banksTotalPages = Math.ceil(filteredBanksList.length / itemsPerPage)
                const banksIndexOfLastItem = currentPage * itemsPerPage
                const banksIndexOfFirstItem = banksIndexOfLastItem - itemsPerPage
                const currentBanks = filteredBanksList.slice(banksIndexOfFirstItem, banksIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddBankModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredBanksList.length}/{banksList.length} bản ghi - Trang: {currentPage}/{banksTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã ngân hàng"
                              value={banksSearchCode}
                              onChange={(e) => setBanksSearchCode(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên ngân hàng"
                              value={banksSearchName}
                              onChange={(e) => setBanksSearchName(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button 
                              onClick={handleBanksSearch}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentBanks.map((bank, index) => (
                              <tr key={bank.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{banksIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => bankHandlers.handleViewDetail(bank.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => bankHandlers.handleDelete(bank.id, bank.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{bank.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{bank.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{bank.description}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    bank.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {bank.isActive ? 'Hiển thị' : 'Ẩn'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            Trước
                          </button>
                          
                          <div className="flex gap-1">
                            {Array.from({ length: Math.min(banksTotalPages, 5) }, (_, i) => {
                              const page = i + 1
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1 text-sm rounded ${
                                    currentPage === page
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white border hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            })}
                          </div>
                          
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === banksTotalPages}
                            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            Sau
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add Bank Modal */}
                    {showAddBankModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin ngân hàng TM</h2>
                          
                          <form onSubmit={bankHandlers.handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã ngân hàng:</label>
                              <input
                                type="text"
                                value={bankFormData.code}
                                onChange={(e) => bankHandlers.handleFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã ngân hàng"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên ngân hàng:</label>
                              <input
                                type="text"
                                value={bankFormData.name}
                                onChange={(e) => bankHandlers.handleFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập tên ngân hàng"
                              />
                            </div>
                            <div className="flex gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Diễn giải:</label>
                              <textarea
                                value={bankFormData.address}
                                onChange={(e) => bankHandlers.handleFormChange('address', e.target.value)}
                                rows={3}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="Nhập diễn giải"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Trạng thái:</label>
                              <select
                                value={bankFormData.status}
                                onChange={(e) => bankHandlers.handleFormChange('status', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <button
                                type="button"
                                onClick={bankHandlers.handleClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                Hủy
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/warehouses':
                const warehousesTotalPages = Math.ceil(warehousesList.length / itemsPerPage)
                const warehousesIndexOfLastItem = currentPage * itemsPerPage
                const warehousesIndexOfFirstItem = warehousesIndexOfLastItem - itemsPerPage
                const currentWarehouses = warehousesList.slice(warehousesIndexOfFirstItem, warehousesIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddWarehouseModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {warehousesList.length}/200 bản ghi - Trang: {currentPage}/{warehousesTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã kho cảng"
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên kho, cảng"
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ HẢI QUAN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ CK</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐỊA CHỈ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">GHI CHÚ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentWarehouses.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{warehousesIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => warehouseHandlers.handleViewDetail(item.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => warehouseHandlers.handleDelete(item.id, item.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maHaiQuan}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maCK}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.diaChi}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.ghiChu}</td>
                                <td className="px-3 py-3 text-xs">
                                  <i className={`fas ${item.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {warehousesIndexOfFirstItem + 1}-{Math.min(warehousesIndexOfLastItem, warehousesList.length)} của {warehousesList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(warehousesTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === warehousesTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === warehousesTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddWarehouseModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin kho/bãi/cảng</h2>
                          
                          <form onSubmit={warehouseHandlers.handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã:</label>
                              <input
                                type="text"
                                value={warehouseFormData.code}
                                onChange={(e) => warehouseHandlers.handleFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã kho/cảng"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên:</label>
                              <input
                                type="text"
                                value={warehouseFormData.name}
                                onChange={(e) => warehouseHandlers.handleFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập tên kho/cảng"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã hải quan:</label>
                              <input
                                type="text"
                                value={warehouseFormData.maHaiQuan}
                                onChange={(e) => warehouseHandlers.handleFormChange('maHaiQuan', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã hải quan"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã CK:</label>
                              <input
                                type="text"
                                value={warehouseFormData.maCK}
                                onChange={(e) => warehouseHandlers.handleFormChange('maCK', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã CK"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Địa chỉ:</label>
                              <input
                                type="text"
                                value={warehouseFormData.diaChi}
                                onChange={(e) => warehouseHandlers.handleFormChange('diaChi', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Nhập địa chỉ"
                              />
                            </div>
                            <div className="flex items-start gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">Ghi chú:</label>
                              <textarea
                                value={warehouseFormData.ghiChu}
                                onChange={(e) => warehouseHandlers.handleFormChange('ghiChu', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                                placeholder="Nhập ghi chú"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Trạng thái:</label>
                              <select
                                value={warehouseFormData.status}
                                onChange={(e) => warehouseHandlers.handleFormChange('status', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                              <button type="button" onClick={warehouseHandlers.handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                Đóng
                              </button>
                              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/toll-stations':
                const tollStationsTotalPages = Math.ceil(tollStationsList.length / itemsPerPage)
                const tollStationsIndexOfLastItem = currentPage * itemsPerPage
                const tollStationsIndexOfFirstItem = tollStationsIndexOfLastItem - itemsPerPage
                const currentTollStations = tollStationsList.slice(tollStationsIndexOfFirstItem, tollStationsIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddTollStationModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {tollStationsList.length}/200 bản ghi - Trang: {currentPage}/{tollStationsTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã trạm thu phí"
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên trạm thu phí"
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ TRẠM TP</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN TRẠM TP</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ SỐ THUẾ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐỊA CHỈ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN GIAO DỊCH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentTollStations.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{tollStationsIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => tollStationHandlers.handleViewDetail(item.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => tollStationHandlers.handleDelete(item.id, item.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maSoThue}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.diaChi}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenGiaoDich}</td>
                                <td className="px-3 py-3 text-xs">
                                  <i className={`fas ${item.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {tollStationsIndexOfFirstItem + 1}-{Math.min(tollStationsIndexOfLastItem, tollStationsList.length)} của {tollStationsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(tollStationsTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === tollStationsTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === tollStationsTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddTollStationModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin trạm thu phí</h2>
                          
                          <form onSubmit={tollStationHandlers.handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã trạm TP:</label>
                              <input
                                type="text"
                                value={tollStationFormData.code}
                                onChange={(e) => tollStationHandlers.handleFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên trạm TP:</label>
                              <input
                                type="text"
                                value={tollStationFormData.name}
                                onChange={(e) => tollStationHandlers.handleFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên trạm TP 2:</label>
                              <input
                                type="text"
                                value={tollStationFormData.tenTram}
                                onChange={(e) => tollStationHandlers.handleFormChange('tenTram', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã số thuế:</label>
                              <input
                                type="text"
                                value={tollStationFormData.maSoThue}
                                onChange={(e) => tollStationHandlers.handleFormChange('maSoThue', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Số điện thoại:</label>
                              <input
                                type="text"
                                value={tollStationFormData.soDienThoai}
                                onChange={(e) => tollStationHandlers.handleFormChange('soDienThoai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Số Tax:</label>
                              <input
                                type="text"
                                value={tollStationFormData.soTax}
                                onChange={(e) => tollStationHandlers.handleFormChange('soTax', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Email:</label>
                              <input
                                type="email"
                                value={tollStationFormData.email}
                                onChange={(e) => tollStationHandlers.handleFormChange('email', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Địa chỉ:</label>
                              <input
                                type="text"
                                value={tollStationFormData.diaChi}
                                onChange={(e) => tollStationHandlers.handleFormChange('diaChi', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Cấp:</label>
                              <input
                                type="text"
                                value={tollStationFormData.cap}
                                onChange={(e) => tollStationHandlers.handleFormChange('cap', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Từ ngày:</label>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="date"
                                  value={tollStationFormData.tuNgay}
                                  onChange={(e) => tollStationHandlers.handleFormChange('tuNgay', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                />
                                <span className="self-center text-gray-700">Ngày kết thúc:</span>
                                <input
                                  type="date"
                                  value={tollStationFormData.ngayKetThuc}
                                  onChange={(e) => tollStationHandlers.handleFormChange('ngayKetThuc', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Trạng thái:</label>
                              <select
                                value={tollStationFormData.trangThai}
                                onChange={(e) => tollStationHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                              <button type="button" onClick={tollStationHandlers.handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                Đóng
                              </button>
                              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/storage-locations':
                const storageLocationsTotalPages = Math.ceil(filteredStorageLocationsList.length / itemsPerPage)
                const storageLocationsIndexOfLastItem = currentPage * itemsPerPage
                const storageLocationsIndexOfFirstItem = storageLocationsIndexOfLastItem - itemsPerPage
                const currentStorageLocations = filteredStorageLocationsList.slice(storageLocationsIndexOfFirstItem, storageLocationsIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddStorageLocationModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredStorageLocationsList.length}/{storageLocationsList.length} bản ghi - Trang: {currentPage}/{storageLocationsTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã lưu kho"
                              value={storageLocationSearchCode}
                              onChange={(e) => handleStorageLocationCodeSearch(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên kho"
                              value={storageLocationSearchName}
                              onChange={(e) => handleStorageLocationNameSearch(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN KHÁC</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐỊA CHỈ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOẠI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentStorageLocations.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{storageLocationsIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => storageLocationHandlers.handleViewDetail(item.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => storageLocationHandlers.handleDelete(item.id, item.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenKhac}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.diaChi}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.loai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <i className={`fas ${item.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {storageLocationsIndexOfFirstItem + 1}-{Math.min(storageLocationsIndexOfLastItem, filteredStorageLocationsList.length)} của {filteredStorageLocationsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(storageLocationsTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === storageLocationsTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === storageLocationsTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddStorageLocationModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin địa điểm lưu kho</h2>
                          
                          <form onSubmit={storageLocationHandlers.handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã<span className="text-red-500">*</span>:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.code}
                                onChange={(e) => storageLocationHandlers.handleFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                                required
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên<span className="text-red-500">*</span>:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.name}
                                onChange={(e) => storageLocationHandlers.handleFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                                required
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên khác:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.tenKhac}
                                onChange={(e) => storageLocationHandlers.handleFormChange('tenKhac', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Địa chỉ:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.diaChi}
                                onChange={(e) => storageLocationHandlers.handleFormChange('diaChi', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên kho:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.tenKho}
                                onChange={(e) => storageLocationHandlers.handleFormChange('tenKho', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã HQ:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.maHQ}
                                onChange={(e) => storageLocationHandlers.handleFormChange('maHQ', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-start gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">Diễn giải:</label>
                              <textarea
                                value={storageLocationFormData.dienGiai}
                                onChange={(e) => storageLocationHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Hiện thị:</label>
                              <select
                                value={storageLocationFormData.hienThi}
                                onChange={(e) => storageLocationHandlers.handleFormChange('hienThi', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Địa chỉ:</label>
                              <input
                                type="text"
                                value={storageLocationFormData.diaHau}
                                onChange={(e) => storageLocationHandlers.handleFormChange('diaHau', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-start gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4 pt-2">Ghi chú:</label>
                              <textarea
                                value={storageLocationFormData.ghiChu}
                                onChange={(e) => storageLocationHandlers.handleFormChange('ghiChu', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={3}
                                placeholder=""
                              />
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                              <button type="button" onClick={storageLocationHandlers.handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                Đóng
                              </button>
                              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/enterprises':
                return generateCatalogPage({
                  list: enterprisesList, showModal: showAddEnterpriseModal, setShowModal: setShowAddEnterpriseModal,
                  formData: enterpriseFormData, ...enterpriseHandlers,
                  title: 'Danh mục doanh nghiệp', searchPlaceholder: 'Tên doanh nghiệp'
                })
              case '/system/transport-methods':
                const transportMethodsTotalPages = Math.ceil(filteredTransportMethodsList.length / itemsPerPage)
                const transportMethodsIndexOfLastItem = currentPage * itemsPerPage
                const transportMethodsIndexOfFirstItem = transportMethodsIndexOfLastItem - itemsPerPage
                const currentTransportMethods = filteredTransportMethodsList.slice(transportMethodsIndexOfFirstItem, transportMethodsIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddTransportMethodModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredTransportMethodsList.length}/{transportMethodsList.length} bản ghi - Trang: {currentPage}/{transportMethodsTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã phương thức"
                              value={transportMethodSearchCode}
                              onChange={(e) => handleTransportMethodCodeSearch(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            />
                            <input
                              type="text"
                              placeholder="Tên phương thức"
                              value={transportMethodSearchName}
                              onChange={(e) => handleTransportMethodNameSearch(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN KHÁC</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">VNACCS</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentTransportMethods.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{transportMethodsIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => transportMethodHandlers.handleViewDetail(item.name)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => transportMethodHandlers.handleDelete(item.id, item.name)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.code}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.name}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenKhac}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <i className={`fas ${item.isActive ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.naccs}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {transportMethodsIndexOfFirstItem + 1}-{Math.min(transportMethodsIndexOfLastItem, filteredTransportMethodsList.length)} của {filteredTransportMethodsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(transportMethodsTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === transportMethodsTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === transportMethodsTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddTransportMethodModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin phương thức vận chuyển</h2>
                          
                          <form onSubmit={transportMethodHandlers.handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.code}
                                onChange={(e) => transportMethodHandlers.handleFormChange('code', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.name}
                                onChange={(e) => transportMethodHandlers.handleFormChange('name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Tên khác:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.tenKhac}
                                onChange={(e) => transportMethodHandlers.handleFormChange('tenKhac', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Số TK:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.soTK}
                                onChange={(e) => transportMethodHandlers.handleFormChange('soTK', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã PH:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.maPH}
                                onChange={(e) => transportMethodHandlers.handleFormChange('maPH', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Mã HQ:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.maHQ}
                                onChange={(e) => transportMethodHandlers.handleFormChange('maHQ', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Năm ĐK:</label>
                              <input
                                type="text"
                                value={transportMethodFormData.namDK}
                                onChange={(e) => transportMethodHandlers.handleFormChange('namDK', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">VNACCS:</label>
                              <select
                                value={transportMethodFormData.vnaccs}
                                onChange={(e) => transportMethodHandlers.handleFormChange('vnaccs', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Có">Có</option>
                                <option value="Không">Không</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-1/4">Trạng thái:</label>
                              <select
                                value={transportMethodFormData.trangThai}
                                onChange={(e) => transportMethodHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                              <button type="button" onClick={transportMethodHandlers.handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                Đóng
                              </button>
                              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Lưu lại
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/receipt-templates':
                const receiptTemplatesTotalPages = Math.ceil(filteredReceiptTemplatesList.length / itemsPerPage)
                const receiptTemplatesIndexOfLastItem = currentPage * itemsPerPage
                const receiptTemplatesIndexOfFirstItem = receiptTemplatesIndexOfLastItem - itemsPerPage
                const currentReceiptTemplates = filteredReceiptTemplatesList.slice(receiptTemplatesIndexOfFirstItem, receiptTemplatesIndexOfLastItem)

                // Danh sách điểm thu phí cho dropdown
                const diemThuPhiOptions = [...new Set(receiptTemplatesList.map(item => item.diemThuPhi))].sort()

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddReceiptTemplateModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredReceiptTemplatesList.length}/{receiptTemplatesList.length} bản ghi - Trang: {currentPage}/{receiptTemplatesTotalPages}
                            </div>
                            <select
                              value={receiptTemplateSearchDiemThu}
                              onChange={(e) => handleReceiptTemplateSearchDiemThu(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
                            >
                              <option value="">-- Điểm thu thuế --</option>
                              {diemThuPhiOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="01B1O0-001"
                              value={receiptTemplateSearchCode}
                              onChange={(e) => handleReceiptTemplateSearchCode(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Ký hiệu"
                              value={receiptTemplateSearchKyHieu}
                              onChange={(e) => handleReceiptTemplateSearchKyHieu(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MẪU BIÊN LAI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">KÝ HIỆU</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TỪ SỐ - ĐẾN SỐ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGÀY HIỆU LỰC</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐIỂM THU PHÍ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHÁT HÀNH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGƯỜI TẠO</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentReceiptTemplates.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{receiptTemplatesIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => receiptTemplateHandlers.handleViewDetail(item.mauBL)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => receiptTemplateHandlers.handleDelete(item.id, item.mauBL)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.mauBL}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.kyHieuBL}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tuSo} - {item.denSo}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.ngayHieuLuc}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.diemThuPhi}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.trangThai === 'Đang sử dụng' ? 'bg-green-100 text-green-800' :
                                    item.trangThai === 'Chờ phê duyệt' ? 'bg-yellow-100 text-yellow-800' :
                                    item.trangThai === 'Chưa sử dụng' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {item.trangThai}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.phatHanh === 'Đã phát hành' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.phatHanh}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.nguoiTao}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {receiptTemplatesIndexOfFirstItem + 1}-{Math.min(receiptTemplatesIndexOfLastItem, filteredReceiptTemplatesList.length)} của {filteredReceiptTemplatesList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(receiptTemplatesTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === receiptTemplatesTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === receiptTemplatesTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddReceiptTemplateModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[900px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-xl font-bold text-gray-800 mb-8">Cập nhật mẫu - ký hiệu biên lai [Thêm mới]</h2>
                          
                          <form onSubmit={receiptTemplateHandlers.handleSubmit} className="space-y-6">
                            {/* Row 1: Mẫu BL và Ký hiệu BL */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-24">Mẫu BL<span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  value={receiptTemplateFormData.mauBL}
                                  onChange={(e) => receiptTemplateHandlers.handleFormChange('mauBL', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                  placeholder=""
                                />
                              </div>
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-24">Ký hiệu BL<span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  value={receiptTemplateFormData.kyHieuBL}
                                  onChange={(e) => receiptTemplateHandlers.handleFormChange('kyHieuBL', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                  placeholder=""
                                />
                              </div>
                            </div>

                            {/* Row 2: Từ số và Đến số */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-24">Từ số</label>
                                <input
                                  type="text"
                                  value={receiptTemplateFormData.tuSo}
                                  onChange={(e) => receiptTemplateHandlers.handleFormChange('tuSo', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                  placeholder=""
                                />
                              </div>
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-24">Đến số</label>
                                <input
                                  type="text"
                                  value={receiptTemplateFormData.denSo}
                                  onChange={(e) => receiptTemplateHandlers.handleFormChange('denSo', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                  placeholder=""
                                />
                              </div>
                            </div>

                            {/* Row 3: Ngày hiệu lực */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-28">Ngày hiệu lực</label>
                              <input
                                type="date"
                                value={receiptTemplateFormData.ngayHieuLuc}
                                onChange={(e) => receiptTemplateHandlers.handleFormChange('ngayHieuLuc', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Row 4: Điểm thu phí */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-28">Điểm thu phí<span className="text-red-500">*</span></label>
                              <select
                                value={receiptTemplateFormData.diemThuPhi}
                                onChange={(e) => receiptTemplateHandlers.handleFormChange('diemThuPhi', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="">-- Chọn trạm thu phí --</option>
                                {diemThuPhiOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>

                            {/* Row 5: Ghi chú */}
                            <div className="flex gap-4">
                              <label className="text-sm font-medium text-gray-700 w-28 pt-2">Ghi chú</label>
                              <textarea
                                value={receiptTemplateFormData.ghiChu}
                                onChange={(e) => receiptTemplateHandlers.handleFormChange('ghiChu', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder=""
                              />
                            </div>

                            {/* Row 6: Trạng thái và Phát hành */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-24">Trạng thái</label>
                                <select
                                  value={receiptTemplateFormData.trangThai}
                                  onChange={(e) => receiptTemplateHandlers.handleFormChange('trangThai', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="Chưa sử dụng">Chưa sử dụng</option>
                                  <option value="Đang sử dụng">Đang sử dụng</option>
                                  <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                  <option value="Hết hiệu lực">Hết hiệu lực</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 w-20">Phát hành:</label>
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="phatHanh"
                                      value="Chưa phát hành"
                                      checked={receiptTemplateFormData.phatHanh === 'Chưa phát hành'}
                                      onChange={(e) => receiptTemplateHandlers.handleFormChange('phatHanh', e.target.value)}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Chưa phát hành</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="phatHanh"
                                      value="Đã phát hành"
                                      checked={receiptTemplateFormData.phatHanh === 'Đã phát hành'}
                                      onChange={(e) => receiptTemplateHandlers.handleFormChange('phatHanh', e.target.value)}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Đã phát hành</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={receiptTemplateHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/tariff-types':
                return generateCatalogPage({
                  list: tariffTypesList, showModal: showAddTariffTypeModal, setShowModal: setShowAddTariffTypeModal,
                  formData: tariffTypeFormData, ...tariffTypeHandlers,
                  title: 'Danh mục loại biểu cước', searchPlaceholder: 'Tên loại biểu cước'
                })
              case '/system/tariffs':
                const tariffsTotalPages = Math.ceil(filteredTariffsList.length / itemsPerPage)
                const tariffsIndexOfLastItem = currentPage * itemsPerPage
                const tariffsIndexOfFirstItem = tariffsIndexOfLastItem - itemsPerPage
                const currentTariffs = filteredTariffsList.slice(tariffsIndexOfFirstItem, tariffsIndexOfLastItem)

                // Danh sách biểu cước cho dropdown
                const bieuCuocOptions = [...new Set(tariffsList.map(item => item.bieuCuoc))].sort()
                const bieuCuocThueOptions = [...new Set(tariffsList.map(item => item.bieuCuocThue))].sort()

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddTariffModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredTariffsList.length}/{tariffsList.length} bản ghi - Trang: {currentPage}/{tariffsTotalPages}
                            </div>
                            <select
                              value={tariffSearchBieuCuoc}
                              onChange={(e) => handleTariffSearchBieuCuoc(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            >
                              <option value="">-- Biểu cước --</option>
                              {bieuCuocOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                            <select
                              value={tariffSearchBieuCuocThue}
                              onChange={(e) => handleTariffSearchBieuCuocThue(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            >
                              <option value="">-- Biểu cước thuế --</option>
                              {bieuCuocThueOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Mã biểu cước"
                              value={tariffSearchMaBieuCuoc}
                              onChange={(e) => handleTariffSearchMaBieuCuoc(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Tên biểu cước"
                              value={tariffSearchTenBieuCuoc}
                              onChange={(e) => handleTariffSearchTenBieuCuoc(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ BIỂU CƯỚC</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN BIỂU CƯỚC</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NHÓM LOẠI HÌNH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOẠI CONT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÍNH CHẤT CONT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐVT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HÀNG</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">SORT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ĐƠN GIÁ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentTariffs.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{tariffsIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => tariffHandlers.handleViewDetail(item.tenBieuCuoc)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => tariffHandlers.handleDelete(item.id, item.tenBieuCuoc)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maBieuCuoc}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenBieuCuoc}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.nhomLoaiHinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.loaiCont}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tinhChatCont}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dvt}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.hang}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.sort}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{parseInt(item.donGia).toLocaleString('vi-VN')} VNĐ</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {tariffsIndexOfFirstItem + 1}-{Math.min(tariffsIndexOfLastItem, filteredTariffsList.length)} của {filteredTariffsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(tariffsTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === tariffsTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === tariffsTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddTariffModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-xl font-bold text-gray-800 mb-8">Cập nhật thông tin biểu cước</h2>
                          
                          <form onSubmit={tariffHandlers.handleSubmit} className="space-y-4">
                            {/* Mã biểu cước */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Mã biểu cước:</label>
                              <input
                                type="text"
                                value={tariffFormData.maBieuCuoc}
                                onChange={(e) => tariffHandlers.handleFormChange('maBieuCuoc', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Tên biểu cước */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Tên biểu cước:</label>
                              <input
                                type="text"
                                value={tariffFormData.tenBieuCuoc}
                                onChange={(e) => tariffHandlers.handleFormChange('tenBieuCuoc', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* ĐVT biểu cước */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">ĐVT biểu cước:</label>
                              <select
                                value={tariffFormData.dvtBieuCuoc}
                                onChange={(e) => tariffHandlers.handleFormChange('dvtBieuCuoc', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Chuyến">Chuyến</option>
                                <option value="Tấn">Tấn</option>
                                <option value="m3">m3</option>
                                <option value="Kg">Kg</option>
                                <option value="Lượt">Lượt</option>
                              </select>
                            </div>

                            {/* Nhóm loại hình */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Nhóm loại hình:</label>
                              <select
                                value={tariffFormData.nhomLoaiHinh}
                                onChange={(e) => tariffHandlers.handleFormChange('nhomLoaiHinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Container đầy">Container đầy</option>
                                <option value="Container rỗng">Container rỗng</option>
                                <option value="Container lẻ">Container lẻ</option>
                                <option value="Rơ moóc">Rơ moóc</option>
                                <option value="Xe tải">Xe tải</option>
                                <option value="Container lạnh">Container lạnh</option>
                                <option value="Container tank">Container tank</option>
                              </select>
                            </div>

                            {/* Loại hàng */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Loại hàng:</label>
                              <select
                                value={tariffFormData.loaiHang}
                                onChange={(e) => tariffHandlers.handleFormChange('loaiHang', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Hàng tổng hợp">Hàng tổng hợp</option>
                                <option value="Hàng đặc biệt">Hàng đặc biệt</option>
                                <option value="Hàng lạnh">Hàng lạnh</option>
                                <option value="Hàng nguy hiểm">Hàng nguy hiểm</option>
                                <option value="Hàng siêu trường">Hàng siêu trường</option>
                                <option value="Hàng xuất khẩu">Hàng xuất khẩu</option>
                                <option value="Hàng nhập khẩu">Hàng nhập khẩu</option>
                                <option value="Hàng nội địa">Hàng nội địa</option>
                              </select>
                            </div>

                            {/* Đơn giá */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Đơn giá:</label>
                              <input
                                type="text"
                                value={tariffFormData.donGia}
                                onChange={(e) => tariffHandlers.handleFormChange('donGia', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* STT */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">STT:</label>
                              <input
                                type="text"
                                value={tariffFormData.stt}
                                onChange={(e) => tariffHandlers.handleFormChange('stt', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Diễn giải */}
                            <div className="flex gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32 pt-2">Diễn giải:</label>
                              <textarea
                                value={tariffFormData.dienGiai}
                                onChange={(e) => tariffHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={3}
                                placeholder=""
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-32">Trạng thái:</label>
                              <select
                                value={tariffFormData.trangThai}
                                onChange={(e) => tariffHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={tariffHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/form-types':
                const formTypesTotalPages = Math.ceil(filteredFormTypesList.length / itemsPerPage)
                const formTypesIndexOfLastItem = currentPage * itemsPerPage
                const formTypesIndexOfFirstItem = formTypesIndexOfLastItem - itemsPerPage
                const currentFormTypes = filteredFormTypesList.slice(formTypesIndexOfFirstItem, formTypesIndexOfLastItem)

                // Danh sách nhóm loại hình cho dropdown
                const nhomLoaiHinhOptions = [...new Set(formTypesList.map(item => item.nhomLoaiHinh))].sort()

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddFormTypeModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredFormTypesList.length}/{formTypesList.length} bản ghi - Trang: {currentPage}/{formTypesTotalPages}
                            </div>
                            <select
                              value={formTypeSearchNhom}
                              onChange={(e) => handleFormTypeSearchNhom(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
                            >
                              <option value="">-- Nhóm loại hình --</option>
                              {nhomLoaiHinhOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Mã loại hình"
                              value={formTypeSearchMa}
                              onChange={(e) => handleFormTypeSearchMa(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Tên loại hình"
                              value={formTypeSearchTen}
                              onChange={(e) => handleFormTypeSearchTen(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NHÓM LOẠI HÌNH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ LOẠI HÌNH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN LOẠI HÌNH</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentFormTypes.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{formTypesIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => formTypeHandlers.handleViewDetail(item.tenLoaiHinh)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => formTypeHandlers.handleDelete(item.id, item.tenLoaiHinh)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.nhomLoaiHinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maLoaiHinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenLoaiHinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {formTypesIndexOfFirstItem + 1}-{Math.min(formTypesIndexOfLastItem, filteredFormTypesList.length)} của {filteredFormTypesList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(formTypesTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === formTypesTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === formTypesTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddFormTypeModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-xl font-bold text-gray-800 mb-8">Cập nhật thông tin loại hình</h2>
                          
                          <form onSubmit={formTypeHandlers.handleSubmit} className="space-y-4">
                            {/* Nhóm LH */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-24">Nhóm LH:</label>
                              <select
                                value={formTypeFormData.nhomLoaiHinh}
                                onChange={(e) => formTypeHandlers.handleFormChange('nhomLoaiHinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Xuất nhập khẩu">Xuất nhập khẩu</option>
                                <option value="Nội địa">Nội địa</option>
                                <option value="Quá cảnh">Quá cảnh</option>
                                <option value="Đặc biệt">Đặc biệt</option>
                              </select>
                            </div>

                            {/* Mã LH */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-24">Mã LH:</label>
                              <input
                                type="text"
                                value={formTypeFormData.maLoaiHinh}
                                onChange={(e) => formTypeHandlers.handleFormChange('maLoaiHinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Tên LH */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-24">Tên LH:</label>
                              <input
                                type="text"
                                value={formTypeFormData.tenLoaiHinh}
                                onChange={(e) => formTypeHandlers.handleFormChange('tenLoaiHinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Diễn giải */}
                            <div className="flex gap-4">
                              <label className="text-sm font-medium text-gray-700 w-24 pt-2">Diễn giải:</label>
                              <textarea
                                value={formTypeFormData.dienGiai}
                                onChange={(e) => formTypeHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder=""
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-24">Trạng thái:</label>
                              <select
                                value={formTypeFormData.trangThai}
                                onChange={(e) => formTypeHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={formTypeHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/payment-types':
                const paymentTypesTotalPages = Math.ceil(filteredPaymentTypesList.length / itemsPerPage)
                const paymentTypesIndexOfLastItem = currentPage * itemsPerPage
                const paymentTypesIndexOfFirstItem = paymentTypesIndexOfLastItem - itemsPerPage
                const currentPaymentTypes = filteredPaymentTypesList.slice(paymentTypesIndexOfFirstItem, paymentTypesIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddPaymentTypeModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredPaymentTypesList.length}/{paymentTypesList.length} bản ghi - Trang: {currentPage}/{paymentTypesTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã loại thanh toán"
                              value={paymentTypeSearchMa}
                              onChange={(e) => handlePaymentTypeSearchMa(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-36"
                            />
                            <input
                              type="text"
                              placeholder="Tên loại thanh toán"
                              value={paymentTypeSearchTen}
                              onChange={(e) => handlePaymentTypeSearchTen(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-36"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ LOẠI THANH TOÁN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN LOẠI THANH TOÁN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentPaymentTypes.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{paymentTypesIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => paymentTypeHandlers.handleViewDetail(item.tenLoaiThanhToan)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => paymentTypeHandlers.handleDelete(item.id, item.tenLoaiThanhToan)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maLoaiThanhToan}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenLoaiThanhToan}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {paymentTypesIndexOfFirstItem + 1}-{Math.min(paymentTypesIndexOfLastItem, filteredPaymentTypesList.length)} của {filteredPaymentTypesList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(paymentTypesTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === paymentTypesTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === paymentTypesTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddPaymentTypeModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-xl font-bold text-gray-800 mb-8">Cập nhật thông tin loại thanh toán</h2>
                          
                          <form onSubmit={paymentTypeHandlers.handleSubmit} className="space-y-4">
                            {/* Mã */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-20">Mã:</label>
                              <input
                                type="text"
                                value={paymentTypeFormData.maLoaiThanhToan}
                                onChange={(e) => paymentTypeHandlers.handleFormChange('maLoaiThanhToan', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Tên */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-20">Tên:</label>
                              <input
                                type="text"
                                value={paymentTypeFormData.tenLoaiThanhToan}
                                onChange={(e) => paymentTypeHandlers.handleFormChange('tenLoaiThanhToan', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder=""
                              />
                            </div>

                            {/* Diễn giải */}
                            <div className="flex gap-4">
                              <label className="text-sm font-medium text-gray-700 w-20 pt-2">Diễn giải:</label>
                              <textarea
                                value={paymentTypeFormData.dienGiai}
                                onChange={(e) => paymentTypeHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder=""
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm font-medium text-gray-700 w-20">Trạng thái:</label>
                              <select
                                value={paymentTypeFormData.trangThai}
                                onChange={(e) => paymentTypeHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={paymentTypeHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/container-types':
                const containerTypesTotalPages = Math.ceil(filteredContainerTypesList.length / itemsPerPage)
                const containerTypesIndexOfLastItem = currentPage * itemsPerPage
                const containerTypesIndexOfFirstItem = containerTypesIndexOfLastItem - itemsPerPage
                const currentContainerTypes = filteredContainerTypesList.slice(containerTypesIndexOfFirstItem, containerTypesIndexOfLastItem)

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddContainerTypeModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredContainerTypesList.length}/{containerTypesList.length} bản ghi - Trang: {currentPage}/{containerTypesTotalPages}
                            </div>
                            <input
                              type="text"
                              placeholder="Mã loại cont"
                              value={containerTypeSearchMa}
                              onChange={(e) => handleContainerTypeSearchMa(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Tên loại cont"
                              value={containerTypeSearchTen}
                              onChange={(e) => handleContainerTypeSearchTen(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentContainerTypes.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{containerTypesIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => containerTypeHandlers.handleViewDetail(item.tenLoaiContainer)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => containerTypeHandlers.handleDelete(item.id, item.tenLoaiContainer)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maLoaiContainer}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenLoaiContainer}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {containerTypesIndexOfFirstItem + 1}-{Math.min(containerTypesIndexOfLastItem, filteredContainerTypesList.length)} của {filteredContainerTypesList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(containerTypesTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === containerTypesTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === containerTypesTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddContainerTypeModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-semibold text-gray-800 mb-6">Cập nhật thông tin loại container</h2>
                          
                          <form onSubmit={containerTypeHandlers.handleSubmit} className="space-y-4">
                            {/* Mã */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-20">Mã:</label>
                              <input
                                type="text"
                                value={containerTypeFormData.maLoaiContainer}
                                onChange={(e) => containerTypeHandlers.handleFormChange('maLoaiContainer', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder=""
                              />
                            </div>

                            {/* Tên */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-20">Tên:</label>
                              <input
                                type="text"
                                value={containerTypeFormData.tenLoaiContainer}
                                onChange={(e) => containerTypeHandlers.handleFormChange('tenLoaiContainer', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder=""
                              />
                            </div>

                            {/* Diễn giải */}
                            <div className="flex gap-3">
                              <label className="text-sm font-medium text-gray-700 w-20 pt-2">Diễn giải:</label>
                              <textarea
                                value={containerTypeFormData.dienGiai}
                                onChange={(e) => containerTypeHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                                rows={3}
                                placeholder=""
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-20">Trạng thái:</label>
                              <select
                                value={containerTypeFormData.trangThai}
                                onChange={(e) => containerTypeHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={containerTypeHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              case '/system/units':
                const unitsTotalPages = Math.ceil(filteredUnitsList.length / itemsPerPage)
                const unitsIndexOfLastItem = currentPage * itemsPerPage
                const unitsIndexOfFirstItem = unitsIndexOfLastItem - itemsPerPage
                const currentUnits = filteredUnitsList.slice(unitsIndexOfFirstItem, unitsIndexOfLastItem)

                // Danh sách loại đơn vị tính cho dropdown
                const loaiDonViTinhOptions = [...new Set(unitsList.map(item => item.loaiDonViTinh))].sort()

                return (
                  <div className="space-y-4">
                    {/* Header với filter */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setShowAddUnitModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm mới
                          </button>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Có {filteredUnitsList.length}/{unitsList.length} bản ghi - Trang: {currentPage}/{unitsTotalPages}
                            </div>
                            <select
                              value={unitSearchDonViTinh}
                              onChange={(e) => handleUnitSearchDonViTinh(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            >
                              <option value="">-- Đơn vị tính --</option>
                              {loaiDonViTinhOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Mã đơn vị tính"
                              value={unitSearchMa}
                              onChange={(e) => handleUnitSearchMa(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Tên đơn vị tính"
                              value={unitSearchTen}
                              onChange={(e) => handleUnitSearchTen(e.target.value)}
                              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                            />
                            <button 
                              onClick={() => setCurrentPage(1)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                            >
                              <i className="fas fa-search mr-2"></i>
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bảng dữ liệu */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ ĐVT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">TÊN ĐVT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOẠI ĐVT</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DIỄN GIẢI</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HIỂN THỊ</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentUnits.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-xs text-gray-900">{unitsIndexOfFirstItem + index + 1}</td>
                                <td className="px-3 py-3 text-xs">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => unitHandlers.handleViewDetail(item.tenDonViTinh)}
                                      className="text-blue-500 hover:text-blue-700" 
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button 
                                      onClick={() => unitHandlers.handleDelete(item.id, item.tenDonViTinh)}
                                      className="text-red-500 hover:text-red-700" 
                                      title="Xóa"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.maDonViTinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.tenDonViTinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.loaiDonViTinh}</td>
                                <td className="px-3 py-3 text-xs text-gray-900">{item.dienGiai}</td>
                                <td className="px-3 py-3 text-xs">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Hiển thị {unitsIndexOfFirstItem + 1}-{Math.min(unitsIndexOfLastItem, filteredUnitsList.length)} của {filteredUnitsList.length} bản ghi
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Trước
                              </button>
                              
                              {[...Array(unitsTotalPages)].map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                                      currentPage === pageNumber ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                )
                              })}
                              
                              <button 
                                onClick={handleNextPage}
                                disabled={currentPage === unitsTotalPages}
                                className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${currentPage === unitsTotalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Sau
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    {showAddUnitModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg font-semibold text-gray-800 mb-6">Cập nhật thông tin ĐVT</h2>
                          
                          <form onSubmit={unitHandlers.handleSubmit} className="space-y-4">
                            {/* Mã ĐVT */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-24">Mã ĐVT:</label>
                              <input
                                type="text"
                                value={unitFormData.maDonViTinh}
                                onChange={(e) => unitHandlers.handleFormChange('maDonViTinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder=""
                              />
                            </div>

                            {/* Tên ĐVT */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-24">Tên ĐVT:</label>
                              <input
                                type="text"
                                value={unitFormData.tenDonViTinh}
                                onChange={(e) => unitHandlers.handleFormChange('tenDonViTinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder=""
                              />
                            </div>

                            {/* Loại đơn vị tính */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-24">Loại đơn vị tính:</label>
                              <select
                                value={unitFormData.loaiDonViTinh}
                                onChange={(e) => unitHandlers.handleFormChange('loaiDonViTinh', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Hàng container">Hàng container</option>
                                <option value="Khối lượng">Khối lượng</option>
                                <option value="Thể tích">Thể tích</option>
                                <option value="Số lượng">Số lượng</option>
                                <option value="Chiều dài">Chiều dài</option>
                                <option value="Thời gian">Thời gian</option>
                                <option value="Diện tích">Diện tích</option>
                                <option value="Tỷ lệ">Tỷ lệ</option>
                              </select>
                            </div>

                            {/* Diễn giải */}
                            <div className="flex gap-3">
                              <label className="text-sm font-medium text-gray-700 w-24 pt-2">Diễn giải:</label>
                              <textarea
                                value={unitFormData.dienGiai}
                                onChange={(e) => unitHandlers.handleFormChange('dienGiai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                                rows={3}
                                placeholder=""
                              />
                            </div>

                            {/* Trạng thái */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 w-24">Trạng thái:</label>
                              <select
                                value={unitFormData.trangThai}
                                onChange={(e) => unitHandlers.handleFormChange('trangThai', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                              >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t mt-6">
                              <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                                Lưu lại
                              </button>
                              <button type="button" onClick={unitHandlers.handleClose} className="px-8 py-3 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
                                Đóng
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              default:
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                      <h3 className="font-semibold text-gray-800">Quản lý người dùng</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý tài khoản người dùng</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                      <h3 className="font-semibold text-gray-800">Quản lý thông tin doanh nghiệp</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý thông tin và cài đặt doanh nghiệp</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                      <h3 className="font-semibold text-gray-800">Đổi mật khẩu</h3>
                      <p className="text-sm text-gray-600 mt-2">Thay đổi mật khẩu đăng nhập</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800">Danh mục hải quan</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý danh sách chi cục hải quan</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                      <h3 className="font-semibold text-gray-800">Danh mục ngân hàng TM</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý danh sách ngân hàng thương mại</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                      <h3 className="font-semibold text-gray-800">Danh mục Kho/Bãi/Cảng</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý danh sách kho bãi cảng</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-pink-500">
                      <h3 className="font-semibold text-gray-800">Danh mục trạm thu phí</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý danh sách trạm thu phí</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                      <h3 className="font-semibold text-gray-800">Danh mục địa điểm lưu kho</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý địa điểm lưu kho</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-teal-500">
                      <h3 className="font-semibold text-gray-800">Danh mục doanh nghiệp</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý danh sách doanh nghiệp</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-cyan-500">
                      <h3 className="font-semibold text-gray-800">Danh mục phương thức vận chuyển</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý phương thức vận chuyển</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500">
                      <h3 className="font-semibold text-gray-800">Danh mục mẫu ký hiệu biên lai</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý mẫu ký hiệu biên lai</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-lime-500">
                      <h3 className="font-semibold text-gray-800">Danh mục loại biểu cước</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý loại biểu cước</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
                      <h3 className="font-semibold text-gray-800">Danh mục biểu cước</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý biểu cước vận tải</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-violet-500">
                      <h3 className="font-semibold text-gray-800">Danh mục loại hình</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý loại hình hoạt động</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-rose-500">
                      <h3 className="font-semibold text-gray-800">Danh mục loại thanh toán</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý loại hình thanh toán</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-slate-500">
                      <h3 className="font-semibold text-gray-800">Danh mục loại container</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý loại container</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-zinc-500">
                      <h3 className="font-semibold text-gray-800">Danh mục đơn vị tính</h3>
                      <p className="text-sm text-gray-600 mt-2">Quản lý đơn vị tính</p>
                    </div>
                  </div>
                )
    }
  }

    // Các trang sử dụng layout full width
  const fullWidthPages = [
    '/system/users', 
    '/system/business', 
    '/system/customs',
    '/system/banks',
    '/system/warehouses',
    '/system/toll-stations',
    '/system/storage-locations',
    '/system/enterprises',
    '/system/transport-methods',
    '/system/receipt-templates',
    '/system/tariff-types',
    '/system/tariffs',
    '/system/form-types',
    '/system/payment-types',
    '/system/container-types',
    '/system/units'
  ]
  const isFullWidthPage = fullWidthPages.includes(location.pathname)

  return (
    <>
      {isFullWidthPage ? (
        // Layout full màn hình cho các trang con
        <div className="h-full">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <i className={`${
                location.pathname === '/system/users' ? 'fas fa-users' : 
                location.pathname === '/system/business' ? 'fas fa-building' : 
                location.pathname === '/system/customs' ? 'fas fa-ship' : 
                location.pathname === '/system/banks' ? 'fas fa-university' : 
                location.pathname === '/system/warehouses' ? 'fas fa-warehouse' : 
                location.pathname === '/system/toll-stations' ? 'fas fa-road' : 
                location.pathname === '/system/storage-locations' ? 'fas fa-map-marker' : 
                location.pathname === '/system/enterprises' ? 'fas fa-industry' : 
                location.pathname === '/system/transport-methods' ? 'fas fa-truck' : 
                location.pathname === '/system/receipt-templates' ? 'fas fa-receipt' : 
                location.pathname === '/system/tariff-types' ? 'fas fa-tags' : 
                location.pathname === '/system/tariffs' ? 'fas fa-money-bill' : 
                location.pathname === '/system/form-types' ? 'fas fa-file-alt' : 
                location.pathname === '/system/payment-types' ? 'fas fa-credit-card' : 
                location.pathname === '/system/container-types' ? 'fas fa-box' : 
                location.pathname === '/system/units' ? 'fas fa-calculator' : 
                'fas fa-cogs'
              } text-blue-500 mr-3`}></i>
              {getPageTitle()}
            </h1>
          </div>
          <div className="p-4">
            {getPageContent()}
          </div>
        </div>
      ) : (
        // Layout thường cho trang chính và đổi mật khẩu
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <i className="fas fa-cogs text-blue-500 mr-3"></i>
              {getPageTitle()}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {getPageContent()}
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && detailModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">{detailModalTitle}</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                title="Đóng"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(detailModalData).map(([key, value]) => {
                if (key === 'id') return null // Skip ID field
                
                let displayKey = key
                let displayValue = value
                
                // Format field names to Vietnamese
                const fieldMapping: { [key: string]: string } = {
                  'username': 'Tài khoản',
                  'fullName': 'Họ và tên',
                  'department': 'Phòng ban',
                  'position': 'Chức vụ',
                  'functionGroup': 'Nhóm chức năng',
                  'isActive': 'Trạng thái',
                  'code': 'Mã',
                  'name': 'Tên',
                  'description': 'Mô tả/Diễn giải',
                  'address': 'Địa chỉ',
                  'phone': 'Số điện thoại',
                  'fax': 'Số fax',
                  'level': 'Cấp độ',
                  'status': 'Trạng thái',
                  'maHaiQuan': 'Mã hải quan',
                  'maCangKhu': 'Mã cảng/khu',
                  'ghiChu': 'Ghi chú',
                  'tenKhac': 'Tên khác',
                  'loai': 'Loại',
                  'maTramThuPhi': 'Mã trạm thu phí',
                  'tenTramThuPhi': 'Tên trạm thu phí',
                  'maSoThue': 'Mã số thuế',
                  'tenGiaoDich': 'Tên giao dịch',
                  'soTax': 'Số Tax',
                  'maLuuKho': 'Mã lưu kho',
                  'tenKho': 'Tên kho',
                  'maPhuongThuc': 'Mã phương thức',
                  'tenPhuongThuc': 'Tên phương thức',
                  'namDangKy': 'Năm đăng ký',
                  'vnaccs': 'VNACCS',
                  'trangThai': 'Trạng thái',
                  'mauBienLai': 'Mẫu biên lai',
                  'kiHieu': 'Ký hiệu',
                  'tuSo': 'Từ số',
                  'denSo': 'Đến số',
                  'ngayHieuLuc': 'Ngày hiệu lực',
                  'diemThuPhi': 'Điểm thu phí',
                  'nguoiTao': 'Người tạo',
                  'maBieuCuoc': 'Mã biểu cước',
                  'tenBieuCuoc': 'Tên biểu cước',
                  'nhomLoaiHinh': 'Nhóm loại hình',
                  'loaiContainer': 'Loại container',
                  'tinhChatContainer': 'Tính chất container',
                  'donViTinh': 'Đơn vị tính',
                  'hang': 'Hàng',
                  'sort': 'Sắp xếp',
                  'donGia': 'Đơn giá',
                  'maLoaiHinh': 'Mã loại hình',
                  'tenLoaiHinh': 'Tên loại hình',
                  'dienGiai': 'Diễn giải',
                  'maLoaiThanhToan': 'Mã loại thanh toán',
                  'tenLoaiThanhToan': 'Tên loại thanh toán',
                  'maLoaiContainer': 'Mã loại container',
                  'tenLoaiContainer': 'Tên loại container',
                  'maDonViTinh': 'Mã đơn vị tính',
                  'tenDonViTinh': 'Tên đơn vị tính',
                  'loaiDonViTinh': 'Loại đơn vị tính'
                }
                
                displayKey = fieldMapping[key] || key
                
                // Format boolean values
                if (typeof value === 'boolean') {
                  displayValue = value ? 'Có/Hoạt động' : 'Không/Không hoạt động'
                }
                
                return (
                  <div key={key} className="flex">
                    <div className="w-1/3 font-medium text-gray-700 bg-gray-50 px-3 py-2 border">
                      {displayKey}:
                    </div>
                    <div className="w-2/3 px-3 py-2 border border-l-0">
                      {String(displayValue || '-')}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SystemPage
