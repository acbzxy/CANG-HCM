package com.pht.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pht.entity.ToKhaiThongTin;
import com.pht.exception.BusinessException;
import com.pht.model.request.KySoRequest;
import com.pht.model.response.ChuKySoResponse;
import com.pht.model.response.KySoResponse;
import com.pht.repository.ToKhaiThongTinRepository;
import com.pht.service.DigitalSignatureService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChuKySoServiceImpl implements DigitalSignatureService {

    private final ToKhaiThongTinRepository toKhaiThongTinRepository;

    @Override
    public List<ChuKySoResponse> layDanhSachChuKySo() {
        log.info("Lấy danh sách chữ ký số có sẵn");
        
        List<ChuKySoResponse> danhSach = new ArrayList<>();
        
        // Giả lập danh sách chữ ký số
        ChuKySoResponse chuKy1 = new ChuKySoResponse();
        chuKy1.setId("CKS001");
        chuKy1.setName("Adobe Content Certificate 10-6");
        chuKy1.setIssuer("Adobe Intermediate CA 10-4");
        chuKy1.setValidFrom("8/20/2018");
        chuKy1.setValidTo("8/18/2025");
        chuKy1.setSerialNumber("1234567890ABCDEF");
        chuKy1.setSelected(false);
        danhSach.add(chuKy1);
        
        ChuKySoResponse chuKy2 = new ChuKySoResponse();
        chuKy2.setId("CKS002");
        chuKy2.setName("Adobe Content Certificate 10-6");
        chuKy2.setIssuer("Adobe Intermediate CA 10-4");
        chuKy2.setValidFrom("8/20/2018");
        chuKy2.setValidTo("8/18/2025");
        chuKy2.setSerialNumber("FEDCBA0987654321");
        chuKy2.setSelected(false);
        danhSach.add(chuKy2);
        
        ChuKySoResponse chuKy3 = new ChuKySoResponse();
        chuKy3.setId("CKS003");
        chuKy3.setName("Adobe Intermediate CA 10-4");
        chuKy3.setIssuer("Adobe Root CA 10-3");
        chuKy3.setValidFrom("8/18/2018");
        chuKy3.setValidTo("8/5/2068");
        chuKy3.setSerialNumber("ABCDEF1234567890");
        chuKy3.setSelected(false);
        danhSach.add(chuKy3);
        
        ChuKySoResponse chuKy4 = new ChuKySoResponse();
        chuKy4.setId("CKS004");
        chuKy4.setName("Adobe Intermediate CA 10-3");
        chuKy4.setIssuer("Adobe Root CA 10-3");
        chuKy4.setValidFrom("8/18/2018");
        chuKy4.setValidTo("8/5/2068");
        chuKy4.setSerialNumber("0987654321ABCDEF");
        chuKy4.setSelected(false);
        danhSach.add(chuKy4);
        
        log.info("Trả về {} chữ ký số", danhSach.size());
        return danhSach;
    }

    @Override
    @Transactional
    public KySoResponse kySo(KySoRequest request) throws BusinessException {
        log.info("Thực hiện ký số tờ khai ID: {} với chữ ký số: {}", 
                request.getToKhaiId(), request.getChuKySoId());
        
        try {
            // Tìm tờ khai theo ID
            ToKhaiThongTin toKhai = toKhaiThongTinRepository.findById(request.getToKhaiId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy tờ khai với ID: " + request.getToKhaiId()));
            
            // Kiểm tra trạng thái hiện tại
            if (!"00".equals(toKhai.getTrangThai())) {
                throw new BusinessException("Tờ khai không ở trạng thái có thể ký. Trạng thái hiện tại: " + toKhai.getTrangThai());
            }
            
            // Thực hiện ký số (giả lập)
            // Trong thực tế, đây sẽ là nơi gọi API ký số thực
            boolean kyThanhCong = thucHienKySo(toKhai, request.getChuKySoId(), request.getMatKhau());
            
            if (kyThanhCong) {
                // Cập nhật trạng thái từ "00" sang "01"
                toKhai.setTrangThai("01");
                toKhaiThongTinRepository.save(toKhai);
                
                KySoResponse response = new KySoResponse();
                response.setSuccess(true);
                response.setMessage("Ký số thành công");
                response.setTrangThai("01");
                response.setNgayKy(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
                response.setNguoiKy("Người dùng hệ thống");
                
                log.info("Ký số thành công tờ khai ID: {}, trạng thái mới: {}", 
                        request.getToKhaiId(), "01");
                
                return response;
            } else {
                throw new BusinessException("Ký số thất bại. Vui lòng kiểm tra lại chữ ký số và mật khẩu.");
            }
            
        } catch (BusinessException e) {
            log.error("Lỗi khi ký số: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi ký số: ", e);
            throw new BusinessException("Lỗi hệ thống khi ký số: " + e.getMessage());
        }
    }
    
    /**
     * Giả lập việc thực hiện ký số
     * Trong thực tế, đây sẽ là nơi tích hợp với hệ thống ký số thực
     */
    private boolean thucHienKySo(ToKhaiThongTin toKhai, String chuKySoId, String matKhau) {
        log.info("Giả lập ký số tờ khai: {} với chữ ký số: {}", toKhai.getId(), chuKySoId);
        
        // Giả lập delay để mô phỏng quá trình ký số
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Giả lập kiểm tra mật khẩu (nếu có)
        if (matKhau != null && !matKhau.isEmpty()) {
            // Trong thực tế, đây sẽ là nơi verify mật khẩu với chữ ký số
            if ("123456".equals(matKhau)) {
                log.info("Mật khẩu chữ ký số hợp lệ");
            } else {
                log.warn("Mật khẩu chữ ký số không hợp lệ");
                return false;
            }
        }
        
        // Giả lập ký số thành công
        log.info("Ký số thành công cho tờ khai ID: {}", toKhai.getId());
        return true;
    }
}
