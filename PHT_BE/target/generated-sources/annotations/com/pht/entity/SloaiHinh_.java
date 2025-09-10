package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SloaiHinh.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SloaiHinh_ {

	
	/**
	 * @see com.pht.entity.SloaiHinh#dienGiai
	 **/
	public static volatile SingularAttribute<SloaiHinh, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SloaiHinh#trangThai
	 **/
	public static volatile SingularAttribute<SloaiHinh, String> trangThai;
	
	/**
	 * @see com.pht.entity.SloaiHinh#nhomLoaiHinh
	 **/
	public static volatile SingularAttribute<SloaiHinh, String> nhomLoaiHinh;
	
	/**
	 * @see com.pht.entity.SloaiHinh#maLoaiHinh
	 **/
	public static volatile SingularAttribute<SloaiHinh, String> maLoaiHinh;
	
	/**
	 * @see com.pht.entity.SloaiHinh#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SloaiHinh, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SloaiHinh#id
	 **/
	public static volatile SingularAttribute<SloaiHinh, Long> id;
	
	/**
	 * @see com.pht.entity.SloaiHinh#tenLoaiHinh
	 **/
	public static volatile SingularAttribute<SloaiHinh, String> tenLoaiHinh;
	
	/**
	 * @see com.pht.entity.SloaiHinh
	 **/
	public static volatile EntityType<SloaiHinh> class_;
	
	/**
	 * @see com.pht.entity.SloaiHinh#ngayTao
	 **/
	public static volatile SingularAttribute<SloaiHinh, LocalDateTime> ngayTao;

	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NHOM_LOAI_HINH = "nhomLoaiHinh";
	public static final String MA_LOAI_HINH = "maLoaiHinh";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String TEN_LOAI_HINH = "tenLoaiHinh";
	public static final String NGAY_TAO = "ngayTao";

}

