package com.fpt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tcs_thamso")
@Getter
@Setter
public class TcsThamSo {
	@Id
	@Column(name = "ma_ts", length = 50, nullable = false)
	private String maTs;

	@Column(name = "mac_dinh", length = 255)
	private String macDinh;

	@Column(name = "loai", length = 50)
	private String loai;

	@Column(name = "sap_xep")
	private Integer sapXep;

	@Column(name = "mo_ta", length = 500)
	private String moTa;
}
