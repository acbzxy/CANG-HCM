package com.pht.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pht.common.OrderBy;
import com.pht.common.helper.ResponseHelper;
import com.pht.common.model.ApiDataResponse;
import com.pht.model.request.XmlGenerationRequest;
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
@RequestMapping("/api/xml-generation")
@Tag(name = "Tạo XML", description = "API tạo XML từ thông tin tờ khai")
public class XmlGenerationController {

    private final XmlGenerationService xmlGenerationService;

    @Operation(summary = "Tạo XML từ thông tin tờ khai theo ID và lần ký")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo XML thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy tờ khai", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Trạng thái tờ khai không hợp lệ hoặc dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/generate")
    public ResponseEntity<?> generateXml(@RequestBody XmlGenerationRequest request) {
        try {
            log.info("Nhận yêu cầu tạo XML cho tờ khai ID: {}, lần ký: {}", request.getToKhaiId(), request.getLanKy());
            
            String xmlContent = xmlGenerationService.generateAndSaveXml(request.getToKhaiId(), request.getLanKy());
            
            log.info("Tạo XML thành công cho tờ khai ID: {}, lần ký: {}", request.getToKhaiId(), request.getLanKy());
            
            return ResponseHelper.ok(xmlContent);
            
        } catch (Exception ex) {
            log.error("Lỗi khi tạo XML cho tờ khai ID {} lần ký {}: ", request.getToKhaiId(), request.getLanKy(), ex);
            return ResponseHelper.error(ex);
        }
    }
}
