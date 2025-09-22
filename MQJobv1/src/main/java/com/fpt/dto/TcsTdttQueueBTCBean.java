package com.fpt.dto;

import java.io.InputStream;
import java.sql.Clob;


public class TcsTdttQueueBTCBean {
	private String noi_gui ;
	private String chung_tu_id ;
	private String chu_ky_ktt ;
	private String ma_ktt ;
	private String ten_ktt ;
	private InputStream file_data;
	private Clob file_data_xml;
	private StringBuffer data_xml;
	private String pid;
	
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public Clob getFile_data_xml() {
		return file_data_xml;
	}
	public void setFile_data_xml(Clob file_data_xml) {
		this.file_data_xml = file_data_xml;
	}
	public String getNoi_gui() {
		return noi_gui;
	}
	public void setNoi_gui(String noi_gui) {
		this.noi_gui = noi_gui;
	}
	public String getChung_tu_id() {
		return chung_tu_id;
	}
	public void setChung_tu_id(String chung_tu_id) {
		this.chung_tu_id = chung_tu_id;
	}
	
	public InputStream getFile_data() {
		return file_data;
	}
	public void setFile_data(InputStream file_data) {
		this.file_data = file_data;
	}
	public String getChu_ky_ktt() {
		return chu_ky_ktt;
	}
	public void setChu_ky_ktt(String chu_ky_ktt) {
		this.chu_ky_ktt = chu_ky_ktt;
	}
	public String getMa_ktt() {
		return ma_ktt;
	}
	public void setMa_ktt(String ma_ktt) {
		this.ma_ktt = ma_ktt;
	}
	public String getTen_ktt() {
		return ten_ktt;
	}
	public void setTen_ktt(String ten_ktt) {
		this.ten_ktt = ten_ktt;
	}
	public StringBuffer getData_xml() {
		return data_xml;
	}
	public void setData_xml(StringBuffer data_xml) {
		this.data_xml = data_xml;
	}
	
}
