package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SnganHang.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SnganHang_ {

	
	/**
	 * @see com.pht.entity.SnganHang#tenNh
	 **/
	public static volatile SingularAttribute<SnganHang, String> tenNh;
	
	/**
	 * @see com.pht.entity.SnganHang#dienGiai
	 **/
	public static volatile SingularAttribute<SnganHang, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SnganHang#trangThai
	 **/
	public static volatile SingularAttribute<SnganHang, String> trangThai;
	
	/**
	 * @see com.pht.entity.SnganHang#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SnganHang, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SnganHang#id
	 **/
	public static volatile SingularAttribute<SnganHang, Long> id;
	
	/**
	 * @see com.pht.entity.SnganHang
	 **/
	public static volatile EntityType<SnganHang> class_;
	
	/**
	 * @see com.pht.entity.SnganHang#maNh
	 **/
	public static volatile SingularAttribute<SnganHang, String> maNh;
	
	/**
	 * @see com.pht.entity.SnganHang#ngayTao
	 **/
	public static volatile SingularAttribute<SnganHang, LocalDateTime> ngayTao;

	public static final String TEN_NH = "tenNh";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_NH = "maNh";
	public static final String NGAY_TAO = "ngayTao";

}

