package com.pht.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pht.common.helper.ResponseHelper;
import com.pht.dto.BankReconcileRequest;
import com.pht.dto.ReconcileResponse;
import com.pht.exception.BusinessException;
import com.pht.service.BankReconcileService;

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
@RequestMapping("/api/bank-reconcile")
@Tag(name = "Đối soát ngân hàng", description = "API đối soát với ngân hàng")
public class BankReconcileController {
    
    private final BankReconcileService bankReconcileService;
    
    @Operation(summary = "Đối soát với ngân hàng", 
               description = "Nhận JSON từ ngân hàng và lưu vào bảng SLOG_NH_KB")
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
    public ResponseEntity<?> processBankReconcile(@RequestBody BankReconcileRequest request) {
        try {
            log.info("Nhận yêu cầu đối soát ngân hàng: {} - {} giao dịch", 
                    request.getBankCode(), request.getTotalTransaction());
            
            // Validate dữ liệu cơ bản
            validateBankRequest(request);
            
            // Trả response thành công ngay lập tức
            log.info("Đã nhận dữ liệu từ ngân hàng {}, bắt đầu xử lý async", request.getBankCode());
            
            // Xử lý đối soát ở background
            processBankReconcileAsync(request);
            
            return ResponseEntity.ok(ReconcileResponse.success("Đã nhận dữ liệu từ ngân hàng"));
            
        } catch (BusinessException ex) {
            log.error("Lỗi nghiệp vụ khi validate dữ liệu ngân hàng: {}", ex.getMessage());
            return ResponseHelper.error(ex);
        } catch (Exception ex) {
            log.error("Lỗi hệ thống khi xử lý yêu cầu ngân hàng: ", ex);
            return ResponseHelper.error(ex);
        }
    }
    
    /**
     * Validate dữ liệu từ ngân hàng
     */
    private void validateBankRequest(BankReconcileRequest request) throws BusinessException {
        if (request.getReconcileDate() == null) {
            throw new BusinessException("Ngày đối soát không được để trống");
        }
        
        if (request.getBankCode() == null || request.getBankCode().trim().isEmpty()) {
            throw new BusinessException("Mã ngân hàng không được để trống");
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
        for (BankReconcileRequest.BankTransaction transaction : request.getTransactions()) {
            if (transaction.getTransId() == null || transaction.getTransId().trim().isEmpty()) {
                throw new BusinessException("Mã giao dịch không được để trống");
            }
            if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Số tiền giao dịch phải lớn hơn 0");
            }
        }
        
        log.info("Validation dữ liệu ngân hàng thành công");
    }
    
    /**
     * Xử lý đối soát ngân hàng ở background
     */
    @Async
    public void processBankReconcileAsync(BankReconcileRequest request) {
        try {
            log.info("Bắt đầu xử lý đối soát ngân hàng async: {} - {} giao dịch", 
                    request.getBankCode(), request.getTotalTransaction());
            
            // Xử lý đối soát
            bankReconcileService.processBankReconcile(request);
            
            log.info("Hoàn thành xử lý đối soát ngân hàng async: {} - {}", 
                    request.getBankCode(), request.getBankName());
            
        } catch (Exception ex) {
            log.error("Lỗi khi xử lý đối soát ngân hàng async: ", ex);
        }
    }
}
