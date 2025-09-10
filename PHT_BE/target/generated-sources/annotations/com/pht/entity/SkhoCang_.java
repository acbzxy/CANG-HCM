package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SkhoCang.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SkhoCang_ {

	
	/**
	 * @see com.pht.entity.SkhoCang#diaChi
	 **/
	public static volatile SingularAttribute<SkhoCang, String> diaChi;
	
	/**
	 * @see com.pht.entity.SkhoCang#ma
	 **/
	public static volatile SingularAttribute<SkhoCang, String> ma;
	
	/**
	 * @see com.pht.entity.SkhoCang#ghiChu
	 **/
	public static volatile SingularAttribute<SkhoCang, String> ghiChu;
	
	/**
	 * @see com.pht.entity.SkhoCang#trangThai
	 **/
	public static volatile SingularAttribute<SkhoCang, String> trangThai;
	
	/**
	 * @see com.pht.entity.SkhoCang#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SkhoCang, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SkhoCang#id
	 **/
	public static volatile SingularAttribute<SkhoCang, Long> id;
	
	/**
	 * @see com.pht.entity.SkhoCang#ten
	 **/
	public static volatile SingularAttribute<SkhoCang, String> ten;
	
	/**
	 * @see com.pht.entity.SkhoCang
	 **/
	public static volatile EntityType<SkhoCang> class_;
	
	/**
	 * @see com.pht.entity.SkhoCang#maHq
	 **/
	public static volatile SingularAttribute<SkhoCang, String> maHq;
	
	/**
	 * @see com.pht.entity.SkhoCang#ngayTao
	 **/
	public static volatile SingularAttribute<SkhoCang, LocalDateTime> ngayTao;
	
	/**
	 * @see com.pht.entity.SkhoCang#maCk
	 **/
	public static volatile SingularAttribute<SkhoCang, String> maCk;

	public static final String DIA_CHI = "diaChi";
	public static final String MA = "ma";
	public static final String GHI_CHU = "ghiChu";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String TEN = "ten";
	public static final String MA_HQ = "maHq";
	public static final String NGAY_TAO = "ngayTao";
	public static final String MA_CK = "maCk";

}

