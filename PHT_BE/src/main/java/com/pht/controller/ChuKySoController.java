package com.pht.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pht.common.OrderBy;
import com.pht.common.helper.ResponseHelper;
import com.pht.common.model.ApiDataResponse;
import com.pht.model.request.ImportCertificateRequest;
import com.pht.model.request.ImportCertificateFileRequest;
import com.pht.model.request.XmlGenerationRequest;
import com.pht.model.response.ChuKySoResponse;
import com.pht.model.response.ImportCertificateResponse;
import com.pht.entity.ChukySo;
import com.pht.repository.ChukySoRepository;
import com.pht.service.CertificateImportService;
import com.pht.service.CertificateFileImportService;
import com.pht.service.XmlGenerationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chu-ky-so")
@Tag(name = "Chữ ký số", description = "API quản lý chữ ký số")
public class ChuKySoController {

    private final XmlGenerationService xmlGenerationService;
    private final CertificateImportService certificateImportService;
    private final CertificateFileImportService certificateFileImportService;
    private final ChukySoRepository chukySoRepository;

    @Operation(summary = "Lấy danh sách chữ ký số từ database")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @GetMapping("/danh-sach")
    public ResponseEntity<?> layDanhSachChuKySo() {
        try {
            log.info("Nhận yêu cầu lấy danh sách chữ ký số từ database");
            List<ChukySo> entities = chukySoRepository.findActiveCertificates();
            
            // Convert entity sang response với thông tin như trong hình
            List<ChuKySoResponse> result = entities.stream()
                .map(entity -> {
                    ChuKySoResponse response = new ChuKySoResponse();
                    // Sử dụng serial number làm ID để đảm bảo tính nhất quán
                    response.setId(entity.getSerialNumber());
                    // Tên doanh nghiệp (như "Công ty TNHH Phát Triển Công Nghệ Thái Sơn")
                    response.setName(entity.getTenDoanhNghiep());
                    // Nhà phát hành (như "CA2")
                    response.setIssuer(extractIssuerName(entity.getIssuer()));
                    // Thời gian hiệu lực (format dd/MM/yyyy)
                    response.setValidFrom(formatDate(entity.getValidFrom()));
                    response.setValidTo(formatDate(entity.getValidTo()));
                    // Serial number
                    response.setSerialNumber(entity.getSerialNumber());
                    return response;
                })
                .toList();
            
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error("Lỗi khi lấy danh sách chữ ký số từ database: ", ex);
            return ResponseHelper.error(ex);
        }
    }
    
    /**
     * Extract tên nhà phát hành từ issuer string
     */
    private String extractIssuerName(String issuer) {
        if (issuer == null || issuer.isEmpty()) {
            return "Unknown";
        }
        
        try {
            // Tìm CN= trong issuer string
            String[] parts = issuer.split(",");
            for (String part : parts) {
                part = part.trim();
                if (part.startsWith("CN=")) {
                    return part.substring(3).trim();
                }
            }
        } catch (Exception e) {
            log.debug("Không thể parse issuer: {}", issuer, e);
        }
        
        return issuer;
    }
    
    /**
     * Format date thành dd/MM/yyyy
     */
    private String formatDate(java.time.LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    @Operation(summary = "Tạo và ký XML tờ khai với chữ ký số")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/ky-so")
    public ResponseEntity<?> kySo(@RequestBody XmlGenerationRequest request) {
        try {
            log.info("Nhận yêu cầu tạo XML cho tờ khai ID: {}, lần ký: {}, serial number: {}", 
                    request.getToKhaiId(), request.getLanKy(), request.getSerialNumber());
            
            String xmlContent = xmlGenerationService.generateAndSaveXml(
                    request.getToKhaiId(), 
                    request.getLanKy(), 
                    request.getSerialNumber()
            );
            
            log.info("Tạo XML thành công cho tờ khai ID: {}, lần ký: {}, serial number: {}", 
                    request.getToKhaiId(), request.getLanKy(), request.getSerialNumber());
            
            return ResponseHelper.ok(xmlContent);
            
        } catch (Exception ex) {
            log.error("Lỗi khi tạo XML cho tờ khai ID {} lần ký {} serial number {}: ", 
                    request.getToKhaiId(), request.getLanKy(), request.getSerialNumber(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Import chữ ký số từ PEM data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Import thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/import")
    public ResponseEntity<?> importCertificate(@RequestBody ImportCertificateRequest request) {
        try {
            log.info("Nhận yêu cầu import certificate cho doanh nghiệp: {}", request.getTenDoanhNghiep());
            
            ImportCertificateResponse response = certificateImportService.importCertificate(request);
            
            log.info("Import certificate thành công với ID: {}", response.getId());
            
            return ResponseHelper.ok(response);
            
        } catch (Exception ex) {
            log.error("Lỗi khi import certificate: ", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Import chữ ký số từ file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Import thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/import-file")
    public ResponseEntity<?> importCertificateFromFile(@RequestBody ImportCertificateFileRequest request) {
        try {
            log.info("Nhận yêu cầu import certificate từ file: {}", request.getCertificateFilePath());
            
            ImportCertificateResponse response = certificateFileImportService.importCertificateFromFile(request);
            
            log.info("Import certificate từ file thành công với ID: {}", response.getId());
            
            return ResponseHelper.ok(response);
            
        } catch (Exception ex) {
            log.error("Lỗi khi import certificate từ file: ", ex);
            return ResponseHelper.error(ex);
        }
    }

}
