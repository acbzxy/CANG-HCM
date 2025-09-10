package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SloaiThanhToan.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SloaiThanhToan_ {

	
	/**
	 * @see com.pht.entity.SloaiThanhToan#dienGiai
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#trangThai
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, String> trangThai;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#maLoaiThanhToan
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, String> maLoaiThanhToan;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#id
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, Long> id;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#tenLoaiThanhToan
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, String> tenLoaiThanhToan;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan
	 **/
	public static volatile EntityType<SloaiThanhToan> class_;
	
	/**
	 * @see com.pht.entity.SloaiThanhToan#ngayTao
	 **/
	public static volatile SingularAttribute<SloaiThanhToan, LocalDateTime> ngayTao;

	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String MA_LOAI_THANH_TOAN = "maLoaiThanhToan";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String TEN_LOAI_THANH_TOAN = "tenLoaiThanhToan";
	public static final String NGAY_TAO = "ngayTao";

}

