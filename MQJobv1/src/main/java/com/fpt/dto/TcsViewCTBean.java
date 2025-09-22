/*
 * Created on Aug 3, 2009
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.fpt.dto;

/**
 * @author Le Hong Ha
 *
 *         To change the template for this generated type comment go to
 *         Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class TcsViewCTBean extends FMTBean {
	private String shkb;
	private String ngay_Kb;
	// branchID quy dinh trong core
	private String ma_core_nh;
	// ma phi tuong ung cua giao dich
	private String fee_code;
	private String fee_code_desc;
	private String tk_ns_hq;
	private String ma_loaitien;
	// ma giao dich tuong ung trong core
	private String ft_number;
	private String ma_Nv;
	private String so_Bt;
	private String ma_Dthu;

	private String ten_Nv;
	private String ten_Kb;

	private String so_Bthu;
	private String kyhieu_Ct;
	private String so_Ct;
	private String ma_Nnthue;
	private String ten_Nnthue;
	private String dc_Nnthue;
	private String huyen_Nnthue;
	private String tinh_Nnthue;
	private String ma_Nntien;
	private String ten_Nntien;
	private String dc_Nntien;
	private String ngay_Ct;
	private String ngay_Ht;
	private String ma_Ks;
	private String ten_Ks;
	private String ma_Tq;
	private String ten_Tq;
	private String ma_Dbhc;
	private String ten_Dbhc;
	private String tk_Co;
	private String ten_Tk_Co;
	private String tk_No;
	private String ten_Tk_No;
	private String ma_Cqthu;
	private String ten_Cqthu;
	private String ma_Lthue;
	private String ten_Lthue;
	private String so_Khung;
	private String so_May;
	private String so_Tk;
	private String ngay_Tk;
	private String lhxnk;
	private String vt_Lhxnk;
	private String ten_Lhxnk;
	private String ma_Nt;
	private String ten_Nt;
	private String ty_Gia;
	private String so_Bk;
	private String ngay_Bk;
	private String so_Ct_Nh;
	private String tk_Kh_Nh;
	private String ngay_Kh_Nh;
	private String ma_Nh_A;
	private String ten_Nh_A;
	private String ma_Nh_B;
	private String ten_Nh_B;
	private String so_Qd;
	private String ngay_Qd;
	private String cq_Qd;
	private String dvsdns;
	private String ten_Dvsdns;
	private String tk_Kh_Nhan;
	private String ten_Kh_Nhan;
	private String diachi_Kh_Nhan;
	private String ttien;
	private String ttien_Tthu;
	private String ttien_Nt;
	private String lan_In;
	private String trang_Thai;
	private String trang_Thai_Kx;
	private String ghi_Chu;
	private String tk_Ns;
	private String ten_Tk_Ns;
	private String phuong_Thuc;
	private String hinh_Thuc;
	private String kb_Thu_Ho;
	private String ten_Kb_Thu_Ho;

	private String ma_Quy;
	private String ma_Cap;
	private String ma_Chuong;
	private String ma_Nkt;
	private String ma_Nkt_Cha;
	private String ma_Ndkt;
	private String ma_Ndkt_Cha;
	private String ma_Tlpc;
	private String ma_Khtk;
	private String noi_Dung;
	private String ky_Thue;
	private String sotien;
	private String sotien_Nt;
	private String ma_Dp;

	private String tong_Hop;
	private String manv_Sobt;
	private String key_Ctu;
	private String tong_Tien;
	private String page_Count;
	private String ctu_Count;

	private String gio_doichieu;
	// Cac truong phuc vu cho truy van Hai Quan
	private String sender_code;
	private String sender_name;

	private String response_code;
	private String loai_thue_hq;
	private String res_hq;
	private String transHq_id;
	private String key_ctu_htoan;
	private String msg_err_core;
	private String ma_hq_ph;
	private String error_code_hq;
	private String transid_huy;
	private String response_huy;
	private String dien_giai;
	private String is_ma_hq;
	private String ngay_dc_hq;
	private String loai_dl;
	// HUNGXH Update
	private String ma_nh_phucvu_nnt;
	private String ten_nh_phucvu_nnt;
	private String ngay_nthue;
	private String ma_nguoi_nthay;
	private String so_thongbao;
	private String yn_online;
	private String ben_Bank_Code;
	private String ben_Bank_Name;
	private String ma_citad;
	private String ten_citad;
	private String ma_citad_tt;
	private String ten_citad_tt;
	// private String nguoi_ntien;
	private String resp_thue;
	private String so_bt_hq;
	private String tk_thu_phi;
	private String ttk_thu_phi;
	private String tien_phi;
	private String in_ctu_ks;
	private String nop_ho;
	private String so_du_cuoi;
	private String ma_hq;
	private String taxItemNumber;
	private String cmnd;
	private String loai_kh;
	private String tax_detail_list;
	private String cif;
	private String core_cutting;
	private String msg_inbox;

	private String ma_gdich;

	public String getCmnd() {
		return cmnd;
	}

	public void setCmnd(String cmnd) {
		this.cmnd = cmnd;
	}

	public String getLoai_kh() {
		return loai_kh;
	}

	public void setLoai_kh(String loai_kh) {
		this.loai_kh = loai_kh;
	}

	public String getTax_detail_list() {
		return tax_detail_list;
	}

	public void setTax_detail_list(String tax_detail_list) {
		this.tax_detail_list = tax_detail_list;
	}

	public String getCore_cutting() {
		return core_cutting;
	}

	public void setCore_cutting(String core_cutting) {
		this.core_cutting = core_cutting;
	}

	/**
	 * @return the so_du_cuoi
	 */
	public String getSo_du_cuoi() {
		return so_du_cuoi;
	}

	/**
	 * @param so_du_cuoi the so_du_cuoi to set
	 */
	public void setSo_du_cuoi(String so_du_cuoi) {
		this.so_du_cuoi = so_du_cuoi;
	}

	/**
	 * @return the nop_ho
	 */
	public String getNop_ho() {
		return nop_ho;
	}

	/**
	 * @param nop_ho the nop_ho to set
	 */
	public void setNop_ho(String nop_ho) {
		this.nop_ho = nop_ho;
	}

	public String getResp_thue() {
		return resp_thue;
	}

	public void setResp_thue(String resp_thue) {
		this.resp_thue = resp_thue;
	}

	/**
	 * @return Returns the response_huy.
	 */
	public String getResponse_huy() {
		return response_huy;
	}

	/**
	 * @param response_huy The response_huy to set.
	 */
	public void setResponse_huy(String response_huy) {
		this.response_huy = response_huy;
	}

	/**
	 * @return Returns the transid_huy.
	 */
	public String getTransid_huy() {
		return transid_huy;
	}

	/**
	 * @param transid_huy The transid_huy to set.
	 */
	public void setTransid_huy(String transid_huy) {
		this.transid_huy = transid_huy;
	}

	/**
	 * @return Returns the msg_err_core.
	 */
	public String getMsg_err_core() {
		return msg_err_core;
	}

	/**
	 * @param msg_err_core The msg_err_core to set.
	 */
	public void setMsg_err_core(String msg_err_core) {
		this.msg_err_core = msg_err_core;
	}

	/**
	 * @return Returns the key_ctu_htoan.
	 */
	public String getKey_ctu_htoan() {
		return key_ctu_htoan;
	}

	/**
	 * @param key_ctu_htoan The key_ctu_htoan to set.
	 */
	public void setKey_ctu_htoan(String key_ctu_htoan) {
		this.key_ctu_htoan = key_ctu_htoan;
	}

	/**
	 * @return Returns the transHq_id.
	 */
	public String getTransHq_id() {
		return transHq_id;
	}

	/**
	 * @param transHq_id The transHq_id to set.
	 */
	public void setTransHq_id(String transHq_id) {
		this.transHq_id = transHq_id;
	}

	/**
	 * @return Returns the loai_thue_hq.
	 */
	public String getLoai_thue_hq() {
		return loai_thue_hq;
	}

	/**
	 * @param loai_thue_hq The loai_thue_hq to set.
	 */
	public void setLoai_thue_hq(String loai_thue_hq) {
		this.loai_thue_hq = loai_thue_hq;
	}

	/**
	 * @return Returns the res_hq.
	 */
	public String getRes_hq() {
		return res_hq;
	}

	/**
	 * @param res_hq The res_hq to set.
	 */
	public void setRes_hq(String res_hq) {
		this.res_hq = res_hq;
	}

	/**
	 * @return Returns the oldSysTrace.
	 */

	public String getOldSysTrace() {
		return oldSysTrace;
	}

	/**
	 * @param oldSysTrace The oldSysTrace to set.
	 */
	public void setOldSysTrace(String oldSysTrace) {
		this.oldSysTrace = oldSysTrace;
	}

	/**
	 * @return Returns the sysTrace.
	 */
	public String getSysTrace() {
		return sysTrace;
	}

	/**
	 * @param sysTrace The sysTrace to set.
	 */
	public void setSysTrace(String sysTrace) {
		this.sysTrace = sysTrace;
	}

	private int transaction_Type;
	private String transaction_Name;
	private String transaction_ID;
	private String transaction_Date;
	private String Signature;
	private String message_Version;

	// Phan su dungde truy van - kiem soat - Huy tai khoan ben CoreBanking
	private String sysTrace;
	private String oldSysTrace;
	private String ip_socket;
	private String port_socket;

	/**
	 * @return Returns the ip_socket.
	 */
	public String getIp_socket() {
		return ip_socket;
	}

	/**
	 * @param ip_socket The ip_socket to set.
	 */
	public void setIp_socket(String ip_socket) {
		this.ip_socket = ip_socket;
	}

	/**
	 * @return Returns the port_socket.
	 */
	public String getPort_socket() {
		return port_socket;
	}

	/**
	 * @param port_socket The port_socket to set.
	 */
	public void setPort_socket(String port_socket) {
		this.port_socket = port_socket;
	}

	/**
	 * @return Returns the gio_doichieu.
	 */
	public String getGio_doichieu() {
		return gio_doichieu;
	}

	/**
	 * @param gio_doichieu The gio_doichieu to set.
	 */
	public void setGio_doichieu(String gio_doichieu) {
		this.gio_doichieu = gio_doichieu;
	}

	public TcsViewCTBean() {
		super();
	}

	/**
	 * @return
	 */
	public String getCq_Qd() {
		return cq_Qd;
	}

	/**
	 * @return
	 */
	public String getDc_Nnthue() {
		return dc_Nnthue;
	}

	/**
	 * @return
	 */
	public String getDc_Nntien() {
		return dc_Nntien;
	}

	/**
	 * @return
	 */
	public String getDiachi_Kh_Nhan() {
		return diachi_Kh_Nhan;
	}

	/**
	 * @return
	 */
	public String getDvsdns() {
		return dvsdns;
	}

	/**
	 * @return
	 */
	public String getGhi_Chu() {
		return ghi_Chu;
	}

	/**
	 * @return
	 */
	public String getHinh_Thuc() {
		return hinh_Thuc;
	}

	/**
	 * @return
	 */
	public String getHuyen_Nnthue() {
		return huyen_Nnthue;
	}

	/**
	 * @return
	 */
	public String getKb_Thu_Ho() {
		return kb_Thu_Ho;
	}

	/**
	 * @return
	 */
	public String getKy_Thue() {
		return ky_Thue;
	}

	/**
	 * @return
	 */
	public String getKyhieu_Ct() {
		return kyhieu_Ct;
	}

	/**
	 * @return
	 */
	public String getLan_In() {
		return lan_In;
	}

	/**
	 * @return
	 */
	public String getLhxnk() {
		return lhxnk;
	}

	/**
	 * @return
	 */
	public String getMa_Cap() {
		return ma_Cap;
	}

	/**
	 * @return
	 */
	public String getMa_Chuong() {
		return ma_Chuong;
	}

	/**
	 * @return
	 */
	public String getMa_Cqthu() {
		return ma_Cqthu;
	}

	/**
	 * @return
	 */
	public String getMa_Dbhc() {
		return ma_Dbhc;
	}

	/**
	 * @return
	 */
	public String getMa_Dp() {
		return ma_Dp;
	}

	/**
	 * @return
	 */
	public String getMa_Dthu() {
		return ma_Dthu;
	}

	/**
	 * @return
	 */
	public String getMa_Khtk() {
		return ma_Khtk;
	}

	/**
	 * @return
	 */
	public String getMa_Ks() {
		return ma_Ks;
	}

	/**
	 * @return
	 */
	public String getMa_Lthue() {
		return ma_Lthue;
	}

	/**
	 * @return
	 */
	public String getMa_Nv() {
		return ma_Nv;
	}

	/**
	 * @return
	 */
	public String getMa_Ndkt() {
		return ma_Ndkt;
	}

	/**
	 * @return
	 */
	public String getMa_Ndkt_Cha() {
		return ma_Ndkt_Cha;
	}

	/**
	 * @return
	 */
	public String getMa_Nh_A() {
		return ma_Nh_A;
	}

	/**
	 * @return
	 */
	public String getMa_Nh_B() {
		return ma_Nh_B;
	}

	/**
	 * @return
	 */
	public String getMa_Nkt() {
		return ma_Nkt;
	}

	/**
	 * @return
	 */
	public String getMa_Nkt_Cha() {
		return ma_Nkt_Cha;
	}

	/**
	 * @return
	 */
	public String getMa_Nnthue() {
		return ma_Nnthue;
	}

	/**
	 * @return
	 */
	public String getMa_Nntien() {
		return ma_Nntien;
	}

	/**
	 * @return
	 */
	public String getMa_Nt() {
		return ma_Nt;
	}

	/**
	 * @return
	 */
	public String getMa_Quy() {
		return ma_Quy;
	}

	/**
	 * @return
	 */
	public String getMa_Tlpc() {
		return ma_Tlpc;
	}

	/**
	 * @return
	 */
	public String getMa_Tq() {
		return ma_Tq;
	}

	/**
	 * @return
	 */
	public String getNgay_Bk() {
		return ngay_Bk;
	}

	/**
	 * @return
	 */
	public String getNgay_Ct() {
		return ngay_Ct;
	}

	/**
	 * @return
	 */
	public String getNgay_Ht() {
		return ngay_Ht;
	}

	/**
	 * @return
	 */
	public String getNgay_Kb() {
		return ngay_Kb;
	}

	/**
	 * @return
	 */
	public String getNgay_Kh_Nh() {
		return ngay_Kh_Nh;
	}

	/**
	 * @return
	 */
	public String getNgay_Qd() {
		return ngay_Qd;
	}

	/**
	 * @return
	 */
	public String getNgay_Tk() {
		return ngay_Tk;
	}

	/**
	 * @return
	 */
	public String getNoi_Dung() {
		return noi_Dung;
	}

	/**
	 * @return
	 */
	public String getPhuong_Thuc() {
		return phuong_Thuc;
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
	public String getSo_Bk() {
		return so_Bk;
	}

	/**
	 * @return
	 */
	public String getSo_Bt() {
		return so_Bt;
	}

	/**
	 * @return
	 */
	public String getSo_Bthu() {
		return so_Bthu;
	}

	/**
	 * @return
	 */
	public String getSo_Ct() {
		return so_Ct;
	}

	/**
	 * @return
	 */
	public String getSo_Ct_Nh() {
		return so_Ct_Nh;
	}

	/**
	 * @return
	 */
	public String getSo_Khung() {
		return so_Khung;
	}

	/**
	 * @return
	 */
	public String getSo_May() {
		return so_May;
	}

	/**
	 * @return
	 */
	public String getSo_Qd() {
		return so_Qd;
	}

	/**
	 * @return
	 */
	public String getSo_Tk() {
		return so_Tk;
	}

	/**
	 * @return
	 */
	public String getSotien() {
		return sotien;
	}

	/**
	 * @return
	 */
	public String getSotien_Nt() {
		return sotien_Nt;
	}

	/**
	 * @return
	 */
	public String getTen_Cqthu() {
		return ten_Cqthu;
	}

	/**
	 * @return
	 */
	public String getTen_Dbhc() {
		return ten_Dbhc;
	}

	/**
	 * @return
	 */
	public String getTen_Dvsdns() {
		return ten_Dvsdns;
	}

	/**
	 * @return
	 */
	public String getTen_Kh_Nhan() {
		return ten_Kh_Nhan;
	}

	/**
	 * @return
	 */
	public String getTen_Ks() {
		return ten_Ks;
	}

	/**
	 * @return
	 */
	public String getTen_Lhxnk() {
		return ten_Lhxnk;
	}

	/**
	 * @return
	 */
	public String getTen_Lthue() {
		return ten_Lthue;
	}

	/**
	 * @return
	 */
	public String getTen_Nh_A() {
		return ten_Nh_A;
	}

	/**
	 * @return
	 */
	public String getTen_Nh_B() {
		return ten_Nh_B;
	}

	/**
	 * @return
	 */
	public String getTen_Nntien() {
		return ten_Nntien;
	}

	/**
	 * @return
	 */
	public String getTen_Nt() {
		return ten_Nt;
	}

	/**
	 * @return
	 */
	public String getTen_Tk_Co() {
		return ten_Tk_Co;
	}

	/**
	 * @return
	 */
	public String getTen_Tk_No() {
		return ten_Tk_No;
	}

	/**
	 * @return
	 */
	public String getTen_Tq() {
		return ten_Tq;
	}

	/**
	 * @return
	 */
	public String getTinh_Nnthue() {
		return tinh_Nnthue;
	}

	/**
	 * @return
	 */
	public String getTk_Co() {
		return tk_Co;
	}

	/**
	 * @return
	 */
	public String getTk_Kh_Nh() {
		return tk_Kh_Nh;
	}

	/**
	 * @return
	 */
	public String getTk_Kh_Nhan() {
		return tk_Kh_Nhan;
	}

	/**
	 * @return
	 */
	public String getTk_No() {
		return tk_No;
	}

	/**
	 * @return
	 */
	public String getTk_Ns() {
		return tk_Ns;
	}

	/**
	 * @return
	 */
	public String getTrang_Thai() {
		return trang_Thai;
	}

	/**
	 * @return
	 */
	public String getTtien() {
		return ttien;
	}

	/**
	 * @return
	 */
	public String getTtien_Nt() {
		return ttien_Nt;
	}

	/**
	 * @return
	 */
	public String getTtien_Tthu() {
		return ttien_Tthu;
	}

	/**
	 * @return
	 */
	public String getTy_Gia() {
		return ty_Gia;
	}

	/**
	 * @return
	 */
	public String getVt_Lhxnk() {
		return vt_Lhxnk;
	}

	/**
	 * @param string
	 */
	public void setCq_Qd(String string) {
		cq_Qd = string;
	}

	/**
	 * @param string
	 */
	public void setDc_Nnthue(String string) {
		dc_Nnthue = string;
	}

	/**
	 * @param string
	 */
	public void setDc_Nntien(String string) {
		dc_Nntien = string;
	}

	/**
	 * @param string
	 */
	public void setDiachi_Kh_Nhan(String string) {
		diachi_Kh_Nhan = string;
	}

	/**
	 * @param string
	 */
	public void setDvsdns(String string) {
		dvsdns = string;
	}

	/**
	 * @param string
	 */
	public void setGhi_Chu(String string) {
		ghi_Chu = string;
	}

	/**
	 * @param string
	 */
	public void setHinh_Thuc(String string) {
		hinh_Thuc = string;
	}

	/**
	 * @param string
	 */
	public void setHuyen_Nnthue(String string) {
		huyen_Nnthue = string;
	}

	/**
	 * @param string
	 */
	public void setKb_Thu_Ho(String string) {
		kb_Thu_Ho = string;
	}

	/**
	 * @param string
	 */
	public void setKy_Thue(String string) {
		ky_Thue = string;
	}

	/**
	 * @param string
	 */
	public void setKyhieu_Ct(String string) {
		kyhieu_Ct = string;
	}

	/**
	 * @param string
	 */
	public void setLan_In(String string) {
		lan_In = string;
	}

	/**
	 * @param string
	 */
	public void setLhxnk(String string) {
		lhxnk = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Cap(String string) {
		ma_Cap = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Chuong(String string) {
		ma_Chuong = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Cqthu(String string) {
		ma_Cqthu = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Dbhc(String string) {
		ma_Dbhc = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Dp(String string) {
		ma_Dp = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Dthu(String string) {
		ma_Dthu = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Khtk(String string) {
		ma_Khtk = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Ks(String string) {
		ma_Ks = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Lthue(String string) {
		ma_Lthue = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nv(String string) {
		ma_Nv = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Ndkt(String string) {
		ma_Ndkt = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Ndkt_Cha(String string) {
		ma_Ndkt_Cha = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nh_A(String string) {
		ma_Nh_A = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nh_B(String string) {
		ma_Nh_B = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nkt(String string) {
		ma_Nkt = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nkt_Cha(String string) {
		ma_Nkt_Cha = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nnthue(String string) {
		ma_Nnthue = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nntien(String string) {
		ma_Nntien = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Nt(String string) {
		ma_Nt = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Quy(String string) {
		ma_Quy = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Tlpc(String string) {
		ma_Tlpc = string;
	}

	/**
	 * @param string
	 */
	public void setMa_Tq(String string) {
		ma_Tq = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Bk(String string) {
		ngay_Bk = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Ct(String string) {
		ngay_Ct = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Ht(String string) {
		ngay_Ht = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Kb(String string) {
		ngay_Kb = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Kh_Nh(String string) {
		ngay_Kh_Nh = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Qd(String string) {
		ngay_Qd = string;
	}

	/**
	 * @param string
	 */
	public void setNgay_Tk(String string) {
		ngay_Tk = string;
	}

	/**
	 * @param string
	 */
	public void setNoi_Dung(String string) {
		noi_Dung = string;
	}

	/**
	 * @param string
	 */
	public void setPhuong_Thuc(String string) {
		phuong_Thuc = string;
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
	public void setSo_Bk(String string) {
		so_Bk = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Bt(String string) {
		so_Bt = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Bthu(String string) {
		so_Bthu = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Ct(String string) {
		so_Ct = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Ct_Nh(String string) {
		so_Ct_Nh = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Khung(String string) {
		so_Khung = string;
	}

	/**
	 * @param string
	 */
	public void setSo_May(String string) {
		so_May = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Qd(String string) {
		so_Qd = string;
	}

	/**
	 * @param string
	 */
	public void setSo_Tk(String string) {
		so_Tk = string;
	}

	/**
	 * @param string
	 */
	public void setSotien(String string) {
		sotien = string;
	}

	/**
	 * @param string
	 */
	public void setSotien_Nt(String string) {
		sotien_Nt = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Cqthu(String string) {
		ten_Cqthu = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Dbhc(String string) {
		ten_Dbhc = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Dvsdns(String string) {
		ten_Dvsdns = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Kh_Nhan(String string) {
		ten_Kh_Nhan = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Ks(String string) {
		ten_Ks = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Lhxnk(String string) {
		ten_Lhxnk = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Lthue(String string) {
		ten_Lthue = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Nh_A(String string) {
		ten_Nh_A = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Nh_B(String string) {
		ten_Nh_B = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Nntien(String string) {
		ten_Nntien = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Nt(String string) {
		ten_Nt = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Tk_Co(String string) {
		ten_Tk_Co = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Tk_No(String string) {
		ten_Tk_No = string;
	}

	/**
	 * @param string
	 */
	public void setTen_Tq(String string) {
		ten_Tq = string;
	}

	/**
	 * @param string
	 */
	public void setTinh_Nnthue(String string) {
		tinh_Nnthue = string;
	}

	/**
	 * @param string
	 */
	public void setTk_Co(String string) {
		tk_Co = string;
	}

	/**
	 * @param string
	 */
	public void setTk_Kh_Nh(String string) {
		tk_Kh_Nh = string;
	}

	/**
	 * @param string
	 */
	public void setTk_Kh_Nhan(String string) {
		tk_Kh_Nhan = string;
	}

	/**
	 * @param string
	 */
	public void setTk_No(String string) {
		tk_No = string;
	}

	/**
	 * @param string
	 */
	public void setTk_Ns(String string) {
		tk_Ns = string;
	}

	/**
	 * @param string
	 */
	public void setTrang_Thai(String string) {
		trang_Thai = string;
	}

	/**
	 * @param string
	 */
	public void setTtien(String string) {
		ttien = string;
	}

	/**
	 * @param string
	 */
	public void setTtien_Nt(String string) {
		ttien_Nt = string;
	}

	/**
	 * @param string
	 */
	public void setTtien_Tthu(String string) {
		ttien_Tthu = string;
	}

	/**
	 * @param string
	 */
	public void setTy_Gia(String string) {
		ty_Gia = string;
	}

	/**
	 * @param string
	 */
	public void setVt_Lhxnk(String string) {
		vt_Lhxnk = string;
	}

	/**
	 * @return
	 */
	public String getTen_Nv() {
		return ten_Nv;
	}

	/**
	 * @param string
	 */
	public void setTen_Nv(String string) {
		ten_Nv = string;
	}

	/**
	 * @return
	 */
	public String getTen_Kb() {
		return ten_Kb;
	}

	/**
	 * @param string
	 */
	public void setTen_Kb(String string) {
		ten_Kb = string;
	}

	/**
	 * @return
	 */
	public String getTen_Tk_Ns() {
		return ten_Tk_Ns;
	}

	/**
	 * @param string
	 */
	public void setTen_Tk_Ns(String string) {
		ten_Tk_Ns = string;
	}

	/**
	 * @return
	 */
	public String getTen_Kb_Thu_Ho() {
		return ten_Kb_Thu_Ho;
	}

	/**
	 * @param string
	 */
	public void setTen_Kb_Thu_Ho(String string) {
		ten_Kb_Thu_Ho = string;
	}

	/**
	 * @return
	 */
	public String getTong_Hop() {
		return tong_Hop;
	}

	/**
	 * @param string
	 */
	public void setTong_Hop(String string) {
		tong_Hop = string;
	}

	/**
	 * @return
	 */
	public String getManv_Sobt() {
		return manv_Sobt;
	}

	/**
	 * @param string
	 */
	public void setManv_Sobt(String string) {
		manv_Sobt = string;
	}

	/**
	 * @return
	 */
	public String getKey_Ctu() {
		return key_Ctu;
	}

	/**
	 * @param string
	 */
	public void setKey_Ctu(String string) {
		key_Ctu = string;
	}

	/**
	 * @return
	 */
	public String getTong_Tien() {
		return tong_Tien;
	}

	/**
	 * @param string
	 */
	public void setTong_Tien(String string) {
		tong_Tien = string;
	}

	/**
	 * @return
	 */
	public String getCtu_Count() {
		return ctu_Count;
	}

	/**
	 * @return
	 */
	public String getPage_Count() {
		return page_Count;
	}

	/**
	 * @param string
	 */
	public void setCtu_Count(String string) {
		ctu_Count = string;
	}

	/**
	 * @param string
	 */
	public void setPage_Count(String string) {
		page_Count = string;
	}

	/**
	 * @return Returns the message_Version.
	 */
	public String getMessage_Version() {
		return message_Version;
	}

	/**
	 * @param message_Version The message_Version to set.
	 */
	public void setMessage_Version(String message_Version) {
		this.message_Version = message_Version;
	}

	/**
	 * @return Returns the sender_code.
	 */
	public String getSender_code() {
		return sender_code;
	}

	/**
	 * @param sender_code The sender_code to set.
	 */
	public void setSender_code(String sender_code) {
		this.sender_code = sender_code;
	}

	/**
	 * @return Returns the sender_name.
	 */
	public String getSender_name() {
		return sender_name;
	}

	/**
	 * @param sender_name The sender_name to set.
	 */
	public void setSender_name(String sender_name) {
		this.sender_name = sender_name;
	}

	/**
	 * @return Returns the signature.
	 */
	public String getSignature() {
		return Signature;
	}

	/**
	 * @param signature The signature to set.
	 */
	public void setSignature(String signature) {
		Signature = signature;
	}

	/**
	 * @return Returns the transaction_Date.
	 */
	public String getTransaction_Date() {
		return transaction_Date;
	}

	/**
	 * @param transaction_Date The transaction_Date to set.
	 */
	public void setTransaction_Date(String transaction_Date) {
		this.transaction_Date = transaction_Date;
	}

	/**
	 * @return Returns the transaction_ID.
	 */
	public String getTransaction_ID() {
		return transaction_ID;
	}

	/**
	 * @param transaction_ID The transaction_ID to set.
	 */
	public void setTransaction_ID(String transaction_ID) {
		this.transaction_ID = transaction_ID;
	}

	/**
	 * @return Returns the transaction_Name.
	 */
	public String getTransaction_Name() {
		return transaction_Name;
	}

	/**
	 * @param transaction_Name The transaction_Name to set.
	 */
	public void setTransaction_Name(String transaction_Name) {
		this.transaction_Name = transaction_Name;
	}

	/**
	 * @return Returns the transaction_Type.
	 */
	public int getTransaction_Type() {
		return transaction_Type;
	}

	/**
	 * @param transaction_Type The transaction_Type to set.
	 */
	public void setTransaction_Type(int transaction_Type) {
		this.transaction_Type = transaction_Type;
	}

	/**
	 * @return Returns the response_code.
	 */
	public String getResponse_code() {
		return response_code;
	}

	/**
	 * @param response_code The response_code to set.
	 */
	public void setResponse_code(String response_code) {
		this.response_code = response_code;
	}

	/**
	 * @return Returns the trang_Thai_Kx.
	 */
	public String getTrang_Thai_Kx() {
		return trang_Thai_Kx;
	}

	/**
	 * @param trang_Thai_Kx The trang_Thai_Kx to set.
	 */
	public void setTrang_Thai_Kx(String trang_Thai_Kx) {
		this.trang_Thai_Kx = trang_Thai_Kx;
	}

	/**
	 * @return Returns the ma_hq_ph.
	 */
	public String getMa_hq_ph() {
		return ma_hq_ph;
	}

	/**
	 * @param ma_hq_ph The ma_hq_ph to set.
	 */
	public void setMa_hq_ph(String ma_hq_ph) {
		this.ma_hq_ph = ma_hq_ph;
	}

	/**
	 * @return Returns the error_code_hq.
	 */
	public String getError_code_hq() {
		return error_code_hq;
	}

	/**
	 * @param error_code_hq The error_code_hq to set.
	 */
	public void setError_code_hq(String error_code_hq) {
		this.error_code_hq = error_code_hq;
	}

	/**
	 * @return Returns the dien_giai.
	 */
	public String getDien_giai() {
		return dien_giai;
	}

	/**
	 * @param dien_giai The dien_giai to set.
	 */
	public void setDien_giai(String dien_giai) {
		this.dien_giai = dien_giai;
	}

	/**
	 * @return Returns the is_ma_hq.
	 */
	public String getIs_ma_hq() {
		return is_ma_hq;
	}

	/**
	 * @param is_ma_hq The is_ma_hq to set.
	 */
	public void setIs_ma_hq(String is_ma_hq) {
		this.is_ma_hq = is_ma_hq;
	}

	/**
	 * @return Returns the ngay_dc_hq.
	 */
	public String getNgay_dc_hq() {
		return ngay_dc_hq;
	}

	/**
	 * @param ngay_dc_hq The ngay_dc_hq to set.
	 */
	public void setNgay_dc_hq(String ngay_dc_hq) {
		this.ngay_dc_hq = ngay_dc_hq;
	}

	/**
	 * @return Returns the loai_dl.
	 */
	public String getLoai_dl() {
		return loai_dl;
	}

	/**
	 * @param loai_dl The loai_dl to set.
	 */
	public void setLoai_dl(String loai_dl) {
		this.loai_dl = loai_dl;
	}

	/**
	 * @return the ma_core_nh
	 */
	public String getMa_core_nh() {
		return ma_core_nh;
	}

	/**
	 * @param ma_core_nh the ma_core_nh to set
	 */
	public void setMa_core_nh(String ma_core_nh) {
		this.ma_core_nh = ma_core_nh;
	}

	/**
	 * @return the fee_code
	 */
	public String getFee_code() {
		return fee_code;
	}

	/**
	 * @param fee_code the fee_code to set
	 */
	public void setFee_code(String fee_code) {
		this.fee_code = fee_code;
	}

	/**
	 * @return the ft_number
	 */
	public String getFt_number() {
		return ft_number;
	}

	/**
	 * @param ft_number the ft_number to set
	 */
	public void setFt_number(String ft_number) {
		this.ft_number = ft_number;
	}

	/**
	 * @return the fee_code_desc
	 */
	public String getFee_code_desc() {
		return fee_code_desc;
	}

	/**
	 * @param fee_code_desc the fee_code_desc to set
	 */
	public void setFee_code_desc(String fee_code_desc) {
		this.fee_code_desc = fee_code_desc;
	}

	/**
	 * @return the ma_loaitien
	 */
	public String getMa_loaitien() {
		return ma_loaitien;
	}

	/**
	 * @param ma_loaitien the ma_loaitien to set
	 */
	public void setMa_loaitien(String ma_loaitien) {
		this.ma_loaitien = ma_loaitien;
	}

	/**
	 * @return the tk_ns_hq
	 */
	public String getTk_ns_hq() {
		return tk_ns_hq;
	}

	/**
	 * @param tk_ns_hq the tk_ns_hq to set
	 */
	public void setTk_ns_hq(String tk_ns_hq) {
		this.tk_ns_hq = tk_ns_hq;
	}

	/**
	 * @return the ma_nguoi_nthay
	 */
	public String getMa_nguoi_nthay() {
		return ma_nguoi_nthay;
	}

	/**
	 * @param ma_nguoi_nthay the ma_nguoi_nthay to set
	 */
	public void setMa_nguoi_nthay(String ma_nguoi_nthay) {
		this.ma_nguoi_nthay = ma_nguoi_nthay;
	}

	/**
	 * @return the ma_nh_phucvu_nnt
	 */
	public String getMa_nh_phucvu_nnt() {
		return ma_nh_phucvu_nnt;
	}

	/**
	 * @param ma_nh_phucvu_nnt the ma_nh_phucvu_nnt to set
	 */
	public void setMa_nh_phucvu_nnt(String ma_nh_phucvu_nnt) {
		this.ma_nh_phucvu_nnt = ma_nh_phucvu_nnt;
	}

	/**
	 * @return the ngay_nthue
	 */
	public String getNgay_nthue() {
		return ngay_nthue;
	}

	/**
	 * @param ngay_nthue the ngay_nthue to set
	 */
	public void setNgay_nthue(String ngay_nthue) {
		this.ngay_nthue = ngay_nthue;
	}

	/**
	 * @return the so_thongbao
	 */
	public String getSo_thongbao() {
		return so_thongbao;
	}

	/**
	 * @param so_thongbao the so_thongbao to set
	 */
	public void setSo_thongbao(String so_thongbao) {
		this.so_thongbao = so_thongbao;
	}

	/**
	 * @return the ten_nh_phucvu_nnt
	 */
	public String getTen_nh_phucvu_nnt() {
		return ten_nh_phucvu_nnt;
	}

	/**
	 * @param ten_nh_phucvu_nnt the ten_nh_phucvu_nnt to set
	 */
	public void setTen_nh_phucvu_nnt(String ten_nh_phucvu_nnt) {
		this.ten_nh_phucvu_nnt = ten_nh_phucvu_nnt;
	}

	/**
	 * @return the ten_Nnthue
	 */
	public String getTen_Nnthue() {
		return ten_Nnthue;
	}

	/**
	 * @param ten_Nnthue the ten_Nnthue to set
	 */
	public void setTen_Nnthue(String ten_Nnthue) {
		this.ten_Nnthue = ten_Nnthue;
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

	/**
	 * @param ben_Bank_Code the ben_Bank_Code to set
	 */
	public void setBen_Bank_Code(String ben_Bank_Code) {
		this.ben_Bank_Code = ben_Bank_Code;
	}

	/**
	 * @return the ben_Bank_Code
	 */
	public String getBen_Bank_Code() {
		return ben_Bank_Code;
	}

	/**
	 * @param ben_Bank_Name the ben_Bank_Name to set
	 */
	public void setBen_Bank_Name(String ben_Bank_Name) {
		this.ben_Bank_Name = ben_Bank_Name;
	}

	/**
	 * @return the ben_Bank_Name
	 */
	public String getBen_Bank_Name() {
		return ben_Bank_Name;
	}

	/**
	 * @param so_bt_hq the so_bt_hq to set
	 */
	public void setSo_bt_hq(String so_bt_hq) {
		this.so_bt_hq = so_bt_hq;
	}

	/**
	 * @return the so_bt_hq
	 */
	public String getSo_bt_hq() {
		return so_bt_hq;
	}

	/**
	 * @param ma_citad the ma_citad to set
	 */
	public void setMa_citad(String ma_citad) {
		this.ma_citad = ma_citad;
	}

	/**
	 * @return the ma_citad
	 */
	public String getMa_citad() {
		return ma_citad;
	}

	/**
	 * @param ten_citad the ten_citad to set
	 */
	public void setTen_citad(String ten_citad) {
		this.ten_citad = ten_citad;
	}

	/**
	 * @return the ten_citad
	 */
	public String getTen_citad() {
		return ten_citad;
	}

	/**
	 * @param ma_citad_tt the ma_citad_tt to set
	 */
	public void setMa_citad_tt(String ma_citad_tt) {
		this.ma_citad_tt = ma_citad_tt;
	}

	/**
	 * @return the ma_citad_tt
	 */
	public String getMa_citad_tt() {
		return ma_citad_tt;
	}

	/**
	 * @param ten_citad_tt the ten_citad_tt to set
	 */
	public void setTen_citad_tt(String ten_citad_tt) {
		this.ten_citad_tt = ten_citad_tt;
	}

	/**
	 * @return the ten_citad_tt
	 */
	public String getTen_citad_tt() {
		return ten_citad_tt;
	}

	/**
	 * @return the tk_thu_phi
	 */
	public String getTk_thu_phi() {
		return tk_thu_phi;
	}

	/**
	 * @param tk_thu_phi the tk_thu_phi to set
	 */
	public void setTk_thu_phi(String tk_thu_phi) {
		this.tk_thu_phi = tk_thu_phi;
	}

	/**
	 * @return the ttk_thu_phi
	 */
	public String getTtk_thu_phi() {
		return ttk_thu_phi;
	}

	/**
	 * @param ttk_thu_phi the ttk_thu_phi to set
	 */
	public void setTtk_thu_phi(String ttk_thu_phi) {
		this.ttk_thu_phi = ttk_thu_phi;
	}

	/**
	 * @param tien_phi the tien_phi to set
	 */
	public void setTien_phi(String tien_phi) {
		this.tien_phi = tien_phi;
	}

	/**
	 * @return the tien_phi
	 */
	public String getTien_phi() {
		return tien_phi;
	}

	/**
	 * @param in_ctu_ks the in_ctu_ks to set
	 */
	public void setIn_ctu_ks(String in_ctu_ks) {
		this.in_ctu_ks = in_ctu_ks;
	}

	/**
	 * @return the in_ctu_ks
	 */
	public String getIn_ctu_ks() {
		return in_ctu_ks;
	}

	public void setMa_hq(String ma_hq) {
		this.ma_hq = ma_hq;
	}

	public String getMa_hq() {
		return ma_hq;
	}

	public void setTaxItemNumber(String taxItemNumber) {
		this.taxItemNumber = taxItemNumber;
	}

	public String getTaxItemNumber() {
		return taxItemNumber;
	}

	public String getMa_gdich() {
		return ma_gdich;
	}

	public void setMa_gdich(String ma_gdich) {
		this.ma_gdich = ma_gdich;
	}

	public String getCif() {
		return cif;
	}

	public void setCif(String cif) {
		this.cif = cif;
	}

	public String getMsg_inbox() {
		return msg_inbox;
	}

	public void setMsg_inbox(String msg_inbox) {
		this.msg_inbox = msg_inbox;
	}
}
