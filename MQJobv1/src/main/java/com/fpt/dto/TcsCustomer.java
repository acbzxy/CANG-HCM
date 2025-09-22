package com.fpt.dto;

public class TcsCustomer {
	public static String STATUS_KS_THANH_CONG = "02";
	private String taxcode;
	private String status;
	private String cust_id_no;
	
	public TcsCustomer(String taxcode, String status) {
		super();
		this.taxcode = taxcode;
		this.status = status;
	}
	
	public String getTaxcode() {
		return taxcode;
	}
	public void setTaxcode(String taxcode) {
		this.taxcode = taxcode;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getCust_id_no() {
		return cust_id_no;
	}

	public void setCust_id_no(String cust_id_no) {
		this.cust_id_no = cust_id_no;
	}
	
}
