package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@StaticMetamodel(SbieuCuoc.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SbieuCuoc_ {

	
	/**
	 * @see com.pht.entity.SbieuCuoc#hang
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> hang;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#dvt
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> dvt;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#maBieuCuoc
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> maBieuCuoc;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#nhomLoaiHinh
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> nhomLoaiHinh;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SbieuCuoc, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#ngayTao
	 **/
	public static volatile SingularAttribute<SbieuCuoc, LocalDateTime> ngayTao;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#donGia
	 **/
	public static volatile SingularAttribute<SbieuCuoc, BigDecimal> donGia;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#tenBieuCuoc
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> tenBieuCuoc;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#trangThai
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> trangThai;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#id
	 **/
	public static volatile SingularAttribute<SbieuCuoc, Long> id;
	
	/**
	 * @see com.pht.entity.SbieuCuoc
	 **/
	public static volatile EntityType<SbieuCuoc> class_;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#loaiCont
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> loaiCont;
	
	/**
	 * @see com.pht.entity.SbieuCuoc#tinhChatCont
	 **/
	public static volatile SingularAttribute<SbieuCuoc, String> tinhChatCont;

	public static final String HANG = "hang";
	public static final String DVT = "dvt";
	public static final String MA_BIEU_CUOC = "maBieuCuoc";
	public static final String NHOM_LOAI_HINH = "nhomLoaiHinh";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String NGAY_TAO = "ngayTao";
	public static final String DON_GIA = "donGia";
	public static final String TEN_BIEU_CUOC = "tenBieuCuoc";
	public static final String TRANG_THAI = "trangThai";
	public static final String ID = "id";
	public static final String LOAI_CONT = "loaiCont";
	public static final String TINH_CHAT_CONT = "tinhChatCont";

}

