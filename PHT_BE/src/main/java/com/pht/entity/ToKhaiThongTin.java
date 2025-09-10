package com.pht.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "ToKhaiThongTin")
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(exclude = "chiTietList")
public class ToKhaiThongTin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    // NGUỒN THÔNG TIN TỜ KHAI
    @Column(name = "NGUONTK")
    private Integer nguonTK;

    // DOANH NGHIỆP KHAI PHÍ
    @Column(name = "MADOANHNGHIEPKHAIPHI", nullable = false, length = 20)
    private String maDoanhNghiepKhaiPhi;

    @Column(name = "TENDOANHNGHIEPKHAIPHI", length = 255)
    private String tenDoanhNghiepKhaiPhi;

    @Column(name = "DIACHIKHAIPHI", length = 500)
    private String diaChiKhaiPhi;

    // DOANH NGHIỆP XNK
    @Column(name = "MADOANHNGHIEPXNK", nullable = false, length = 20)
    private String maDoanhNghiepXNK;

    @Column(name = "TENDOANHNGHIEPXNK", length = 255)
    private String tenDoanhNghiepXNK;

    @Column(name = "DIACHIXNK", length = 500)
    private String diaChiXNK;

    // TỜ KHAI HẢI QUAN
    @Column(name = "SOTOKHAI", length = 50)
    private String soToKhai;

    @Column(name = "NGAYTOKHAI")
    private LocalDate ngayToKhai;

    @Column(name = "MAHAIQUAN", length = 50)
    private String maHaiQuan;

    @Column(name = "MALOAIHINH", length = 50)
    private String maLoaiHinh;

    @Column(name = "MALUUKHO", length = 100)
    private String maLuuKho;

    @Column(name = "NUOCXUATKHAU", length = 100)
    private String nuocXuatKhau;

    // THÔNG TIN HÀNG HÓA
    @Column(name = "MaPhuongThucVC", length = 50)
    private String maPhuongThucVC;

    @Column(name = "PhuongTienVC", length = 100)
    private String phuongTienVC;

    @Column(name = "MaDiaDiemXepHang", length = 100)
    private String maDiaDiemXepHang;

    @Column(name = "MaDiaDiemDoHang", length = 100)
    private String maDiaDiemDoHang;

    @Column(name = "MaPhanLoaiHangHoa", length = 100)
    private String maPhanLoaiHangHoa;

    @Column(name = "MucDichVC", length = 200)
    private String mucDichVC;

    // TỜ KHAI PHÍ
    @Column(name = "SoTiepNhanKhaiPhi", length = 50)
    private String soTiepNhanKhaiPhi;

    @Column(name = "NgayKhaiPhi")
    private LocalDate ngayKhaiPhi;

    @Column(name = "NhomLoaiPhi", length = 100)
    private String nhomLoaiPhi;

    @Column(name = "LoaiThanhToan", length = 100)
    private String loaiThanhToan;

    @Column(name = "GhiChuKhaiPhi", length = 500)
    private String ghiChuKhaiPhi;

    // THÔNG TIN THU PHÍ
    @Column(name = "SoThongBaoNopPhi", length = 50)
    private String soThongBaoNopPhi;

    @Column(name = "SOTHONGBAO", length = 50)
    private String soThongBao;

    @Column(name = "MSGID", length = 50)
    private String msgId;

    @Column(name = "IDPHATHANH", length = 100)
    private String idPhatHanh;

    @Column(name = "TongTienPhi", precision = 18, scale = 2)
    private BigDecimal tongTienPhi;

    @Column(name = "TrangThaiNganHang", length = 50)
    private String trangThaiNganHang;

    @Column(name = "SoBienLai", length = 50)
    private String soBienLai;

    @Column(name = "NgayBienLai")
    private LocalDate ngayBienLai;

    @Column(name = "KyHieuBienLai", length = 50)
    private String kyHieuBienLai;

    @Column(name = "MauBienLai", length = 50)
    private String mauBienLai;

    @Column(name = "MaTraCuuBienLai", length = 50)
    private String maTraCuuBienLai;

    @Column(name = "XemBienLai", length = 200)
    private String xemBienLai;

    // DANH MỤC LOẠI HÀNG MIỄN PHÍ
    @Column(name = "LoaiHangMienPhi", length = 500)
    private String loaiHangMienPhi;

    @Column(name = "LoaiHang", length = 50)
    private String loaiHang;

    @Column(name = "TrangThai", length = 50)
    private String trangThai;

    @Column(name = "TrangThaiPhatHanh", length = 50)
    private String trangThaiPhatHanh = "00";

    // XML DATA FIELDS
    @Column(name = "KYLAN1_XML", columnDefinition = "TEXT")
    private String kylan1Xml;

    @Column(name = "KYLAN2_XML", columnDefinition = "TEXT")
    private String kylan2Xml;

    // IMAGE DATA FIELD
    @Column(name = "IMAGEBL", columnDefinition = "TEXT")
    private String imageBl;

    // Relationship
    @OneToMany(mappedBy = "toKhaiThongTin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ToKhaiThongTinChiTiet> chiTietList;
}
