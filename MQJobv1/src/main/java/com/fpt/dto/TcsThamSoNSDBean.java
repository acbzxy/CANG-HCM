/*
 * Created on Jul 24, 2009
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.fpt.dto;

/**
 * @author Nguyen Xuan Minh
 *
 * To change the template for this generated type comment go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class TcsThamSoNSDBean extends FMTBean{
	private String id;
	private String id_nhanvien;
	private String ma_ts;
	private String giatri;
	private String mo_ta;
	private String sap_xep;
	/**
	 * @return
	 */
	public String getGiatri() {
		return giatri;
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
	public String getId_nhanvien() {
		return id_nhanvien;
	}

	/**
	 * @return
	 */
	public String getMa_ts() {
		return ma_ts;
	}

	/**
	 * @return
	 */
	public String getMo_ta() {
		return mo_ta;
	}

	/**
	 * @return
	 */
	public String getSap_xep() {
		return sap_xep;
	}

	/**
	 * @param string
	 */
	public void setGiatri(String string) {
		giatri = string;
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
	public void setId_nhanvien(String string) {
		id_nhanvien = string;
	}

	/**
	 * @param string
	 */
	public void setMa_ts(String string) {
		ma_ts = string;
	}

	/**
	 * @param string
	 */
	public void setMo_ta(String string) {
		mo_ta = string;
	}

	/**
	 * @param string
	 */
	public void setSap_xep(String string) {
		sap_xep = string;
	}
}