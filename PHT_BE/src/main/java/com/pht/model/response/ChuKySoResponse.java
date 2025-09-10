package com.pht.model.response;

import lombok.Data;

@Data
public class ChuKySoResponse {
    
    private String id;           // ID chữ ký số
    private String name;         // Tên chữ ký số
    private String issuer;       // Nhà phát hành
    private String validFrom;    // Ngày hiệu lực từ
    private String validTo;      // Ngày hiệu lực đến
    private String serialNumber; // Số serial
    private boolean selected;    // Trạng thái được chọn
}
