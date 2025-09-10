package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;
import java.time.LocalDateTime;

@StaticMetamodel(SmauPhiBienLai.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SmauPhiBienLai_ {

	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#mauBienLai
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> mauBienLai;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#phatHanh
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> phatHanh;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#tuSo
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> tuSo;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#ngayTao
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, LocalDateTime> ngayTao;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#trangThai
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> trangThai;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#ngayHieuLuc
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, LocalDate> ngayHieuLuc;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#denSo
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> denSo;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#id
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, Long> id;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#diemThuPhi
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> diemThuPhi;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#nguoiTao
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> nguoiTao;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai
	 **/
	public static volatile EntityType<SmauPhiBienLai> class_;
	
	/**
	 * @see com.pht.entity.SmauPhiBienLai#kyHieu
	 **/
	public static volatile SingularAttribute<SmauPhiBienLai, String> kyHieu;

	public static final String MAU_BIEN_LAI = "mauBienLai";
	public static final String PHAT_HANH = "phatHanh";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String TU_SO = "tuSo";
	public static final String NGAY_TAO = "ngayTao";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_HIEU_LUC = "ngayHieuLuc";
	public static final String DEN_SO = "denSo";
	public static final String ID = "id";
	public static final String DIEM_THU_PHI = "diemThuPhi";
	public static final String NGUOI_TAO = "nguoiTao";
	public static final String KY_HIEU = "kyHieu";

}

