package com.pht.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pht.entity.StoKhai;
import com.pht.model.request.BankWebhookRequest;
import com.pht.model.response.BankWebhookResponse;
import com.pht.repository.ToKhaiThongTinRepository;
import com.pht.service.BankWebhookService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class BankWebhookServiceImpl implements BankWebhookService {

    @Autowired
    private ToKhaiThongTinRepository toKhaiThongTinRepository;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public BankWebhookResponse processPaymentNotification(BankWebhookRequest request) {
        log.info("Nhận webhook từ ngân hàng: transId={}, amount={}, remark={}", 
                request.getTransId(), request.getAmount(), request.getRemark());
        
        try {
            // Chuyển đổi request thành JSON string để lưu vào tvsd_json
            String tvsdJson = objectMapper.writeValueAsString(request);
            log.info("Đã chuyển đổi request thành JSON: {}", tvsdJson);
            
            // Bóc tách remark để tìm mã doanh nghiệp và số tờ khai
            String[] remarkParts = parseRemark(request.getRemark());
            String maDoanhNghiep = remarkParts[0];
            String soToKhai = remarkParts[1];
            
            log.info("Bóc tách remark: maDoanhNghiep={}, soToKhai={}", maDoanhNghiep, soToKhai);
            
            // Tìm tờ khai theo mã doanh nghiệp và số tờ khai
            List<StoKhai> toKhaiList = toKhaiThongTinRepository.findByMaDoanhNghiepKhaiPhiAndSoToKhai(maDoanhNghiep, soToKhai);
            
            if (toKhaiList.isEmpty()) {
                log.warn("Không tìm thấy tờ khai với maDoanhNghiep={} và soToKhai={}", maDoanhNghiep, soToKhai);
                return createErrorResponse(request.getTransId(), request.getProviderId(), "01", "Không tìm thấy tờ khai");
            }
            
            // Cập nhật tờ khai đầu tiên tìm được
            StoKhai toKhai = toKhaiList.get(0);
            log.info("Tìm thấy tờ khai ID: {}, đang cập nhật...", toKhai.getId());
            
            // Cập nhật thông tin từ webhook
            toKhai.setTvsdJson(tvsdJson);
            toKhai.setTransId(request.getTransId());
            toKhai.setTrangThai("04"); // Trạng thái đã thanh toán
            toKhai.setTrangThaiNganHang("02"); // TTNH = 02
            
            // Parse transTime và lưu vào ngay_tt
            LocalDateTime ngayThanhToan = parseTransTime(request.getTransTime());
            toKhai.setNgayTt(ngayThanhToan);
            
            // Lưu vào database
            StoKhai savedToKhai = toKhaiThongTinRepository.save(toKhai);
            
            log.info("✅ Đã cập nhật tờ khai ID: {} thành công. Ngày thanh toán: {}, TransTime: '{}'", 
                    savedToKhai.getId(), savedToKhai.getNgayTt(), request.getTransTime());
            
            // Trả về response thành công
            return createSuccessResponse(request.getTransId(), request.getProviderId());
            
        } catch (Exception e) {
            log.error("Lỗi khi xử lý webhook từ ngân hàng: ", e);
            return createErrorResponse(request.getTransId(), request.getProviderId(), "99", "Lỗi hệ thống: " + e.getMessage());
        }
    }
    
    /**
     * Bóc tách remark để lấy mã doanh nghiệp và số tờ khai
     * Format: "maDoanhNghiep_soToKhai"
     */
    private String[] parseRemark(String remark) {
        if (remark == null || remark.isEmpty()) {
            throw new IllegalArgumentException("Remark không được để trống");
        }
        
        String[] parts = remark.split("_");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Format remark không đúng. Mong đợi: maDoanhNghiep_soToKhai");
        }
        
        return parts;
    }
    
    /**
     * Tạo response thành công
     */
    private BankWebhookResponse createSuccessResponse(String transId, String providerId) {
        BankWebhookResponse response = new BankWebhookResponse();
        response.setTransId(transId);
        response.setProviderId(providerId);
        response.setErrorCode("00");
        response.setErrorDesc("Thanh cong");
        response.setSignature(""); // TODO: Implement signature generation
        return response;
    }
    
    /**
     * Parse transTime từ định dạng yyyyMMddhhmmss sang LocalDateTime
     * Ví dụ: "20241216140713" -> LocalDateTime(2024-12-16T14:07:13)
     */
    private LocalDateTime parseTransTime(String transTime) {
        log.info("Bắt đầu parse transTime: '{}', độ dài: {}", transTime, transTime != null ? transTime.length() : "null");
        
        if (transTime == null) {
            log.warn("TransTime là null, sử dụng thời gian hiện tại");
            return LocalDateTime.now();
        }
        
        if (transTime.trim().isEmpty()) {
            log.warn("TransTime là chuỗi rỗng, sử dụng thời gian hiện tại");
            return LocalDateTime.now();
        }
        
        if (transTime.length() != 14) {
            log.warn("TransTime không đúng độ dài (cần 14 ký tự): '{}', độ dài: {}, sử dụng thời gian hiện tại", 
                    transTime, transTime.length());
            return LocalDateTime.now();
        }
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            LocalDateTime parsedDateTime = LocalDateTime.parse(transTime, formatter);
            
            log.info("✅ Đã parse transTime thành công: '{}' -> {}", transTime, parsedDateTime);
            return parsedDateTime;
            
        } catch (Exception e) {
            log.error("❌ Lỗi khi parse transTime: '{}', sử dụng thời gian hiện tại. Lỗi: {}", transTime, e.getMessage());
            return LocalDateTime.now();
        }
    }
    
    /**
     * Tạo response lỗi
     */
    private BankWebhookResponse createErrorResponse(String transId, String providerId, String errorCode, String errorDesc) {
        BankWebhookResponse response = new BankWebhookResponse();
        response.setTransId(transId);
        response.setProviderId(providerId);
        response.setErrorCode(errorCode);
        response.setErrorDesc(errorDesc);
        response.setSignature(""); // TODO: Implement signature generation
        return response;
    }
}
