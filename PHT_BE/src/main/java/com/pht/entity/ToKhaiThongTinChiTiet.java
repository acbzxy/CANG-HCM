package com.pht.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "ToKhaiThongTinChiTiet")
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(exclude = "toKhaiThongTin")
public class ToKhaiThongTinChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "ToKhaiThongTinID", nullable = false)
    private Long toKhaiThongTinID;

    @Column(name = "SoVanDon", nullable = false, length = 100)
    private String soVanDon;

    // Thông tin chung
    @Column(name = "SoHieu", length = 100)
    private String soHieu; // số vận đơn / số container / mã hàng

    @Column(name = "SoSeal", length = 100)
    private String soSeal;

    @Column(name = "LoaiCont", length = 255)
    private String loaiCont;

    @Column(name = "TinhChatCont", length = 255)
    private String tinhChatCont;

    @Column(name = "TongTrongLuong", precision = 18, scale = 2)
    private BigDecimal tongTrongLuong;

    @Column(name = "DonViTinh", length = 20)
    private String donViTinh;

    @Column(name = "GhiChu", length = 500)
    private String ghiChu;

    // Relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ToKhaiThongTinID", insertable = false, updatable = false)
    @JsonBackReference
    private ToKhaiThongTin toKhaiThongTin;
}
