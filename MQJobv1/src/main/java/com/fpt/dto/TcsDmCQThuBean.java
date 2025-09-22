/*
 * Created on Jul 10, 2009
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.fpt.dto;

import com.fpt.util.json.JSONException;
import com.fpt.util.json.JSONObject;

/**
 * @author Le Manh Tuan
 *
 * To change the template for this generated type comment go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class TcsDmCQThuBean extends FMTBean {
	
	private String ma_cqthu;
	private String ten;
	private String shkb;
	private String ma_cqthu_cu;
	private String ma_hq;
	private String ten_kb;
	private String yn_online;
	private String del_macqthu_list;
	
	public TcsDmCQThuBean(){
		super();
	}
	public TcsDmCQThuBean(String ma_cqthu,
	 String ten,
	 String shkb,
	 String ma_cqthu_cu,
	 String ma_hq,
	 String del_macqthu_list )
	 {
		super();
		this.ma_cqthu = ma_cqthu;
		this.ten = ten;
		this.shkb = shkb;
		this.ma_cqthu_cu = ma_cqthu_cu;
		this.ma_hq = ma_hq;
		this.del_macqthu_list = del_macqthu_list;
	 }
	
	/**
	 * @return Returns the ma_hq.
	 */
	public String getMa_hq() {
		return ma_hq;
	}
	/**
	 * @param ma_hq The ma_hq to set.
	 */
	public void setMa_hq(String ma_hq) {
		this.ma_hq = ma_hq;
	}
	
	/**
	 * @return
	 */
	public String getMa_cqthu() {
		return ma_cqthu;
	}

	/**
	 * @return
	 */
	public String getMa_cqthu_cu() {
		return ma_cqthu_cu;
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
	public void setMa_cqthu(String string) {
		ma_cqthu = string;
	}

	/**
	 * @param string
	 */
	public void setMa_cqthu_cu(String string) {
		ma_cqthu_cu = string;
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
	public String getDel_macqthu_list() {
		return del_macqthu_list;
	}

	/**
	 * @param string
	 */
	public void setDel_macqthu_list(String string) {
		del_macqthu_list = string;
	}

	/**
	 * @return Returns the ten_kb.
	 */
	public String getTen_kb() {
		return ten_kb;
	}
	/**
	 * @param ten_kb The ten_kb to set.
	 */
	public void setTen_kb(String ten_kb) {
		this.ten_kb = ten_kb;
	}
	
	public String toJSONString() throws JSONException{
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("ma_cqthu", this.ma_cqthu);
		jsonObj.put("ten", this.ten);		
		return jsonObj.toString();
	}
	/**
	 * @return the yn_online
	 */
	public String getYn_online() {
		return yn_online;
	}
	/**
	 * @param yn_online the yn_online to set
	 */
	public void setYn_online(String yn_online) {
		this.yn_online = yn_online;
	}
}
