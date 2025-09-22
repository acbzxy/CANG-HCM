/*
 * TcsLoginBean.java
 * 
 * All Rights Reserved.
 * Copyright (c)  2009 FPS Viet Nam Co., Ltd.
 */
package com.fpt.dto;


/**
 * TcsLoginBean class.<br>
 * <pre>
 * 	Class này thực hiện chức năng đăng nhập hệ thống.
 * </pre>
 * 
 * @author Nguyen Xuan Minh
 * @version 1.0
 */
public class TcsLoginBean extends FMTBean{
	
	private String id = null;
	private String user_name = null;
	private String user_pass = null;
	private String local_ip = null;
	private String MA_NH;
	private String TEN_NH;
	private String shkb;
	public TcsLoginBean(){
		super();
	}
	
	/**
	 * Get user name.<br>
	 * 
	 * @return user_name
	 */
	public String getUser_name() {
		return user_name;
	}

	/**
	 * Get user pass.<br>
	 * 
	 * @return user_pass
	 */
	public String getUser_pass() {
		return user_pass;
	}

	/**
	 * Set user name.<br>
	 * 
	 * @param string user_name
	 */
	public void setUser_name(String string) {
		user_name = string;
	}

	/**
	 * Set user pass.<br>
	 * 
	 * @param string user_pass
	 */
	public void setUser_pass(String string) {
		user_pass = string;
	}
	
	/**
	 * Get local ip.<br>
	 * 
	 * @return local_ip
	 */
	public String getLocal_ip() {
		return local_ip;
	}

	/**
	 * Get local ip.<br>
	 * 
	 * @param string local_ip
	 */
	public void setLocal_ip(String string) {
		local_ip = string;
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
	public String getMA_NH() {
		return MA_NH;
	}

	/**
	 * @return
	 */
	public String getTEN_NH() {
		return TEN_NH;
	}

	/**
	 * @param string
	 */
	public void setMA_NH(String string) {
		MA_NH = string;
	}

	/**
	 * @param string
	 */
	public void setTEN_NH(String string) {
		TEN_NH = string;
	}

	/**
	 * @return
	 */
	public String getShkb() {
		return shkb;
	}

	/**
	 * @param string
	 */
	public void setShkb(String string) {
		shkb = string;
	}

}