package com.pht.model.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response khi import chữ ký số thành công")
public class ImportCertificateResponse {
    
    @Schema(description = "ID của chữ ký số đã import", example = "1")
    private Long id;
    
    @Schema(description = "Serial number của certificate", example = "1234567890ABCDEF")
    private String serialNumber;
    
    @Schema(description = "Tên chủ thể certificate", example = "CN=John Doe, O=ABC Company")
    private String subject;
    
    @Schema(description = "Nhà phát hành certificate", example = "CN=CA Authority, O=Trust Center")
    private String issuer;
    
    @Schema(description = "Ngày bắt đầu hiệu lực", example = "2024-01-01T00:00:00")
    private LocalDateTime validFrom;
    
    @Schema(description = "Ngày hết hiệu lực", example = "2025-01-01T00:00:00")
    private LocalDateTime validTo;
    
    @Schema(description = "Tên doanh nghiệp", example = "Công ty TNHH ABC")
    private String tenDoanhNghiep;
    
    @Schema(description = "Mã số thuế", example = "0123456789")
    private String maSoThue;
    
    @Schema(description = "Loại chữ ký", example = "ORGANIZATION")
    private String loaiChuKy;
    
    @Schema(description = "Trạng thái", example = "ACTIVE")
    private String trangThai;
    
    @Schema(description = "Có phải chữ ký mặc định không", example = "false")
    private Boolean isDefault;
    
    @Schema(description = "Thông báo kết quả", example = "Import chữ ký số thành công")
    private String message;
}
