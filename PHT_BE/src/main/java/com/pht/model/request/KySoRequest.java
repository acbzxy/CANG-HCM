package com.pht.model.request;

import lombok.Data;

@Data
public class KySoRequest {
    
    private Long toKhaiId;       // ID tờ khai cần ký
    private String chuKySoId;    // ID chữ ký số được chọn
    private String matKhau;      // Mật khẩu chữ ký số (nếu cần)
}
