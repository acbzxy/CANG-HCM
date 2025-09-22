/*
 * TcsDmucNSBean.java
 * 
 * Copyright FIS-PFS.
 */
package com.fpt.dto;


/**
 * TcsDmucNSDBean class.<br>
 * <pre>
 * 		
 * </pre>
 * @author Nguyen Xuan Minh
 * @version 1.0
 */
public class TcsDmucNSDBean extends FMTBean {
	private String id;
	private String shkb;
	private String ma_nv;
	private String mat_khau;
	private String ten;
	private String chuc_danh;
	private String tinh_trang;
	private String local_ip;
	private String phong_gd;
	private String ten_phong_gd;
	private String xac_nhan_mat_khau;
	private String ma_nh;
	private String ten_nh;
	
	
	private String del_id_list;
	private String p_shkb_login;
	private String quyen_max;
	private String ma_chinhanh;
	private String dinh_muc;
	private String dinh_muc_old;
	private String tai_khoan;
	private String ma_nh_pgd;
	
	
	/**
	 * @return Returns the ten_phong_gd.
	 */
	public String getTen_phong_gd() {
		return ten_phong_gd;
	}
	/**
	 * @param ten_phong_gd The ten_phong_gd to set.
	 */
	public void setTen_phong_gd(String ten_phong_gd) {
		this.ten_phong_gd = ten_phong_gd;
	}
	/**
	 * @return Returns the tai_khoan.
	 */
	public String getTai_khoan() {
		return tai_khoan;
	}
	/**
	 * @param tai_khoan The tai_khoan to set.
	 */
	public void setTai_khoan(String tai_khoan) {
		this.tai_khoan = tai_khoan;
	}
	/**
	 * @return Returns the ma_chinhanh.
	 */
	public String getMa_chinhanh() {
		return ma_chinhanh;
	}
	/**
	 * @param ma_chinhanh The ma_chinhanh to set.
	 */
	public void setMa_chinhanh(String ma_chinhanh) {
		this.ma_chinhanh = ma_chinhanh;
	}
	/**
	 * @return Returns the quyen_max.
	 */
	public String getQuyen_max() {
		return quyen_max;
	}
	/**
	 * @param quyen_max The quyen_max to set.
	 */
	public void setQuyen_max(String quyen_max) {
		this.quyen_max = quyen_max;
	}
	/**
	 * @return Returns the p_shkb_login.
	 */
	public String getP_shkb_login() {
		return p_shkb_login;
	}
	/**
	 * @param p_shkb_login The p_shkb_login to set.
	 */
	public void setP_shkb_login(String p_shkb_login) {
		this.p_shkb_login = p_shkb_login;
	}
	/**
	 * @return
	 */
	public String getChuc_danh() {
		return chuc_danh;
	}

	/**
	 * @return
	 */
	public String getId() {
		return id;
	}

	/**
	 * @return
	 */
	public String getLocal_ip() {
		return local_ip;
	}

	/**
	 * @return
	 */
	public String getMa_nv() {
		return ma_nv;
	}

	/**
	 * @return
	 */
	public String getShkb() {
		return shkb;
	}

	/**
	 * @return
	 */
	public String getTinh_trang() {
		return tinh_trang;
	}

	/**
	 * @param string
	 */
	public void setChuc_danh(String string) {
		chuc_danh = string;
	}

	/**
	 * @param string
	 */
	public void setId(String string) {
		id = string;
	}

	/**
	 * @param string
	 */
	public void setLocal_ip(String string) {
		local_ip = string;
	}

	/**
	 * @param string
	 */
	public void setMa_nv(String string) {
		ma_nv = string;
	}

	/**
	 * @param string
	 */
	public void setShkb(String string) {
		shkb = string;
	}

	/**
	 * @param string
	 */
	public void setTinh_trang(String string) {
		tinh_trang = string;
	}
	/**
	 * @return
	 */
	public String getDel_id_list() {
		return del_id_list;
	}

	/**
	 * @return
	 */
	public String getTen() {
		return ten;
	}

	/**
	 * @param string
	 */
	public void setDel_id_list(String string) {
		del_id_list = string;
	}

	/**
	 * @param string
	 */
	public void setTen(String string) {
		ten = string;
	}

	/**
	 * @return
	 */
	public String getMat_khau() {
		return mat_khau;
	}

	/**
	 * @param string
	 */
	public void setMat_khau(String string) {
		mat_khau = string;
	}

	/**
	 * @return
	 */
	public String getXac_nhan_mat_khau() {
		return xac_nhan_mat_khau;
	}

	/**
	 * @param string
	 */
	public void setXac_nhan_mat_khau(String string) {
		xac_nhan_mat_khau = string;
	}

	/**
	 * @return
	 */
	public String getPhong_gd() {
		return phong_gd;
	}


	/**
	 * @param string
	 */
	public void setPhong_gd(String string) {
		phong_gd = string;
	}
	/**
	 * @return
	 */
	public String getMa_nh() {
		return ma_nh;
	}

	/**
	 * @return
	 */
	public String getTen_nh() {
		return ten_nh;
	}

	/**
	 * @param string
	 */
	public void setMa_nh(String string) {
		ma_nh = string;
	}

	/**
	 * @param string
	 */
	public void setTen_nh(String string) {
		ten_nh = string;
	}
	/**
	 * @return
	 */
	public String getDinh_muc() {
		return dinh_muc;
	}
	/**
	 * @param string
	 */
	public void setDinh_muc(String dinh_muc) {
		this.dinh_muc = dinh_muc;
	}
	/**
	 * @return Returns the dinh_muc_old.
	 */
	public String getDinh_muc_old() {
		return dinh_muc_old;
	}
	/**
	 * @param dinh_muc_old The dinh_muc_old to set.
	 */
	public void setDinh_muc_old(String dinh_muc_old) {
		this.dinh_muc_old = dinh_muc_old;
	}
	/**
	 * @param ma_nh_pgd the ma_nh_pgd to set
	 */
	public void setMa_nh_pgd(String ma_nh_pgd) {
		this.ma_nh_pgd = ma_nh_pgd;
	}
	/**
	 * @return the ma_nh_pgd
	 */
	public String getMa_nh_pgd() {
		return ma_nh_pgd;
	}
}