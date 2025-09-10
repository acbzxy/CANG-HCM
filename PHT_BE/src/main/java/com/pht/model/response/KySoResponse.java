package com.pht.model.response;

import lombok.Data;

@Data
public class KySoResponse {
    
    private boolean success;     // Trạng thái thành công
    private String message;      // Thông báo
    private String trangThai;    // Trạng thái mới sau khi ký
    private String ngayKy;       // Ngày ký
    private String nguoiKy;      // Người ký
}
