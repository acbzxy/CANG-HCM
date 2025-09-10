package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SdoanhNghiep.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SdoanhNghiep_ {

	
	/**
	 * @see com.pht.entity.SdoanhNghiep#tenDn
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, String> tenDn;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#dienGiai
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#trangThai
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, String> trangThai;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#id
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, Long> id;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep
	 **/
	public static volatile EntityType<SdoanhNghiep> class_;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#maDn
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, String> maDn;
	
	/**
	 * @see com.pht.entity.SdoanhNghiep#ngayTao
	 **/
	public static volatile SingularAttribute<SdoanhNghiep, LocalDateTime> ngayTao;

	public static final String TEN_DN = "tenDn";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_DN = "maDn";
	public static final String NGAY_TAO = "ngayTao";

}

