package com.pht.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "CHUKY_SO")
@Data
@EqualsAndHashCode(callSuper = false)
public class ChukySo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_chuky_so")
    @SequenceGenerator(name = "seq_chuky_so", sequenceName = "seq_chuky_so", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    // THÔNG TIN CHỮ KÝ SỐ
    @Column(name = "SERIAL_NUMBER", length = 255, nullable = false)
    private String serialNumber;

    @Column(name = "SUBJECT", length = 500)
    private String subject;

    @Column(name = "ISSUER", length = 500)
    private String issuer;

    @Column(name = "VALID_FROM")
    private LocalDateTime validFrom;

    @Column(name = "VALID_TO")
    private LocalDateTime validTo;

    // THÔNG TIN DOANH NGHIỆP
    @Column(name = "MA_DOANH_NGHIEP", length = 50)
    private String maDoanhNghiep;

    @Column(name = "TEN_DOANH_NGHIEP", length = 255)
    private String tenDoanhNghiep;

    @Column(name = "MA_SO_THUE", length = 50)
    private String maSoThue;

    // THÔNG TIN CHỨNG THƯ
    @Column(name = "CERTIFICATE_DATA", columnDefinition = "TEXT")
    private String certificateData;

    @Column(name = "PRIVATE_KEY", columnDefinition = "TEXT")
    private String privateKey;

    @Column(name = "PUBLIC_KEY", columnDefinition = "TEXT")
    private String publicKey;

    // THÔNG TIN TRẠNG THÁI
    @Column(name = "TRANG_THAI", length = 50)
    private String trangThai;

    @Column(name = "LOAI_CHU_KY", length = 100)
    private String loaiChuKy;

    @Column(name = "GHI_CHU", length = 500)
    private String ghiChu;

    // THÔNG TIN AUDIT
    @Column(name = "NGAY_TAO")
    private LocalDateTime ngayTao;

    @Column(name = "NGUOI_TAO", length = 100)
    private String nguoiTao;

    @Column(name = "NGAY_CAP_NHAT")
    private LocalDateTime ngayCapNhat;

    @Column(name = "NGUOI_CAP_NHAT", length = 100)
    private String nguoiCapNhat;

    // THÔNG TIN BẢO MẬT
    @Column(name = "PASSWORD", length = 255)
    private String password;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "IS_DEFAULT")
    private Boolean isDefault;
}
