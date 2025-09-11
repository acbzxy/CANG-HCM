package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(ChukySo.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ChukySo_ {

	
	/**
	 * @see com.pht.entity.ChukySo#serialNumber
	 **/
	public static volatile SingularAttribute<ChukySo, String> serialNumber;
	
	/**
	 * @see com.pht.entity.ChukySo#ghiChu
	 **/
	public static volatile SingularAttribute<ChukySo, String> ghiChu;
	
	/**
	 * @see com.pht.entity.ChukySo#subject
	 **/
	public static volatile SingularAttribute<ChukySo, String> subject;
	
	/**
	 * @see com.pht.entity.ChukySo#certificateData
	 **/
	public static volatile SingularAttribute<ChukySo, String> certificateData;
	
	/**
	 * @see com.pht.entity.ChukySo#thumbprint
	 **/
	public static volatile SingularAttribute<ChukySo, String> thumbprint;
	
	/**
	 * @see com.pht.entity.ChukySo#validFrom
	 **/
	public static volatile SingularAttribute<ChukySo, LocalDateTime> validFrom;
	
	/**
	 * @see com.pht.entity.ChukySo#publicKey
	 **/
	public static volatile SingularAttribute<ChukySo, String> publicKey;
	
	/**
	 * @see com.pht.entity.ChukySo#isActive
	 **/
	public static volatile SingularAttribute<ChukySo, Boolean> isActive;
	
	/**
	 * @see com.pht.entity.ChukySo#issuer
	 **/
	public static volatile SingularAttribute<ChukySo, String> issuer;
	
	/**
	 * @see com.pht.entity.ChukySo#signatureAlgorithm
	 **/
	public static volatile SingularAttribute<ChukySo, String> signatureAlgorithm;
	
	/**
	 * @see com.pht.entity.ChukySo#privateKey
	 **/
	public static volatile SingularAttribute<ChukySo, String> privateKey;
	
	/**
	 * @see com.pht.entity.ChukySo#password
	 **/
	public static volatile SingularAttribute<ChukySo, String> password;
	
	/**
	 * @see com.pht.entity.ChukySo#isDefault
	 **/
	public static volatile SingularAttribute<ChukySo, Boolean> isDefault;
	
	/**
	 * @see com.pht.entity.ChukySo#tenDoanhNghiep
	 **/
	public static volatile SingularAttribute<ChukySo, String> tenDoanhNghiep;
	
	/**
	 * @see com.pht.entity.ChukySo#trangThai
	 **/
	public static volatile SingularAttribute<ChukySo, String> trangThai;
	
	/**
	 * @see com.pht.entity.ChukySo#maSoThue
	 **/
	public static volatile SingularAttribute<ChukySo, String> maSoThue;
	
	/**
	 * @see com.pht.entity.ChukySo#loaiChuKy
	 **/
	public static volatile SingularAttribute<ChukySo, String> loaiChuKy;
	
	/**
	 * @see com.pht.entity.ChukySo#id
	 **/
	public static volatile SingularAttribute<ChukySo, Long> id;
	
	/**
	 * @see com.pht.entity.ChukySo
	 **/
	public static volatile EntityType<ChukySo> class_;
	
	/**
	 * @see com.pht.entity.ChukySo#hashAlgorithm
	 **/
	public static volatile SingularAttribute<ChukySo, String> hashAlgorithm;
	
	/**
	 * @see com.pht.entity.ChukySo#validTo
	 **/
	public static volatile SingularAttribute<ChukySo, LocalDateTime> validTo;
	
	/**
	 * @see com.pht.entity.ChukySo#maDoanhNghiep
	 **/
	public static volatile SingularAttribute<ChukySo, String> maDoanhNghiep;

	public static final String SERIAL_NUMBER = "serialNumber";
	public static final String GHI_CHU = "ghiChu";
	public static final String SUBJECT = "subject";
	public static final String CERTIFICATE_DATA = "certificateData";
	public static final String THUMBPRINT = "thumbprint";
	public static final String VALID_FROM = "validFrom";
	public static final String PUBLIC_KEY = "publicKey";
	public static final String IS_ACTIVE = "isActive";
	public static final String ISSUER = "issuer";
	public static final String SIGNATURE_ALGORITHM = "signatureAlgorithm";
	public static final String PRIVATE_KEY = "privateKey";
	public static final String PASSWORD = "password";
	public static final String IS_DEFAULT = "isDefault";
	public static final String TEN_DOANH_NGHIEP = "tenDoanhNghiep";
	public static final String TRANG_THAI = "trangThai";
	public static final String MA_SO_THUE = "maSoThue";
	public static final String LOAI_CHU_KY = "loaiChuKy";
	public static final String ID = "id";
	public static final String HASH_ALGORITHM = "hashAlgorithm";
	public static final String VALID_TO = "validTo";
	public static final String MA_DOANH_NGHIEP = "maDoanhNghiep";

}

