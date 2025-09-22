package com.fpt.dto;

import java.io.InputStream;

public class TcsTdttXML {

	private String pkg_id;
	private String tsn_code;
	private String tran_num;
	private String tran_code;
	private String id;
	private String sender_code;
	private String receiver_code;
	private String sts_verify;
	private String path_sign;
	private String pos_sign;
	private String check_ky;

	public String getCheck_ky() {
		return check_ky;
	}

	public void setCheck_ky(String check_ky) {
		this.check_ky = check_ky;
	}

	public String getPath_sign() {
		return path_sign;
	}

	public void setPath_sign(String path_sign) {
		this.path_sign = path_sign;
	}

	public String getPos_sign() {
		return pos_sign;
	}

	public void setPos_sign(String pos_sign) {
		this.pos_sign = pos_sign;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSender_code() {
		return sender_code;
	}

	public void setSender_code(String sender_code) {
		this.sender_code = sender_code;
	}

	public String getReceiver_code() {
		return receiver_code;
	}

	public void setReceiver_code(String receiver_code) {
		this.receiver_code = receiver_code;
	}

	public String getSts_verify() {
		return sts_verify;
	}

	public void setSts_verify(String sts_verify) {
		this.sts_verify = sts_verify;
	}

	private InputStream file_data;

	public String getPkg_id() {
		return pkg_id;
	}

	public void setPkg_id(String pkg_id) {
		this.pkg_id = pkg_id;
	}

	public InputStream getFile_data() {
		return file_data;
	}

	public void setFile_data(InputStream file_data) {
		this.file_data = file_data;
	}

	public String getTsn_code() {
		return tsn_code;
	}

	public void setTsn_code(String tsn_code) {
		this.tsn_code = tsn_code;
	}

	public String getTran_num() {
		return tran_num;
	}

	public void setTran_num(String tran_num) {
		this.tran_num = tran_num;
	}

	public void setTran_code(String tran_code) {
		this.tran_code = tran_code;
	}

	public String getTran_code() {
		return tran_code;
	}
}