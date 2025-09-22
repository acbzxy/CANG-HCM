/*
 * Created on Jul 14, 2009
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.fpt.dto;

import com.fpt.util.json.JSONException;
import com.fpt.util.json.JSONObject;

/**
 * @author ThanhNH7
 *
 * To change the template for this generated type comment go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class TcsDmCQKhoBacBean extends FMTBean {
    
     private String shkb ;
     private String ten;
     private String ma_dbhc ;
	 private String ten_dbhc ;
     private String ma_nh ;
	 private String ten_nh ;
     private String shkbcha;
     private String tai_khoan;
     private String ten_tai_khoan;
     private String maNhom;
     private String tenNhom;
     private String id;
     private String tk_gl_blt;
     
	 //
	 private String del_id_list;
	 public TcsDmCQKhoBacBean(){
						super();
			}
	 public TcsDmCQKhoBacBean(String shkb,
							  String ten,
							  String ma_dbhc,
							  String shkbcha,
	                          String ma_nh,
							  String ten_tai_khoan,
							  String del_id_list){
		super();
		this.shkb = shkb ;
		this.ten = ten;
		this.ma_dbhc = ma_dbhc ;
		this.shkbcha = shkbcha ;
		this.ma_nh = ma_nh;
		this.ten_tai_khoan = ten_tai_khoan;
		this.del_id_list = del_id_list;
		
	}
	/* public String toJSONString() throws JSONException {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("TEN_DBHC", this.ten_dbhc);
		//jsonObj.put("TEN_CQTHU", this.TEN_CQTHU);
		//jsonObj.put("TEN_PGD", this.TEN_PGD);
		return jsonObj.toString();
	}*/
	

     
	/**
	 * @return
	 */
	public String getDel_id_list() {
		return del_id_list;
	}

	/**
	 * @return
	 */
	public String getMa_dbhc() {
		return ma_dbhc;
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
	public void setMa_dbhc(String string) {
		ma_dbhc = string;
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
	public void setTen(String string) {
		ten = string;
	}

	/**
	 * @return
	 */
	public String getTen_dbhc() {
		return ten_dbhc;
	}

	/**
	 * @param string
	 */
	public void setTen_dbhc(String string) {
		ten_dbhc = string;
	}

	/**
	 * @return
	 */
	public String getShkbcha() {
		return shkbcha;
	}

	/**
	 * @param string
	 */
	public void setShkbcha(String string) {
		shkbcha = string;
	}

	/**
	 * @return
	 */
	public String getTai_khoan() {
		return tai_khoan;
	}

	/**
	 * @param string
	 */
	public void setTai_khoan(String string) {
		tai_khoan = string;
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
	public String getMa_nh() {
		return ma_nh;
	}

	/**
	 * @param string
	 */
	public void setMa_nh(String string) {
		ma_nh = string;
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
	public void setTen_nh(String string) {
		ten_nh = string;
	}

	/**
	 * @return
	 */
	public String getTen_tai_khoan() {
		return ten_tai_khoan;
	}

	/**
	 * @param string
	 */
	public void setTen_tai_khoan(String string) {
		ten_tai_khoan = string;
	}
public String toJSONString() throws JSONException {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("shkb", this.shkb);
			jsonObj.put("ten", this.ten);
			jsonObj.put("ma_dbhc", this.ma_dbhc);
			jsonObj.put("ten_dbhc", this.ten_dbhc);
			jsonObj.put("tai_khoan", this.tai_khoan);
			jsonObj.put("ten_tai_khoan", this.ten_tai_khoan);
			jsonObj.put("ma_nh", this.ma_nh);
			jsonObj.put("ten_nh", this.ten_nh);
			return jsonObj.toString();
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
	 * @return Returns the tk_gl_blt.
	 */
	public String getTk_gl_blt() {
		return tk_gl_blt;
	}
	/**
	 * @param tk_gl_blt The tk_gl_blt to set.
	 */
	public void setTk_gl_blt(String tk_gl_blt) {
		this.tk_gl_blt = tk_gl_blt;
	}
}
