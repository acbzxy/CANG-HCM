package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SloaiBieuCuoc.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SloaiBieuCuoc_ {

	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#ma
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, String> ma;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#dienGiai
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#trangThai
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, String> trangThai;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#id
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, Long> id;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#ten
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, String> ten;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc
	 **/
	public static volatile EntityType<SloaiBieuCuoc> class_;
	
	/**
	 * @see com.pht.entity.SloaiBieuCuoc#ngayTao
	 **/
	public static volatile SingularAttribute<SloaiBieuCuoc, LocalDateTime> ngayTao;

	public static final String MA = "ma";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String TEN = "ten";
	public static final String NGAY_TAO = "ngayTao";

}

