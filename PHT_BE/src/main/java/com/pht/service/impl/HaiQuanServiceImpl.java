package com.pht.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.pht.model.request.LayThongTinHaiQuanRequest;
import com.pht.model.request.ParseHaiQuanDataRequest;
import com.pht.model.response.ChiTietHaiQuanResponse;
import com.pht.model.response.ThongTinHaiQuanResponse;
import com.pht.repository.SbieuCuocRepository;
import com.pht.service.HaiQuanService;
import com.pht.util.FileReaderUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HaiQuanServiceImpl implements HaiQuanService {

    private final FileReaderUtil fileReaderUtil;
    private final SbieuCuocRepository sbieuCuocRepository;

    @Override
    public ThongTinHaiQuanResponse layThongTinHaiQuan(LayThongTinHaiQuanRequest request) {
        log.info("Lấy thông tin hải quan cho số tờ khai: {}, mã doanh nghiệp: {}", 
                request.getSoToKhaiHaiQuan(), request.getMaDoanhNghiep());
        
        // Validate input
        if (request.getMaDoanhNghiep() == null || request.getMaDoanhNghiep().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã doanh nghiệp không được để trống");
        }
        if (request.getSoToKhaiHaiQuan() == null || request.getSoToKhaiHaiQuan().trim().isEmpty()) {
            throw new IllegalArgumentException("Số tờ khai hải quan không được để trống");
        }
        
        try {
            // Tạo tên file XML dựa trên thông tin request
            // Format: 320_{maDoanhNghiep}_{soToKhaiHaiQuan}.xml
            String fileName = String.format("320_%s_%s.xml", 
                    request.getMaDoanhNghiep().trim(), 
                    request.getSoToKhaiHaiQuan().trim());
            
            log.info("Tìm file XML với tên: {}", fileName);
            
            // Đọc file XML từ đường dẫn
            String filePath = "C:\\IDA\\HQ\\" + fileName;
            String xmlContent = fileReaderUtil.readFileContentByPath(filePath);
            
            if (xmlContent == null || xmlContent.isEmpty()) {
                log.warn("Không tìm thấy dữ liệu trong file: {}", fileName);
                return createEmptyResponse();
            }
            
            // Parse XML content thành response object
            ThongTinHaiQuanResponse response = parseXmlToResponse(xmlContent);
            
            // Validate dữ liệu trong XML có khớp với request không
            validateXmlDataWithRequest(response, request);
            
            log.info("Trả về thông tin hải quan thành công với {} chi tiết từ file: {}", 
                    response.getChiTietList() != null ? response.getChiTietList().size() : 0, fileName);
            return response;
            
        } catch (IOException e) {
            log.error("Lỗi khi đọc file XML: ", e);
            throw new RuntimeException("Lỗi khi đọc dữ liệu từ file XML: " + e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi khi xử lý dữ liệu hải quan: ", e);
            throw new RuntimeException("Lỗi khi xử lý dữ liệu hải quan: " + e.getMessage());
        }
    }

    @Override
    public ThongTinHaiQuanResponse parseHaiQuanResponse(ParseHaiQuanDataRequest request) {
        log.info("Parse response String từ Hải quan: {}", request.getHaiQuanResponse());
        
        try {
            String xmlResponse = request.getHaiQuanResponse();
            ThongTinHaiQuanResponse response = parseXmlToResponse(xmlResponse);
            
            log.info("Parse thành công với {} chi tiết", 
                    response.getChiTietList() != null ? response.getChiTietList().size() : 0);
            return response;
            
        } catch (Exception e) {
            log.error("Lỗi khi parse response từ Hải quan: ", e);
            throw new RuntimeException("Lỗi khi parse dữ liệu từ Hải quan: " + e.getMessage());
        }
    }

    
    /**
     * Parse XML content thành response object
     */
    private ThongTinHaiQuanResponse parseXmlToResponse(String xmlContent) {
        ThongTinHaiQuanResponse response = new ThongTinHaiQuanResponse();
        
        // Thông tin chính
        response.setId(1L);
        response.setNguonTK(1); // Lấy từ hải quan
        
        // Parse doanh nghiệp
        response.setMaDoanhNghiepKhaiPhi(extractXmlValue(xmlContent, "Ma_DV"));
        response.setTenDoanhNghiepKhaiPhi(extractXmlValue(xmlContent, "Ten_DV"));
        response.setDiaChiKhaiPhi(extractXmlValue(xmlContent, "DiaChi"));
        
        // Doanh nghiệp XNK giống doanh nghiệp khai phí
        response.setMaDoanhNghiepXNK(extractXmlValue(xmlContent, "Ma_DV"));
        response.setTenDoanhNghiepXNK(extractXmlValue(xmlContent, "Ten_DV"));
        response.setDiaChiXNK(extractXmlValue(xmlContent, "DiaChi"));
        
        // Parse tờ khai hải quan
        response.setSoToKhai(extractXmlValue(xmlContent, "So_TK_HQ"));
        response.setNgayToKhai(parseDate(extractXmlValue(xmlContent, "Ngay_TK_HQ")));
        response.setMaHaiQuan(extractXmlValue(xmlContent, "Ma_HQ"));
        response.setMaLoaiHinh(extractXmlValue(xmlContent, "Ma_LH"));
        response.setMaLuuKho(""); // Chưa có trong XML
        response.setNuocXuatKhau(""); // Chưa có trong XML
        
        // THÔNG TIN HÀNG HÓA (chưa có trong XML, để trống)
        response.setMaPhuongThucVC("");
        response.setPhuongTienVC("");
        response.setMaDiaDiemXepHang("");
        response.setMaDiaDiemDoHang("");
        response.setMaPhanLoaiHangHoa("");
        response.setMucDichVC("");
        
        // Parse tờ khai phí
        response.setSoTiepNhanKhaiPhi("");
        response.setNgayKhaiPhi(LocalDate.now());
        response.setNhomLoaiPhi(extractXmlValue(xmlContent, "Ma_LoaiPhi"));
        response.setLoaiThanhToan("00");//CHUYEN KHOAN NGAN HANG
        response.setGhiChuKhaiPhi(extractXmlValue(xmlContent, "Ten_LoaiPhi"));
        
        // Parse thông tin thu phí
        String soTienStr = extractXmlValue(xmlContent, "SoTien_TO");
        if (soTienStr != null && !soTienStr.isEmpty()) {
            try {
                response.setTongTienPhi(new BigDecimal(soTienStr));
            } catch (NumberFormatException e) {
                log.warn("Không thể parse số tiền: {}", soTienStr);
                response.setTongTienPhi(BigDecimal.ZERO);
            }
        } else {
            response.setTongTienPhi(BigDecimal.ZERO);
        }
        
        response.setTrangThaiNganHang("00");//TRANG THAI CHUA GACH NO
        response.setSoThongBaoNopPhi(""); // Chưa có trong XML
        response.setSoBienLai(""); // Chưa có trong XML
        response.setNgayBienLai(null); // Chưa có trong XML
        response.setKyHieuBienLai(""); // Chưa có trong XML
        response.setMauBienLai(""); // Chưa có trong XML
        response.setMaTraCuuBienLai(""); // Chưa có trong XML
        response.setXemBienLai(""); // Chưa có trong XML
        
        // DANH MỤC LOẠI HÀNG MIỄN PHÍ
        response.setLoaiHangMienPhi(""); // Chưa có trong XML
        response.setLoaiHang(extractXmlValue(xmlContent, "Ma_LH"));
        response.setTrangThai("00");
        
        // Parse danh sách chi tiết từ ThongTinNopTien
        List<ChiTietHaiQuanResponse> chiTietList = parseChiTietList(xmlContent);
        response.setChiTietList(chiTietList);
        
        return response;
    }
    
    /**
     * Tạo response rỗng khi không tìm thấy dữ liệu
     */
    private ThongTinHaiQuanResponse createEmptyResponse() {
        ThongTinHaiQuanResponse response = new ThongTinHaiQuanResponse();
        response.setId(0L);
        response.setNguonTK(1);
        response.setTrangThai("Không tìm thấy dữ liệu");
        response.setChiTietList(new ArrayList<>());
        return response;
    }
    
    /**
     * Extract giá trị từ XML tag
     */
    private String extractXmlValue(String xml, String tagName) {
        Pattern pattern = Pattern.compile("<" + tagName + ">(.*?)</" + tagName + ">");
        Matcher matcher = pattern.matcher(xml);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "";
    }
    
    /**
     * Parse date từ string
     */
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            log.warn("Không thể parse date: {}", dateStr);
            return null;
        }
    }
    
    /**
     * Parse danh sách chi tiết từ ThongTinNopTien
     */
    private List<ChiTietHaiQuanResponse> parseChiTietList(String xml) {
        List<ChiTietHaiQuanResponse> chiTietList = new ArrayList<>();
        
        // Tìm tất cả các ThongTinNopTien
        Pattern pattern = Pattern.compile("<ThongTinNopTien>(.*?)</ThongTinNopTien>", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(xml);
        
        int index = 1;
        while (matcher.find()) {
            String chiTietXml = matcher.group(1);
            
            ChiTietHaiQuanResponse chiTiet = new ChiTietHaiQuanResponse();
            chiTiet.setId((long) index);
            chiTiet.setToKhaiThongTinID(1L);
            chiTiet.setSoVanDon(extractXmlValue(chiTietXml, "So_VD"));
            chiTiet.setSoHieu(extractXmlValue(chiTietXml, "So_Hieu_Container"));
            
            // Query MA_LOAI_CONT và MA_TC_CONT từ bảng SBIEU_CUOC
            String maBieuCuoc = extractXmlValue(chiTietXml, "Ma_BieuCuoc");
            if (maBieuCuoc != null && !maBieuCuoc.isEmpty()) {
                queryMaLoaiContAndMaTcCont(chiTiet, maBieuCuoc);
            }
            
            String soLuongStr = extractXmlValue(chiTietXml, "So_Luong");
            if (soLuongStr != null && !soLuongStr.isEmpty()) {
                chiTiet.setTongTrongLuong(new BigDecimal(soLuongStr));
            }
            
            chiTiet.setDonViTinh(extractXmlValue(chiTietXml, "Don_Vi_Tinh"));
            chiTiet.setGhiChu(extractXmlValue(chiTietXml, "Ten_BieuCuoc"));
            
            chiTietList.add(chiTiet);
            index++;
        }
        
        return chiTietList;
    }
    
    
    /**
     * Validate dữ liệu trong XML có khớp với request không
     */
    private void validateXmlDataWithRequest(ThongTinHaiQuanResponse response, LayThongTinHaiQuanRequest request) {
        log.info("Validate dữ liệu XML với request - maDoanhNghiep: {}, soToKhaiHaiQuan: {}", 
                request.getMaDoanhNghiep(), request.getSoToKhaiHaiQuan());
        
        // Kiểm tra mã doanh nghiệp
        if (response.getMaDoanhNghiepKhaiPhi() != null && 
            !response.getMaDoanhNghiepKhaiPhi().equals(request.getMaDoanhNghiep().trim())) {
            log.warn("Mã doanh nghiệp trong XML ('{}') không khớp với request ('{}')", 
                    response.getMaDoanhNghiepKhaiPhi(), request.getMaDoanhNghiep());
        }
        
        // Kiểm tra số tờ khai hải quan
        if (response.getSoToKhai() != null && 
            !response.getSoToKhai().equals(request.getSoToKhaiHaiQuan().trim())) {
            log.warn("Số tờ khai trong XML ('{}') không khớp với request ('{}')", 
                    response.getSoToKhai(), request.getSoToKhaiHaiQuan());
        }
        
        log.info("Validation hoàn tất");
    }
    
    /**
     * Query MA_LOAI_CONT và MA_TC_CONT từ bảng SBIEU_CUOC theo mã biểu cước
     */
    private void queryMaLoaiContAndMaTcCont(ChiTietHaiQuanResponse chiTiet, String maBieuCuoc) {
        try {
            log.info("Query MA_LOAI_CONT và MA_TC_CONT cho mã biểu cước: '{}'", maBieuCuoc);
            
            // Query từ SBIEU_CUOC theo mã biểu cước chính xác
            List<com.pht.entity.SbieuCuoc> bieuCuocList = sbieuCuocRepository.findByMaBieuCuoc(maBieuCuoc);
            
            log.info("Kết quả query: {} biểu cước tìm được cho mã: '{}'", bieuCuocList.size(), maBieuCuoc);
            
            if (!bieuCuocList.isEmpty()) {
                com.pht.entity.SbieuCuoc bieuCuoc = bieuCuocList.get(0);
                chiTiet.setMaLoaiCont(bieuCuoc.getMaLoaiCont());
                chiTiet.setMaTcCont(bieuCuoc.getMaTcCont());
                
                log.info("Tìm thấy MA_LOAI_CONT: '{}', MA_TC_CONT: '{}' cho mã biểu cước: '{}'", 
                        bieuCuoc.getMaLoaiCont(), bieuCuoc.getMaTcCont(), maBieuCuoc);
            } else {
                log.warn("Không tìm thấy biểu cước với mã: '{}'", maBieuCuoc);
                
                // Debug: Kiểm tra tất cả biểu cước có trong database
                log.info("Debug: Kiểm tra tất cả biểu cước trong database...");
                List<com.pht.entity.SbieuCuoc> allBieuCuoc = sbieuCuocRepository.findAllActive();
                log.info("Debug: Tìm thấy {} biểu cước với trạng thái = '1'", allBieuCuoc.size());
                for (com.pht.entity.SbieuCuoc bc : allBieuCuoc) {
                    log.info("Debug: maBieuCuoc='{}', maLoaiCont='{}', maTcCont='{}', trangThai='{}'", 
                            bc.getMaBieuCuoc(), bc.getMaLoaiCont(), bc.getMaTcCont(), bc.getTrangThai());
                }
                
                chiTiet.setMaLoaiCont("");
                chiTiet.setMaTcCont("");
            }
            
        } catch (Exception e) {
            log.error("Lỗi khi query MA_LOAI_CONT và MA_TC_CONT cho mã biểu cước: '{}'", maBieuCuoc, e);
            chiTiet.setMaLoaiCont("");
            chiTiet.setMaTcCont("");
        }
    }
}