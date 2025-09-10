package com.pht.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pht.entity.ToKhaiThongTinChiTiet;

public interface ToKhaiThongTinChiTietRepository extends BaseRepository<ToKhaiThongTinChiTiet, Long> {
    
    @Query("SELECT c FROM ToKhaiThongTinChiTiet c WHERE c.toKhaiThongTinID = :toKhaiThongTinID")
    List<ToKhaiThongTinChiTiet> findByToKhaiThongTinID(@Param("toKhaiThongTinID") Long toKhaiThongTinID);
    
}
