package com.pht.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;

@StaticMetamodel(SdiaDiemLuuKho.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SdiaDiemLuuKho_ {

	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#tenDiaDiemTcVN
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> tenDiaDiemTcVN;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#dienGiai
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> dienGiai;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#trangThai
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> trangThai;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#tenDiaDiem
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> tenDiaDiem;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#loai
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> loai;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#diaDiem
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> diaDiem;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#ngayCapNhat
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, LocalDateTime> ngayCapNhat;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#id
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, Long> id;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#maDiaDiemLuuKho
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, String> maDiaDiemLuuKho;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho
	 **/
	public static volatile EntityType<SdiaDiemLuuKho> class_;
	
	/**
	 * @see com.pht.entity.SdiaDiemLuuKho#ngayTao
	 **/
	public static volatile SingularAttribute<SdiaDiemLuuKho, LocalDateTime> ngayTao;

	public static final String TEN_DIA_DIEM_TC_VN = "tenDiaDiemTcVN";
	public static final String DIEN_GIAI = "dienGiai";
	public static final String TRANG_THAI = "trangThai";
	public static final String TEN_DIA_DIEM = "tenDiaDiem";
	public static final String LOAI = "loai";
	public static final String DIA_DIEM = "diaDiem";
	public static final String NGAY_CAP_NHAT = "ngayCapNhat";
	public static final String ID = "id";
	public static final String MA_DIA_DIEM_LUU_KHO = "maDiaDiemLuuKho";
	public static final String NGAY_TAO = "ngayTao";

}

