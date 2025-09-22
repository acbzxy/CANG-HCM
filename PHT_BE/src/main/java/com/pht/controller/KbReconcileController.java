package com.pht.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.pht.common.helper.ResponseHelper;
import com.pht.dto.KbReconcileRequest;
import com.pht.dto.ReconcileResponse;
import com.pht.exception.BusinessException;
import com.pht.service.KbReconcileService;

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
@RequestMapping("/api/kb-reconcile")
@Tag(name = "Đối soát kho bạc", description = "API đối soát với kho bạc")
public class KbReconcileController {
    
    private final KbReconcileService kbReconcileService;
    
    @Operation(summary = "Đối soát với kho bạc", 
               description = "Nhận JSON từ kho bạc và lưu vào bảng SLOG_NH_KB")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = String.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = BusinessException.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = BusinessException.class), mediaType = "application/json")
            })
    })
    @PostMapping("/process")
    public ResponseEntity<?> processKbReconcile(@Valid @RequestBody KbReconcileRequest request) {
        try {
            log.info("Nhận yêu cầu đối soát kho bạc: {} giao dịch", request.getTotalTransaction());
            
            // Validate dữ liệu cơ bản
            validateKbRequest(request);
            
            // Trả response thành công ngay lập tức
            log.info("Đã nhận dữ liệu từ kho bạc, bắt đầu xử lý async");
            
            // Xử lý đối soát ở background
            processKbReconcileAsync(request);
            
            return ResponseEntity.ok(ReconcileResponse.success("Đã nhận dữ liệu từ kho bạc"));
            
        } catch (BusinessException ex) {
            log.error("Lỗi nghiệp vụ khi validate dữ liệu kho bạc: {}", ex.getMessage());
            return ResponseHelper.error(ex);
        } catch (Exception ex) {
            log.error("Lỗi hệ thống khi xử lý yêu cầu kho bạc: ", ex);
            return ResponseHelper.error(ex);
        }
    }
    
    /**
     * Validate dữ liệu từ kho bạc
     */
    private void validateKbRequest(KbReconcileRequest request) throws BusinessException {
        if (request.getReconcileDate() == null) {
            throw new BusinessException("Ngày đối soát không được để trống");
        }
        
        if (request.getTotalTransaction() == null || request.getTotalTransaction() <= 0) {
            throw new BusinessException("Tổng số giao dịch phải lớn hơn 0");
        }
        
        if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Tổng số tiền phải lớn hơn 0");
        }
        
        if (request.getTransactions() == null || request.getTransactions().isEmpty()) {
            throw new BusinessException("Danh sách giao dịch không được để trống");
        }
        
        // Validate từng transaction
        for (KbReconcileRequest.KbTransaction transaction : request.getTransactions()) {
            if (transaction.getTransId() == null || transaction.getTransId().trim().isEmpty()) {
                throw new BusinessException("Mã giao dịch không được để trống");
            }
            if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Số tiền giao dịch phải lớn hơn 0");
            }
        }
        
        log.info("Validation dữ liệu kho bạc thành công");
    }
    
    /**
     * Xử lý đối soát kho bạc ở background
     */
    @Async
    public void processKbReconcileAsync(KbReconcileRequest request) {
        try {
            log.info("Bắt đầu xử lý đối soát kho bạc async: {} giao dịch", request.getTotalTransaction());
            
            // Xử lý đối soát
            kbReconcileService.processKbReconcile(request);
            
            log.info("Hoàn thành xử lý đối soát kho bạc async: {} giao dịch", request.getTotalTransaction());
            
        } catch (Exception ex) {
            log.error("Lỗi khi xử lý đối soát kho bạc async: ", ex);
        }
    }
}
