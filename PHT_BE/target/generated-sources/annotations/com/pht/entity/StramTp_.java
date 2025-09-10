package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(StramTp.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class StramTp_ {

	
	/**
	 * @see com.pht.entity.StramTp#diaChi
	 **/
	public static volatile SingularAttribute<StramTp, String> diaChi;
	
	/**
	 * @see com.pht.entity.StramTp#tenGiaoDich
	 **/
	public static volatile SingularAttribute<StramTp, String> tenGiaoDich;
	
	/**
	 * @see com.pht.entity.StramTp#tenTramTp
	 **/
	public static volatile SingularAttribute<StramTp, String> tenTramTp;
	
	/**
	 * @see com.pht.entity.StramTp#trangThai
	 **/
	public static volatile SingularAttribute<StramTp, String> trangThai;
	
	/**
	 * @see com.pht.entity.StramTp#masothue
	 **/
	public static volatile SingularAttribute<StramTp, String> masothue;
	
	/**
	 * @see com.pht.entity.StramTp#ngayCapNhat
	 **/
	public static volatile SingularAttribute<StramTp, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.StramTp#id
	 **/
	public static volatile SingularAttribute<StramTp, Long> id;
	
	/**
	 * @see com.pht.entity.StramTp
	 **/
	public static volatile EntityType<StramTp> class_;
	
	/**
	 * @see com.pht.entity.StramTp#maTramTp
	 **/
	public static volatile SingularAttribute<StramTp, String> maTramTp;
	
	/**
	 * @see com.pht.entity.StramTp#ngayTao
	 **/
	public static volatile SingularAttribute<StramTp, LocalDateTime> ngayTao;

	public static final String DIA_CHI = "diaChi";
	public static final String TEN_GIAO_DICH = "tenGiaoDich";
	public static final String TEN_TRAM_TP = "tenTramTp";
	public static final String TRANG_THAI = "trangThai";
	public static final String MASOTHUE = "masothue";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_TRAM_TP = "maTramTp";
	public static final String NGAY_TAO = "ngayTao";

}

