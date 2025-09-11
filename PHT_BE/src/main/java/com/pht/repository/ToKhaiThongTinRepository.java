package com.pht.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.pht.entity.ToKhaiThongTin;

public interface ToKhaiThongTinRepository extends BaseRepository<ToKhaiThongTin, Long> {
    
    /**
     * Kiểm tra xem số thông báo đã tồn tại chưa
     */
    boolean existsBySoThongBao(String soThongBao);
    
    /**
     * Lấy số lượng tờ khai có số thông báo trong ngày hiện tại để tạo sequence
     */
    @Query("SELECT COUNT(t) FROM ToKhaiThongTin t WHERE t.soThongBao IS NOT NULL AND t.soThongBao LIKE CONCAT(:datePrefix, '%')")
    long countTodayNotifications(@org.springframework.data.repository.query.Param("datePrefix") String datePrefix);
    
    /**
     * Lấy danh sách tờ khai theo trạng thái
     */
    @Query("SELECT t FROM ToKhaiThongTin t WHERE t.trangThai = :trangThai ORDER BY t.id DESC")
    List<ToKhaiThongTin> findByTrangThai(@org.springframework.data.repository.query.Param("trangThai") String trangThai);
    
}
