package com.pht.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pht.entity.Sdvt;

@Repository
public interface SdvtRepository extends BaseRepository<Sdvt, Long> {

    @Query("SELECT s FROM Sdvt s WHERE " +
           "(:maDvt IS NULL OR LOWER(s.maDvt) LIKE LOWER(:maDvt)) AND " +
           "(:tenDvt IS NULL OR LOWER(s.tenDvt) LIKE LOWER(:tenDvt)) AND " +
           "(:loaiDvt IS NULL OR LOWER(s.loaiDvt) LIKE LOWER(:loaiDvt)) AND " +
           "(:trangThai IS NULL OR s.trangThai = :trangThai)")
    Page<Sdvt> findBySearchCriteria(@Param("maDvt") String maDvt,
                                  @Param("tenDvt") String tenDvt,
                                  @Param("loaiDvt") String loaiDvt,
                                  @Param("trangThai") String trangThai,
                                  Pageable pageable);

    @Query("SELECT s FROM Sdvt s WHERE " +
           "(:maDvt IS NULL OR LOWER(s.maDvt) LIKE LOWER(:maDvt)) AND " +
           "(:tenDvt IS NULL OR LOWER(s.tenDvt) LIKE LOWER(:tenDvt)) AND " +
           "(:loaiDvt IS NULL OR LOWER(s.loaiDvt) LIKE LOWER(:loaiDvt)) AND " +
           "(:trangThai IS NULL OR s.trangThai = :trangThai)")
    List<Sdvt> findBySearchCriteria(@Param("maDvt") String maDvt,
                                  @Param("tenDvt") String tenDvt,
                                  @Param("loaiDvt") String loaiDvt,
                                  @Param("trangThai") String trangThai);

    boolean existsByMaDvt(String maDvt);
}