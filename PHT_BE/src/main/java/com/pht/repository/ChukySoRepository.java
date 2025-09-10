package com.pht.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pht.entity.ChukySo;

@Repository
public interface ChukySoRepository extends BaseRepository<ChukySo, Long> {

    /**
     * Tìm chữ ký số theo serial number
     */
    Optional<ChukySo> findBySerialNumber(String serialNumber);

    /**
     * Tìm chữ ký số theo mã doanh nghiệp
     */
    List<ChukySo> findByMaDoanhNghiep(String maDoanhNghiep);

    /**
     * Tìm chữ ký số theo mã số thuế
     */
    List<ChukySo> findByMaSoThue(String maSoThue);

    /**
     * Tìm chữ ký số đang hoạt động theo mã doanh nghiệp
     */
    @Query("SELECT c FROM ChukySo c WHERE c.maDoanhNghiep = :maDoanhNghiep AND c.isActive = true")
    List<ChukySo> findActiveByMaDoanhNghiep(@Param("maDoanhNghiep") String maDoanhNghiep);

    /**
     * Tìm chữ ký số mặc định theo mã doanh nghiệp
     */
    @Query("SELECT c FROM ChukySo c WHERE c.maDoanhNghiep = :maDoanhNghiep AND c.isDefault = true")
    Optional<ChukySo> findDefaultByMaDoanhNghiep(@Param("maDoanhNghiep") String maDoanhNghiep);

    /**
     * Tìm chữ ký số theo trạng thái
     */
    List<ChukySo> findByTrangThai(String trangThai);

    /**
     * Tìm chữ ký số theo loại chữ ký
     */
    List<ChukySo> findByLoaiChuKy(String loaiChuKy);

    /**
     * Kiểm tra chữ ký số có tồn tại theo serial number
     */
    boolean existsBySerialNumber(String serialNumber);

    /**
     * Đếm số lượng chữ ký số theo mã doanh nghiệp
     */
    long countByMaDoanhNghiep(String maDoanhNghiep);

    /**
     * Tìm chữ ký số sắp hết hạn (trong vòng 30 ngày)
     */
    @Query("SELECT c FROM ChukySo c WHERE c.validTo <= :expiryDate AND c.isActive = true")
    List<ChukySo> findExpiringSoon(@Param("expiryDate") java.time.LocalDateTime expiryDate);

    /**
     * Tìm chữ ký số đã hết hạn
     */
    @Query("SELECT c FROM ChukySo c WHERE c.validTo < :currentDate")
    List<ChukySo> findExpired(@Param("currentDate") java.time.LocalDateTime currentDate);
}
