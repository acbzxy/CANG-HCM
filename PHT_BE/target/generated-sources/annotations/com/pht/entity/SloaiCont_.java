package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SloaiCont.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SloaiCont_ {

	
	/**
	 * @see com.pht.entity.SloaiCont#ma
	 **/
	public static volatile SingularAttribute<SloaiCont, String> ma;
	
	/**
	 * @see com.pht.entity.SloaiCont#dienGiai
	 **/
	public static volatile SingularAttribute<SloaiCont, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SloaiCont#trangThai
	 **/
	public static volatile SingularAttribute<SloaiCont, String> trangThai;
	
	/**
	 * @see com.pht.entity.SloaiCont#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SloaiCont, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SloaiCont#id
	 **/
	public static volatile SingularAttribute<SloaiCont, Long> id;
	
	/**
	 * @see com.pht.entity.SloaiCont#ten
	 **/
	public static volatile SingularAttribute<SloaiCont, String> ten;
	
	/**
	 * @see com.pht.entity.SloaiCont
	 **/
	public static volatile EntityType<SloaiCont> class_;
	
	/**
	 * @see com.pht.entity.SloaiCont#ngayTao
	 **/
	public static volatile SingularAttribute<SloaiCont, LocalDateTime> ngayTao;

	public static final String MA = "ma";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String TEN = "ten";
	public static final String NGAY_TAO = "ngayTao";

}

