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
import com.pht.model.request.KySoRequest;
import com.pht.model.response.ChuKySoResponse;
import com.pht.model.response.KySoResponse;
import com.pht.service.DigitalSignatureService;

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

    private final DigitalSignatureService chuKySoService;

    @Operation(summary = "Lấy danh sách chữ ký số có sẵn")
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
            log.info("Nhận yêu cầu lấy danh sách chữ ký số");
            List<ChuKySoResponse> result = chuKySoService.layDanhSachChuKySo();
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error("Lỗi khi lấy danh sách chữ ký số: ", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Thực hiện ký số tờ khai")
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
    public ResponseEntity<?> kySo(@RequestBody KySoRequest request) {
        try {
            log.info("Nhận yêu cầu ký số tờ khai ID: {}", request.getToKhaiId());
            KySoResponse result = chuKySoService.kySo(request);
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error("Lỗi khi ký số: ", ex);
            return ResponseHelper.error(ex);
        }
    }
}
