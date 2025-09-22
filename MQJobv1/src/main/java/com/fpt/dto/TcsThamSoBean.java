/*
 * TcsThamSoBean.java
 * 
 * Copyright PFS Co, Việt Nam
 */
package com.fpt.dto;

/**
 * TcsThamSoBean class.<br>
 * <pre>
 * 		Lớp này định nghĩa các thuộc tính và các phương thức setter & getter tương ứng trong bảng tcs tham số.	
 * </pre>
 * 
 * @author Nguyen Xuan Minh
 * @version 1.0
 */
public class TcsThamSoBean extends FMTBean {
	private String id = null;
	private String shkb = null;
	private String ma_ts = null;
	private String giatri = null;
	private String loai = null;
	private String mo_ta = null;
	private String sap_xep = null;

	/**
	 * getGiatri method.<br>
	 * 
	 * @return giatri.
	 */
	public String getGiatri() {
		return giatri;
	}

	/**
	 * getId method.<br>
	 * 
	 * @return id
	 */
	public String getId() {
		return id;
	}

	/**
	 * getLoai method.<br>
	 * 
	 * @return loai
	 */
	public String getLoai() {
		return loai;
	}

	/**
	 * getMa_ts method.<br>
	 * 
	 * @return ma_ts
	 */
	public String getMa_ts() {
		return ma_ts;
	}

	/**
	 * getMo_ta method.<br>
	 * 
	 * @return mo_ta
	 */
	public String getMo_ta() {
		return mo_ta;
	}

	/**
	 * getSap_xep method.<br>
	 * 
	 * @return sap_xep
	 */
	public String getSap_xep() {
		return sap_xep;
	}

	/**
	 * getShkb method.<br>
	 * 
	 * @return shkb
	 */
	public String getShkb() {
		return shkb;
	}

	/**
	 * setGiatri method.<br>
	 * 
	 * @param string giatri.
	 */
	public void setGiatri(String string) {
		giatri = string;
	}

	/**
	 * setId method.<br>
	 * 
	 * @param string id.
	 */
	public void setId(String string) {
		id = string;
	}

	/**
	 * setLoai method.<br>
	 * 
	 * @param string loai
	 */
	public void setLoai(String string) {
		loai = string;
	}

	/**
	 * setMa_ts method.<br>
	 * 
	 * @param string ma_ts
	 */
	public void setMa_ts(String string) {
		ma_ts = string;
	}

	/**
	 * setMo_ta method.<br>
	 * 
	 * @param string mo_ta
	 */
	public void setMo_ta(String string) {
		mo_ta = string;
	}

	/**
	 * setSap_xep method.<br>
	 * 
	 * @param string asp_xep
	 */
	public void setSap_xep(String string) {
		sap_xep = string;
	}

	/**
	 * setShkb method.<br>
	 * 
	 * @param string shkb
	 */
	public void setShkb(String string) {
		shkb = string;
	}
}
