package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SphuongThucVanTai.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SphuongThucVanTai_ {

	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#tenPtvt1
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> tenPtvt1;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#dienGiai
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#trangThai
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> trangThai;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#id
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, Long> id;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#maPtvt
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> maPtvt;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai
	 **/
	public static volatile EntityType<SphuongThucVanTai> class_;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#vnacss
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> vnacss;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#ngayTao
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, LocalDateTime> ngayTao;
	
	/**
	 * @see com.pht.entity.SphuongThucVanTai#tenPtvt
	 **/
	public static volatile SingularAttribute<SphuongThucVanTai, String> tenPtvt;

	public static final String TEN_PTVT1 = "tenPtvt1";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_PTVT = "maPtvt";
	public static final String VNACSS = "vnacss";
	public static final String NGAY_TAO = "ngayTao";
	public static final String TEN_PTVT = "tenPtvt";

}

