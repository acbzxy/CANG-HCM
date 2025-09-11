package com.pht.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pht.entity.StoKhaiCt;

public interface ToKhaiThongTinChiTietRepository extends BaseRepository<StoKhaiCt, Long> {
    
    @Query("SELECT c FROM StoKhaiCt c WHERE c.toKhaiThongTinID = :toKhaiThongTinID")
    List<StoKhaiCt> findByToKhaiThongTinID(@Param("toKhaiThongTinID") Long toKhaiThongTinID);
    
}
