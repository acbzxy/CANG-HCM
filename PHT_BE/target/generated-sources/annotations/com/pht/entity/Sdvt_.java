package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(Sdvt.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Sdvt_ {

	
	/**
	 * @see com.pht.entity.Sdvt#tenDvt
	 **/
	public static volatile SingularAttribute<Sdvt, String> tenDvt;
	
	/**
	 * @see com.pht.entity.Sdvt#maDvt
	 **/
	public static volatile SingularAttribute<Sdvt, String> maDvt;
	
	/**
	 * @see com.pht.entity.Sdvt#loaiDvt
	 **/
	public static volatile SingularAttribute<Sdvt, String> loaiDvt;
	
	/**
	 * @see com.pht.entity.Sdvt#dienGiai
	 **/
	public static volatile SingularAttribute<Sdvt, String> dienGiai;
	
	/**
	 * @see com.pht.entity.Sdvt#trangThai
	 **/
	public static volatile SingularAttribute<Sdvt, String> trangThai;
	
	/**
	 * @see com.pht.entity.Sdvt#ngayCapNhat
	 **/
	public static volatile SingularAttribute<Sdvt, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.Sdvt#id
	 **/
	public static volatile SingularAttribute<Sdvt, Long> id;
	
	/**
	 * @see com.pht.entity.Sdvt
	 **/
	public static volatile EntityType<Sdvt> class_;
	
	/**
	 * @see com.pht.entity.Sdvt#ngayTao
	 **/
	public static volatile SingularAttribute<Sdvt, LocalDateTime> ngayTao;

	public static final String TEN_DVT = "tenDvt";
	public static final String MA_DVT = "maDvt";
	public static final String LOAI_DVT = "loaiDvt";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String NGAY_TAO = "ngayTao";

}

