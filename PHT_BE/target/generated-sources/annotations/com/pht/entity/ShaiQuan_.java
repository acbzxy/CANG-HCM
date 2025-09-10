package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(ShaiQuan.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ShaiQuan_ {

	
	/**
	 * @see com.pht.entity.ShaiQuan#tenHq
	 **/
	public static volatile SingularAttribute<ShaiQuan, String> tenHq;
	
	/**
	 * @see com.pht.entity.ShaiQuan#dienGiai
	 **/
	public static volatile SingularAttribute<ShaiQuan, String> dienGiai;
	
	/**
	 * @see com.pht.entity.ShaiQuan#trangThai
	 **/
	public static volatile SingularAttribute<ShaiQuan, String> trangThai;
	
	/**
	 * @see com.pht.entity.ShaiQuan#ngayCapNhat
	 **/
	public static volatile SingularAttribute<ShaiQuan, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.ShaiQuan#id
	 **/
	public static volatile SingularAttribute<ShaiQuan, Long> id;
	
	/**
	 * @see com.pht.entity.ShaiQuan
	 **/
	public static volatile EntityType<ShaiQuan> class_;
	
	/**
	 * @see com.pht.entity.ShaiQuan#maHq
	 **/
	public static volatile SingularAttribute<ShaiQuan, String> maHq;
	
	/**
	 * @see com.pht.entity.ShaiQuan#ngayTao
	 **/
	public static volatile SingularAttribute<ShaiQuan, LocalDateTime> ngayTao;

	public static final String TEN_HQ = "tenHq";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_HQ = "maHq";
	public static final String NGAY_TAO = "ngayTao";

}

