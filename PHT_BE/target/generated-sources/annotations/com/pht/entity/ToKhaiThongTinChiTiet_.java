package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.math.BigDecimal;

@StaticMetamodel(ToKhaiThongTinChiTiet.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ToKhaiThongTinChiTiet_ {

	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#ghiChu
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> ghiChu;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#soHieu
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> soHieu;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#toKhaiThongTinID
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, Long> toKhaiThongTinID;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#soVanDon
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> soVanDon;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#soSeal
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> soSeal;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#tongTrongLuong
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, BigDecimal> tongTrongLuong;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#id
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, Long> id;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet
	 **/
	public static volatile EntityType<ToKhaiThongTinChiTiet> class_;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#loaiCont
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> loaiCont;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#tinhChatCont
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> tinhChatCont;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#donViTinh
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, String> donViTinh;
	
	/**
	 * @see com.pht.entity.ToKhaiThongTinChiTiet#toKhaiThongTin
	 **/
	public static volatile SingularAttribute<ToKhaiThongTinChiTiet, ToKhaiThongTin> toKhaiThongTin;

	public static final String GHI_CHU = "ghiChu";
	public static final String SO_HIEU = "soHieu";
	public static final String TO_KHAI_THONG_TIN_ID = "toKhaiThongTinID";
	public static final String SO_VAN_DON = "soVanDon";
	public static final String SO_SEAL = "soSeal";
	public static final String TONG_TRONG_LUONG = "tongTrongLuong";
	public static final String ID = "id";
	public static final String LOAI_CONT = "loaiCont";
	public static final String TINH_CHAT_CONT = "tinhChatCont";
	public static final String DON_VI_TINH = "donViTinh";
	public static final String TO_KHAI_THONG_TIN = "toKhaiThongTin";

}

