package com.pht.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pht.entity.StoKhai;
import com.pht.entity.StoKhaiCt;
import com.pht.exception.BusinessException;
import com.pht.model.request.NotificationRequest;
import com.pht.model.request.ToKhaiThongTinChiTietRequest;
import com.pht.model.request.ToKhaiThongTinRequest;
import com.pht.model.request.UpdateTrangThaiRequest;
import com.pht.model.request.UpdateTrangThaiPhatHanhRequest;
import com.pht.model.response.NotificationResponse;
import com.pht.repository.ToKhaiThongTinChiTietRepository;
import com.pht.repository.ToKhaiThongTinRepository;
import com.pht.service.ToKhaiThongTinService;
import com.pht.util.SequenceGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ToKhaiThongTinServiceImpl extends BaseServiceImpl<StoKhai, Long> implements ToKhaiThongTinService {

    private final ToKhaiThongTinRepository toKhaiThongTinRepository;
    private final ToKhaiThongTinChiTietRepository toKhaiThongTinChiTietRepository;
    private final SequenceGenerator sequenceGenerator;
    
    // Atomic counter để tạo số thông báo duy nhất trong cùng thời điểm
    private static final AtomicInteger notificationCounter = new AtomicInteger(0);

    @Override
    public ToKhaiThongTinRepository getRepository() {
        return toKhaiThongTinRepository;
    }

    @Override
    public List<StoKhai> getAllToKhaiThongTin() {
        return toKhaiThongTinRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public StoKhai getToKhaiThongTinById(Long id) throws BusinessException {
        return toKhaiThongTinRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy tờ khai thông tin với ID: " + id));
    }

    @Override
    @Transactional
    public StoKhai createToKhaiThongTin(ToKhaiThongTinRequest request) throws BusinessException {
        try {
            // Tạo entity chính
            StoKhai toKhaiThongTin = new StoKhai();
            BeanUtils.copyProperties(request, toKhaiThongTin);
            
            // Generate SoTiepNhanKhaiPhi theo format [YYYY][sequence tăng dần] - 12 số
            String soTiepNhanKhaiPhi = sequenceGenerator.generateSoTiepNhanKhaiPhi();
            toKhaiThongTin.setSoTiepNhanKhaiPhi(soTiepNhanKhaiPhi);
            
            // Set NgayKhaiPhi = ngày hiện tại
            toKhaiThongTin.setNgayKhaiPhi(LocalDate.now());
            
            // Đảm bảo trangThaiPhatHanh có giá trị mặc định là "00"
            if (toKhaiThongTin.getTrangThaiPhatHanh() == null || toKhaiThongTin.getTrangThaiPhatHanh().isEmpty()) {
                toKhaiThongTin.setTrangThaiPhatHanh("00");
            }
            
            log.info("Tạo tờ khai thông tin với SoTiepNhanKhaiPhi: {}, NgayKhaiPhi: {}", 
                    soTiepNhanKhaiPhi, toKhaiThongTin.getNgayKhaiPhi());
            
            // Lưu entity chính trước
            StoKhai savedToKhai = toKhaiThongTinRepository.save(toKhaiThongTin);
            
            // Xử lý chi tiết nếu có
            if (request.getChiTietList() != null && !request.getChiTietList().isEmpty()) {
                for (ToKhaiThongTinChiTietRequest chiTietRequest : request.getChiTietList()) {
                    StoKhaiCt chiTiet = new StoKhaiCt();
                    BeanUtils.copyProperties(chiTietRequest, chiTiet);
                    chiTiet.setToKhaiThongTinID(savedToKhai.getId());
                    toKhaiThongTinChiTietRepository.save(chiTiet);
                }
            }
            
            return savedToKhai;
        } catch (Exception e) {
            log.error("Lỗi khi tạo tờ khai thông tin: ", e);
            throw new BusinessException("Lỗi khi tạo tờ khai thông tin: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public StoKhai updateTrangThai(UpdateTrangThaiRequest request) throws BusinessException {
        try {
            StoKhai toKhaiThongTin = getToKhaiThongTinById(request.getId());
            toKhaiThongTin.setTrangThai(request.getTrangThai());
            return toKhaiThongTinRepository.save(toKhaiThongTin);
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật trạng thái tờ khai thông tin: ", e);
            throw new BusinessException("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public StoKhai updateTrangThaiPhatHanh(UpdateTrangThaiPhatHanhRequest request) throws BusinessException {
        try {
            log.info("Bắt đầu cập nhật trạng thái phát hành cho tờ khai ID: {}, trạng thái mới: {}", 
                    request.getId(), request.getTrangThaiPhatHanh());
            
            StoKhai toKhaiThongTin = getToKhaiThongTinById(request.getId());
            
            // Lưu trạng thái cũ để log
            String trangThaiCu = toKhaiThongTin.getTrangThaiPhatHanh();
            
            // Cập nhật trạng thái phát hành mới
            toKhaiThongTin.setTrangThaiPhatHanh(request.getTrangThaiPhatHanh());
            
            StoKhai savedToKhai = toKhaiThongTinRepository.save(toKhaiThongTin);
            
            log.info("Cập nhật trạng thái phát hành thành công cho tờ khai ID: {}, từ '{}' sang '{}'", 
                    request.getId(), trangThaiCu, request.getTrangThaiPhatHanh());
            
            return savedToKhai;
        } catch (BusinessException e) {
            log.error("Lỗi khi cập nhật trạng thái phát hành: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi cập nhật trạng thái phát hành: ", e);
            throw new BusinessException("Lỗi hệ thống khi cập nhật trạng thái phát hành: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) throws BusinessException {
        try {
            log.info("Bắt đầu tạo thông báo cho tờ khai ID: {}", request.getToKhaiId());
            
            // Lấy thông tin tờ khai
            StoKhai toKhaiThongTin = getToKhaiThongTinById(request.getToKhaiId());
            
            // Kiểm tra trạng thái hiện tại
            if (!"01".equals(toKhaiThongTin.getTrangThai())) {
                throw new BusinessException("Tờ khai không ở trạng thái có thể tạo thông báo. Trạng thái hiện tại: " + toKhaiThongTin.getTrangThai());
            }
            
            // Tạo số thông báo theo format: YYYYMMDD + 6 số random
            String soThongBao = generateSoThongBao();
            
            // Tạo msgId (UUID)
            String msgId = UUID.randomUUID().toString().toUpperCase();
            
            // Cập nhật trạng thái sang "02" và lưu số thông báo + msgId
            toKhaiThongTin.setTrangThai("02");
            toKhaiThongTin.setSoThongBao(soThongBao);
            toKhaiThongTin.setMsgId(msgId);
            
            // Lưu vào database
            toKhaiThongTinRepository.save(toKhaiThongTin);
            
            log.info("Tạo thông báo thành công cho tờ khai ID: {}, số thông báo: {}, msgId: {}", 
                    request.getToKhaiId(), soThongBao, msgId);
            
            return NotificationResponse.builder()
                    .soThongBao(soThongBao)
                    .msgId(msgId)
                    .trangThaiMoi("02")
                    .toKhaiId(request.getToKhaiId())
                    .build();
                    
        } catch (BusinessException e) {
            log.error("Lỗi khi tạo thông báo: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi tạo thông báo: ", e);
            throw new BusinessException("Lỗi hệ thống khi tạo thông báo: " + e.getMessage());
        }
    }
    
    /**
     * Tạo số thông báo theo format: YYYYMMDD + 6 số duy nhất
     * Sử dụng sequence từ database + nanoTime để tránh trùng lặp hoàn toàn
     */
    private String generateSoThongBao() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Lấy số lượng thông báo đã tạo trong ngày từ database
        long todayCount = toKhaiThongTinRepository.countTodayNotifications(datePart);
        
        // Sử dụng nanoTime để tạo phần duy nhất
        long nanoTime = System.nanoTime();
        int counter = notificationCounter.incrementAndGet();
        
        // Kết hợp sequence từ DB + nanoTime + atomic counter
        long sequenceNumber = todayCount + 1;
        long uniqueValue = (sequenceNumber * 1000) + (nanoTime % 1000) + (counter % 100);
        String uniquePart = String.format("%06d", uniqueValue % 1000000);
        
        String soThongBao = datePart + uniquePart;
        
        // Kiểm tra xem số thông báo đã tồn tại chưa (để đảm bảo không trùng lặp)
        int retryCount = 0;
        while (toKhaiThongTinRepository.existsBySoThongBao(soThongBao) && retryCount < 3) {
            // Nếu trùng, tạo số mới với nanoTime + counter + retryCount
            long newNanoTime = System.nanoTime();
            int newCounter = notificationCounter.incrementAndGet();
            long newUniqueValue = (sequenceNumber * 1000) + (newNanoTime % 1000) + (newCounter % 100) + retryCount;
            uniquePart = String.format("%06d", newUniqueValue % 1000000);
            soThongBao = datePart + uniquePart;
            retryCount++;
        }
        
        if (retryCount >= 3) {
            // Nếu vẫn trùng sau 3 lần thử, sử dụng UUID
            String uuidPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6);
            soThongBao = datePart + uuidPart;
            log.warn("Sử dụng UUID fallback cho số thông báo: {}", soThongBao);
        }
        
        log.info("Tạo số thông báo: {} (sequence: {}, nanoTime: {}, counter: {})", 
                soThongBao, sequenceNumber, nanoTime % 1000, counter);
        
        return soThongBao;
    }
    
    @Override
    public List<StoKhai> findByTrangThai(String trangThai) {
        log.info("Tìm tờ khai thông tin theo trạng thái: {}", trangThai);
        return toKhaiThongTinRepository.findByTrangThai(trangThai);
    }
}
