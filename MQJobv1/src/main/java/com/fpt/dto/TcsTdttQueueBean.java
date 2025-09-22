package com.fpt.dto;

import java.io.InputStream;
import java.sql.Blob;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TcsTdttQueueBean {
	private String pkg_id;
	private String parent_id;
	private String tsn_code;
	private String tran_num;
	private String lcn_send;
	private String lcn_recv;
	// private String send_date ;
	private String lcn_owner;
	private String pid;
	private String file_hash;
	private byte[] file_data;

	private byte[] file_ky;
	private InputStream data;
	private Blob data_Blob2;

	// hoangnt10
	private String xml;

	// private String error_code ;
	// private String error_desc ;

//	public byte[] getFile_ky() {
//		return file_ky;
//	}
//
//	public void setFile_ky(byte[] file_ky) {
//		this.file_ky = file_ky;
//	}
//
//	public Blob getData_Blob2() {
//		return data_Blob2;
//	}
//
//	public void setData_Blob2(Blob data_Blob2) {
//		this.data_Blob2 = data_Blob2;
//	}
//
//	public InputStream getData() {
//		return data;
//	}
//
//	public void setData(InputStream data) {
//		this.data = data;
//	}

	private Long id;
	private String sender_code;

	private String sender_name;
	private String receiver_code;
	private String receiver_name;

	private String tran_code;

	private String msg_id;
	private String msg_fefid;

	private String id_link;

	private String send_date;

	private String orignal_code;

	private String orignal_name;
	private String orignal_date;
	private String error_code;
	private String error_desc;
	private String status;

	private String sts_verify;

	private byte[] data_blob;
	private byte[] data_blob_4;// nghiapt

	private String err_log;
	private String notes;

//	public Long getId() {
//		return id;
//	}
//
//	public void setId(Long id) {
//		this.id = id;
//	}
//
//	public String getSender_code() {
//		return sender_code;
//	}
//
//	public void setSender_code(String sender_code) {
//		this.sender_code = sender_code;
//	}
//
//	public String getSender_name() {
//		return sender_name;
//	}
//
//	public void setSender_name(String sender_name) {
//		this.sender_name = sender_name;
//	}
//
//	public String getReceiver_code() {
//		return receiver_code;
//	}
//
//	public void setReceiver_code(String receiver_code) {
//		this.receiver_code = receiver_code;
//	}
//
//	public String getReceiver_name() {
//		return receiver_name;
//	}
//
//	public void setReceiver_name(String receiver_name) {
//		this.receiver_name = receiver_name;
//	}
//
//	public String getTran_code() {
//		return tran_code;
//	}
//
//	public void setTran_code(String tran_code) {
//		this.tran_code = tran_code;
//	}
//
//	public String getMsg_id() {
//		return msg_id;
//	}
//
//	public void setMsg_id(String msg_id) {
//		this.msg_id = msg_id;
//	}
//
//	public String getMsg_fefid() {
//		return msg_fefid;
//	}
//
//	public void setMsg_fefid(String msg_fefid) {
//		this.msg_fefid = msg_fefid;
//	}
//
//	public String getId_link() {
//		return id_link;
//	}
//
//	public void setId_link(String id_link) {
//		this.id_link = id_link;
//	}
//
//	public String getOrignal_code() {
//		return orignal_code;
//	}
//
//	public void setOrignal_code(String orignal_code) {
//		this.orignal_code = orignal_code;
//	}
//
//	public String getOrignal_name() {
//		return orignal_name;
//	}
//
//	public void setOrignal_name(String orignal_name) {
//		this.orignal_name = orignal_name;
//	}
//
//	public String getOrignal_date() {
//		return orignal_date;
//	}
//
//	public void setOrignal_date(String orignal_date) {
//		this.orignal_date = orignal_date;
//	}
//
//	public String getStatus() {
//		return status;
//	}
//
//	public void setStatus(String status) {
//		this.status = status;
//	}
//
//	public String getSts_verify() {
//		return sts_verify;
//	}
//
//	public void setSts_verify(String sts_verify) {
//		this.sts_verify = sts_verify;
//	}
//
//	public byte[] getData_blob() {
//		return data_blob;
//	}
//
//	public void setData_blob(byte[] data_blob) {
//		this.data_blob = data_blob;
//	}
//
//	public String getErr_log() {
//		return err_log;
//	}
//
//	public void setErr_log(String err_log) {
//		this.err_log = err_log;
//	}
//
//	public String getNotes() {
//		return notes;
//	}
//
//	public void setNotes(String notes) {
//		this.notes = notes;
//	}
//
//	public void setSend_date(String send_date) {
//		this.send_date = send_date;
//	}
//
//	public String getSend_date() {
//		return send_date;
//	}
//
//	public TcsTdttQueueBean() {
//
//	}
//
//	public String getPkg_id() {
//		return pkg_id;
//	}
//
//	public void setPkg_id(String pkg_id) {
//		this.pkg_id = pkg_id;
//	}
//
//	public String getParent_id() {
//		return parent_id;
//	}
//
//	public void setParent_id(String parent_id) {
//		this.parent_id = parent_id;
//	}
//
//	public String getTsn_code() {
//		return tsn_code;
//	}
//
//	public void setTsn_code(String tsn_code) {
//		this.tsn_code = tsn_code;
//	}
//
//	public String getTran_num() {
//		return tran_num;
//	}
//
//	public void setTran_num(String tran_num) {
//		this.tran_num = tran_num;
//	}
//
//	public String getLcn_send() {
//		return lcn_send;
//	}
//
//	public void setLcn_send(String lcn_send) {
//		this.lcn_send = lcn_send;
//	}
//
//	public String getLcn_recv() {
//		return lcn_recv;
//	}
//
//	public void setLcn_recv(String lcn_recv) {
//		this.lcn_recv = lcn_recv;
//	}
//
//	public String getLcn_owner() {
//		return lcn_owner;
//	}
//
//	public void setLcn_owner(String lcn_owner) {
//		this.lcn_owner = lcn_owner;
//	}
//
//	public String getPid() {
//		return pid;
//	}
//
//	public void setPid(String pid) {
//		this.pid = pid;
//	}
//
//	public String getFile_hash() {
//		return file_hash;
//	}
//
//	public void setFile_hash(String file_hash) {
//		this.file_hash = file_hash;
//	}
//
//	public byte[] getFile_data() {
//		return file_data;
//	}
//
//	public void setFile_data(byte[] file_data) {
//		this.file_data = file_data;
//	}
//
//	public String getError_code() {
//		return error_code;
//	}
//
//	public void setError_code(String error_code) {
//		this.error_code = error_code;
//	}
//
//	public String getError_desc() {
//		return error_desc;
//	}
//
//	public void setError_desc(String error_desc) {
//		this.error_desc = error_desc;
//	}
//
//	public byte[] getData_blob_4() {
//		return data_blob_4;
//	}
//
//	public void setData_blob_4(byte[] data_blob_4) {
//		this.data_blob_4 = data_blob_4;
//	}
//
//	public String getXml() {
//		return xml;
//	}
//
//	public void setXml(String xml) {
//		this.xml = xml;
//	}
}
