package com.pht.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pht.common.OrderBy;
import com.pht.common.helper.ResponseHelper;
import com.pht.common.model.ApiDataResponse;
import com.pht.entity.ToKhaiThongTin;
import com.pht.model.request.NotificationRequest;
import com.pht.model.request.ToKhaiThongTinRequest;
import com.pht.model.request.UpdateTrangThaiRequest;
import com.pht.model.request.UpdateTrangThaiPhatHanhRequest;
import com.pht.model.response.NotificationResponse;
import com.pht.service.ToKhaiThongTinService;

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
@RequestMapping("/api/tokhai-thongtin")
@Tag(name = "Tờ khai thông tin", description = "Quản lý tờ khai thông tin")
public class ToKhaiThongTinController {

    private final ToKhaiThongTinService toKhaiThongTinService;

    @Operation(summary = "Lấy danh sách tất cả tờ khai thông tin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @GetMapping("/all")
    public ResponseEntity<?> getAllToKhaiThongTin() {
        try {
            List<ToKhaiThongTin> result = toKhaiThongTinService.getAllToKhaiThongTin();
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Lấy tờ khai thông tin theo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getToKhaiThongTinById(@PathVariable Long id) {
        try {
            ToKhaiThongTin result = toKhaiThongTinService.getToKhaiThongTinById(id);
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Tạo mới tờ khai thông tin")
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
    @PostMapping("/create")
    public ResponseEntity<?> createToKhaiThongTin(@RequestBody ToKhaiThongTinRequest request) {
        try {
            ToKhaiThongTin result = toKhaiThongTinService.createToKhaiThongTin(request);
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Cập nhật trạng thái tờ khai thông tin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PutMapping("/update-status")
    public ResponseEntity<?> updateTrangThai(@RequestBody UpdateTrangThaiRequest request) {
        try {
            ToKhaiThongTin result = toKhaiThongTinService.updateTrangThai(request);
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Cập nhật trạng thái phát hành tờ khai thông tin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy tờ khai", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PutMapping("/update-publication-status")
    public ResponseEntity<?> updateTrangThaiPhatHanh(@RequestBody UpdateTrangThaiPhatHanhRequest request) {
        try {
            log.info("Nhận yêu cầu cập nhật trạng thái phát hành cho tờ khai ID: {}, trạng thái: {}", 
                    request.getId(), request.getTrangThaiPhatHanh());
            
            ToKhaiThongTin result = toKhaiThongTinService.updateTrangThaiPhatHanh(request);
            
            log.info("Cập nhật trạng thái phát hành thành công cho tờ khai ID: {}", request.getId());
            
            return ResponseHelper.ok(result);
        } catch (Exception ex) {
            log.error("Lỗi khi cập nhật trạng thái phát hành cho tờ khai ID {}: ", request.getId(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Tạo thông báo và thay đổi trạng thái sang 02")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo thông báo thành công", content = {
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
    @PostMapping("/notification")
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest request) {
        try {
            log.info("Nhận yêu cầu tạo thông báo cho tờ khai ID: {}", request.getToKhaiId());
            
            NotificationResponse result = toKhaiThongTinService.createNotification(request);
            
            log.info("Tạo thông báo thành công cho tờ khai ID: {}, số thông báo: {}, msgId: {}", 
                    request.getToKhaiId(), result.getSoThongBao(), result.getMsgId());
            
            return ResponseHelper.ok(result);
            
        } catch (Exception ex) {
            log.error("Lỗi khi tạo thông báo cho tờ khai ID {}: ", request.getToKhaiId(), ex);
            return ResponseHelper.error(ex);
        }
    }

}
