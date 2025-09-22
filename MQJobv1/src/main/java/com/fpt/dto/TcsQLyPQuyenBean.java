/*
 * TcsQLyPQuyenBean.java
 * 
 * Copyright FIS-PFS, Hà Nội, Việt Nam.
 */
package com.fpt.dto;

import com.fpt.util.json.JSONException;
import com.fpt.util.json.JSONObject;

/**
 * TcsQLyPQuyenBean class.<br>
 * 
 * @author Nguyen Xuan Minh
 * @version 1.0
 */
public class TcsQLyPQuyenBean extends FMTBean{
	private String ma_cn;
	private String ten;
	private String ma_menu;
	private String ma_toolbar;
	private String ma_form;
	private String luon_hien;
	private String pq_chitiet;
	private String cap;
	private String ma_cha;
	private String id;
	private String maNhom;
	private String tenNhom;
	private String del_id_list;
	private String add_id_list;
	private String ma_nh;
	private String ten_nh;
	/**
	 * @return
	 */
	public String getCap() {
		return cap;
	}

	/**
	 * @return
	 */
	public String getLuon_hien() {
		return luon_hien;
	}

	/**
	 * @return
	 */
	public String getMa_cha() {
		return ma_cha;
	}

	/**
	 * @return
	 */
	public String getMa_cn() {
		return ma_cn;
	}

	/**
	 * @return
	 */
	public String getMa_form() {
		return ma_form;
	}

	/**
	 * @return
	 */
	public String getMa_menu() {
		return ma_menu;
	}

	/**
	 * @return
	 */
	public String getMa_toolbar() {
		return ma_toolbar;
	}

	/**
	 * @return
	 */
	public String getPq_chitiet() {
		return pq_chitiet;
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
	public void setCap(String string) {
		cap = string;
	}

	/**
	 * @param string
	 */
	public void setLuon_hien(String string) {
		luon_hien = string;
	}

	/**
	 * @param string
	 */
	public void setMa_cha(String string) {
		ma_cha = string;
	}

	/**
	 * @param string
	 */
	public void setMa_cn(String string) {
		ma_cn = string;
	}

	/**
	 * @param string
	 */
	public void setMa_form(String string) {
		ma_form = string;
	}

	/**
	 * @param string
	 */
	public void setMa_menu(String string) {
		ma_menu = string;
	}

	/**
	 * @param string
	 */
	public void setMa_toolbar(String string) {
		ma_toolbar = string;
	}

	/**
	 * @param string
	 */
	public void setPq_chitiet(String string) {
		pq_chitiet = string;
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
	public String getMaNhom() {
		return maNhom;
	}

	/**
	 * @return
	 */
	public String getTenNhom() {
		return tenNhom;
	}

	/**
	 * @param string
	 */
	public void setMaNhom(String string) {
		maNhom = string;
	}

	/**
	 * @param string
	 */
	public void setTenNhom(String string) {
		tenNhom = string;
	}

	/**
	 * @return
	 */
	public String getDel_id_list() {
		return del_id_list;
	}

	/**
	 * @param string
	 */
	public void setDel_id_list(String string) {
		del_id_list = string;
	}

	/**
	 * @return
	 */
	public String getAdd_id_list() {
		return add_id_list;
	}

	/**
	 * @param string
	 */
	public void setAdd_id_list(String string) {
		add_id_list = string;
	}

	/**
	 * @return
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param string
	 */
	public void setId(String string) {
		id = string;
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
	
	public String toJSONString() throws JSONException {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("ten", this.ten);			
			return jsonObj.toString();
		}

}
