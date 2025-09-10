package com.pht.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.Base64;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pht.common.OrderBy;
import com.pht.common.helper.ResponseHelper;
import com.pht.common.model.ApiDataResponse;
import com.pht.exception.BusinessException;
import com.pht.model.request.CancelInvoiceRequest;
import com.pht.model.request.CreateIcrRequest;
import com.pht.model.request.DeleteInvoiceRequest;
import com.pht.model.request.ReplaceInvoiceRequest;
import com.pht.model.request.SearchInvoiceRequest;
import com.pht.model.request.UpdateTrangThaiPhatHanhRequest;
import com.pht.model.response.CancelInvoiceResponse;
import com.pht.model.response.DeleteInvoiceResponse;
import com.pht.model.response.ReplaceInvoiceResponse;
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
@RequestMapping("/api/fpt-einvoice")
@Tag(name = "FPT eInvoice", description = "API tích hợp với FPT eInvoice")
public class FptEInvoiceController {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ToKhaiThongTinService toKhaiThongTinService;

    @Value("${fpt.einvoice.api.url:https://api-uat.einvoice.fpt.com.vn}")
    private String einvoiceApiUrl;

    @Value("${fpt.einvoice.api.delete.url:/delete-icr}")
    private String deleteUrl;

    @Value("${fpt.einvoice.api.cancel.url:/cancel-icr}")
    private String cancelUrl;

    @Value("${fpt.einvoice.api.replace.url:/replace-icr}")
    private String replaceUrl;

    @Value("${fpt.einvoice.api.search.url:/search-icr}")
    private String searchUrl;

    @Value("${fpt.einvoice.api.create.url:/create-icr}")
    private String createUrl;

    @Value("${fpt.einvoice.api.update.url:/update-icr}")
    private String updateUrl;

    @Value("${fpt.einvoice.api.username:}")
    private String apiUsername;

    @Value("${fpt.einvoice.api.password:}")
    private String apiPassword;

    @Operation(summary = "Xóa hóa đơn chưa phát hành")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Xóa hóa đơn thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/delete-icr")
    public ResponseEntity<?> deleteInvoice(@RequestBody DeleteInvoiceRequest request) {
        try {
            log.info("Nhận yêu cầu xóa hóa đơn - INC: {}, Username: {}", 
                    request.getRefInv().getInc(), request.getUser().getUsername());
            
            DeleteInvoiceResponse response = callDeleteInvoiceApi(request);
            
            log.info("Xóa hóa đơn hoàn thành - INC: {}, ErrorCode: {}", 
                    request.getRefInv().getInc(), response.getErrorCode());
            
            return ResponseHelper.ok(response);
            
        } catch (Exception ex) {
            log.error("Lỗi khi xóa hóa đơn - INC: {}", 
                    request.getRefInv() != null ? request.getRefInv().getInc() : "unknown", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Hủy hóa đơn")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hủy hóa đơn thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/cancel-icr")
    public ResponseEntity<?> cancelInvoice(@RequestBody CancelInvoiceRequest request) {
        try {
            log.info("Nhận yêu cầu hủy hóa đơn - Username: {}, STAX: {}, Số items: {}", 
                    request.getUser().getUsername(), 
                    request.getWrongnotice().getStax(),
                    request.getWrongnotice().getItems().size());
            
            CancelInvoiceResponse response = callCancelInvoiceApi(request);
            
            log.info("Hủy hóa đơn hoàn thành - ErrorCode: {}", response.getErrorCode());
            
            return ResponseHelper.ok(response);
            
        } catch (Exception ex) {
            log.error("Lỗi khi hủy hóa đơn - Username: {}", 
                    request.getUser() != null ? request.getUser().getUsername() : "unknown", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Thay thế hóa đơn")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thay thế hóa đơn thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/replace-icr")
    public ResponseEntity<?> replaceInvoice(@RequestBody ReplaceInvoiceRequest request) {
        try {
            log.info("Nhận yêu cầu thay thế hóa đơn - Username: {}, STAX: {}, Số items: {}", 
                    request.getUser().getUsername(), 
                    request.getInv().getStax(),
                    request.getInv().getItems().size());
            
            ReplaceInvoiceResponse response = callReplaceInvoiceApi(request);
            
            log.info("Thay thế hóa đơn hoàn thành - ErrorCode: {}", response.getErrorCode());
            
            return ResponseHelper.ok(response);
            
        } catch (Exception ex) {
            log.error("Lỗi khi thay thế hóa đơn - Username: {}", 
                    request.getUser() != null ? request.getUser().getUsername() : "unknown", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Tìm kiếm hóa đơn")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tìm kiếm hóa đơn thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/search-icr")
    public ResponseEntity<?> searchInvoice(@RequestBody SearchInvoiceRequest request) {
        try {
            log.info("Nhận yêu cầu tìm kiếm hóa đơn - STAX: {}, Type: {}, SID: {}, Username: {}, ToKhaiId: {}", 
                    request.getStax(), request.getType(), request.getSid(), request.getUser().getUsername(), request.getToKhaiId());
            
            String response = callSearchInvoiceApi(request);
            
            log.info("Tìm kiếm hóa đơn hoàn thành - Response: {}", response);
            
            // Xử lý base64 response và lưu vào ToKhaiThongTin nếu có toKhaiId
            String processedBase64 = null;
            if (request.getToKhaiId() != null) {
                try {
                    processedBase64 = processBase64ResponseAndSave(response, request.getToKhaiId());
                } catch (Exception e) {
                    log.error("Lỗi khi xử lý base64 response và lưu vào tờ khai ID {}: ", request.getToKhaiId(), e);
                    // Không throw exception để không ảnh hưởng đến response chính
                }
            }
            
            // Tạo response cho frontend với base64 và mã 0000
            String frontendResponse = createFrontendResponse(processedBase64);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(frontendResponse);
            
        } catch (Exception ex) {
            log.error("Lỗi khi tìm kiếm hóa đơn - STAX: {}", 
                    request.getStax() != null ? request.getStax() : "unknown", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Cập nhật trạng thái phát hành", 
               description = "Cập nhật trạng thái phát hành của tờ khai thông tin sang '02'. Request body chỉ cần truyền id của tờ khai.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật trạng thái phát hành thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/update-trang-thai-phat-hanh")
    public ResponseEntity<?> updateTrangThaiPhatHanh(@RequestBody UpdateTrangThaiPhatHanhRequest request) {
        try {
            log.info("Nhận yêu cầu cập nhật trạng thái phát hành cho tờ khai ID: {}", request.getId());
            
            // Cập nhật trạng thái phát hành sang "02"
            updateTrangThaiPhatHanhTo02(request.getId());
            
            log.info("Đã cập nhật trạng thái phát hành thành '02' cho tờ khai ID: {}", request.getId());
            
            return ResponseHelper.ok("Cập nhật trạng thái phát hành thành công");
            
        } catch (Exception ex) {
            log.error("Lỗi khi cập nhật trạng thái phát hành cho ID {}: ", request.getId(), ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Tạo ICR e-invoice")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo ICR thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/create-icr")
    public ResponseEntity<?> createIcr(@RequestBody CreateIcrRequest request) {
        try {
            log.info("Nhận yêu cầu tạo ICR e-invoice, toKhaiId: {}", request.getToKhaiId());
            
            String fptResponse = callCreateIcrApi(request);
            
            log.info("Tạo ICR hoàn thành - Response: {}", fptResponse);
            
            // Kiểm tra response và cập nhật trạng thái phát hành nếu thành công
            if (request.getToKhaiId() != null) {
                try {
                    updateTrangThaiPhatHanhIfSuccess(fptResponse, request.getToKhaiId());
                } catch (Exception e) {
                    log.error("Lỗi khi cập nhật trạng thái phát hành cho tờ khai ID {}: ", request.getToKhaiId(), e);
                    // Không throw exception để không ảnh hưởng đến response chính
                }
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(fptResponse);
                    
        } catch (Exception ex) {
            log.error("Lỗi khi tạo ICR e-invoice: ", ex);
            return ResponseHelper.error(ex);
        }
    }

    @Operation(summary = "Cập nhật ICR e-invoice")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật ICR thành công", content = {
                    @Content(schema = @Schema(implementation = ApiDataResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            }),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = {
                    @Content(schema = @Schema(implementation = OrderBy.ApiErrorResponse.class), mediaType = "application/json")
            })
    })
    @PostMapping("/update-icr")
    public ResponseEntity<?> updateIcr(@RequestBody CreateIcrRequest request) {
        try {
            log.info("Nhận yêu cầu cập nhật ICR e-invoice");
            
            String fptResponse = callUpdateIcrApi(request);
            
            log.info("Cập nhật ICR hoàn thành - Response: {}", fptResponse);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(fptResponse);
                    
        } catch (Exception ex) {
            log.error("Lỗi khi cập nhật ICR e-invoice: ", ex);
            return ResponseHelper.error(ex);
        }
    }

    // Private methods for API calls
    private HttpHeaders createBasicAuthHeaders() {
        return createBasicAuthHeaders(apiUsername, apiPassword);
    }
    
    private HttpHeaders createBasicAuthHeaders(String username, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");
        
        String authUsername = username != null ? username : apiUsername;
        String authPassword = password != null ? password : apiPassword;
        
        if (authUsername != null && !authUsername.isEmpty() && authPassword != null && !authPassword.isEmpty()) {
            String auth = authUsername + ":" + authPassword;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
            log.info("Sử dụng Basic Authentication với username: {}", authUsername);
        }
        
        return headers;
    }

    private DeleteInvoiceResponse callDeleteInvoiceApi(DeleteInvoiceRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders();

            String requestBody = objectMapper.writeValueAsString(request);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = einvoiceApiUrl + deleteUrl;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return objectMapper.readValue(response.getBody(), DeleteInvoiceResponse.class);
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API xóa hóa đơn: " + e.getMessage());
        }
    }

    private CancelInvoiceResponse callCancelInvoiceApi(CancelInvoiceRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders();

            String requestBody = objectMapper.writeValueAsString(request);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = einvoiceApiUrl + cancelUrl;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return objectMapper.readValue(response.getBody(), CancelInvoiceResponse.class);
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API hủy hóa đơn: " + e.getMessage());
        }
    }

    private ReplaceInvoiceResponse callReplaceInvoiceApi(ReplaceInvoiceRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders();

            String requestBody = objectMapper.writeValueAsString(request);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = einvoiceApiUrl + replaceUrl;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return objectMapper.readValue(response.getBody(), ReplaceInvoiceResponse.class);
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API thay thế hóa đơn: " + e.getMessage());
        }
    }

    private String callSearchInvoiceApi(SearchInvoiceRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders(request.getUser().getUsername(), request.getUser().getPassword());
            
            // Không cần request body, chỉ cần Basic Auth
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = UriComponentsBuilder.fromHttpUrl(einvoiceApiUrl + searchUrl)
                    .queryParam("stax", request.getStax())
                    .queryParam("type", request.getType())
                    .queryParam("sid", request.getSid())
                    .toUriString();

            log.info("Gọi FPT API Search: {}", url);
            
            // Thử GET method trước (vì search thường dùng GET)
            ResponseEntity<String> response;
            try {
                response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
                log.info("Thành công với GET method");
            } catch (Exception getException) {
                log.warn("GET method thất bại, thử POST method: {}", getException.getMessage());
                response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
                log.info("Thành công với POST method");
            }

            return response.getBody();
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API tìm kiếm hóa đơn: " + e.getMessage());
        }
    }


    private String callCreateIcrApi(CreateIcrRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders();

            // Tạo request body không bao gồm toKhaiId (chỉ gửi user và inv sang FPT)
            java.util.Map<String, Object> fptRequest = new java.util.HashMap<>();
            fptRequest.put("user", request.getUser());
            fptRequest.put("inv", request.getInv());
            
            String requestBody = objectMapper.writeValueAsString(fptRequest);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = einvoiceApiUrl + createUrl;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return response.getBody();
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API tạo ICR: " + e.getMessage());
        }
    }

    private String callUpdateIcrApi(CreateIcrRequest request) throws BusinessException {
        try {
            HttpHeaders headers = createBasicAuthHeaders();

            // Tạo request body không bao gồm toKhaiId (chỉ gửi user và inv sang FPT)
            java.util.Map<String, Object> fptRequest = new java.util.HashMap<>();
            fptRequest.put("user", request.getUser());
            fptRequest.put("inv", request.getInv());
            
            String requestBody = objectMapper.writeValueAsString(fptRequest);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = einvoiceApiUrl + updateUrl;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return response.getBody();
        } catch (Exception e) {
            throw new BusinessException("Lỗi khi gọi API cập nhật ICR: " + e.getMessage());
        }
    }

    /**
     * Cập nhật trạng thái phát hành về "01" và lưu idPhatHanh nếu FPT response thành công (status = 6)
     */
    private void updateTrangThaiPhatHanhIfSuccess(String fptResponse, Long toKhaiId) {
        try {
            // Parse JSON response để lấy status và sid
            ObjectMapper mapper = new ObjectMapper();
            Object responseObj = mapper.readValue(fptResponse, Object.class);
            
            // Kiểm tra status = 6 (thành công)
            if (responseObj instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> responseMap = (java.util.Map<String, Object>) responseObj;
                Object statusObj = responseMap.get("status");
                Object sidObj = responseMap.get("sid");
                
                if (statusObj != null) {
                    int status = Integer.parseInt(statusObj.toString());
                    
                    if (status == 6) {
                        log.info("FPT response thành công (status=6), cập nhật trạng thái phát hành cho tờ khai ID: {}", toKhaiId);
                        
                        // Lấy sid từ response
                        String sid = sidObj != null ? sidObj.toString() : null;
                        if (sid != null) {
                            log.info("Lấy được sid từ FPT response: {} cho tờ khai ID: {}", sid, toKhaiId);
                        } else {
                            log.warn("Không tìm thấy field 'sid' trong FPT response cho tờ khai ID: {}", toKhaiId);
                        }
                        
                        // Cập nhật trạng thái phát hành về "01" và idPhatHanh
                        updateToKhaiThongTinAfterSuccess(toKhaiId, sid);
                        
                        log.info("Đã cập nhật trạng thái phát hành thành '01' và idPhatHanh cho tờ khai ID: {}", toKhaiId);
                    } else {
                        log.info("FPT response không thành công (status={}), không cập nhật trạng thái phát hành cho tờ khai ID: {}", 
                                status, toKhaiId);
                    }
                } else {
                    log.warn("Không tìm thấy field 'status' trong FPT response cho tờ khai ID: {}", toKhaiId);
                }
            } else {
                log.warn("FPT response không phải là JSON object cho tờ khai ID: {}", toKhaiId);
            }
        } catch (Exception e) {
            log.error("Lỗi khi parse FPT response hoặc cập nhật trạng thái phát hành cho tờ khai ID {}: ", toKhaiId, e);
            throw new RuntimeException("Lỗi khi xử lý FPT response: " + e.getMessage(), e);
        }
    }

    /**
     * Cập nhật tờ khai thông tin sau khi FPT response thành công
     */
    private void updateToKhaiThongTinAfterSuccess(Long toKhaiId, String sid) {
        try {
            // Lấy tờ khai hiện tại
            com.pht.entity.ToKhaiThongTin toKhai = toKhaiThongTinService.getToKhaiThongTinById(toKhaiId);
            
            // Cập nhật trạng thái phát hành và idPhatHanh
            toKhai.setTrangThaiPhatHanh("01");
            if (sid != null) {
                toKhai.setIdPhatHanh(sid);
            }
            
            // Lưu vào database
            toKhaiThongTinService.save(toKhai);
            
            log.info("Đã cập nhật tờ khai ID: {} - trangThaiPhatHanh: 01, idPhatHanh: {}", toKhaiId, sid);
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật tờ khai thông tin ID {}: ", toKhaiId, e);
            throw new RuntimeException("Lỗi khi cập nhật tờ khai thông tin: " + e.getMessage(), e);
        }
    }

    /**
     * Xử lý base64 response từ FPT và lưu vào ToKhaiThongTin
     * @return base64 data đã được xử lý (cắt sau 'base64,')
     */
    private String processBase64ResponseAndSave(String fptResponse, Long toKhaiId) {
        try {
            log.info("Bắt đầu xử lý base64 response cho tờ khai ID: {}", toKhaiId);
            
            // Parse JSON response để lấy base64 data
            ObjectMapper mapper = new ObjectMapper();
            Object responseObj = mapper.readValue(fptResponse, Object.class);
            
            // Tìm base64 data trong response (có thể là array hoặc object)
            String base64Data = extractBase64Data(responseObj);
            
            if (base64Data != null && !base64Data.isEmpty()) {
                log.info("Tìm thấy base64 data, bắt đầu cắt dữ liệu sau 'base64,' cho tờ khai ID: {}", toKhaiId);
                
                // Cắt dữ liệu sau 'base64,'
                String processedBase64 = processBase64String(base64Data);
                
                // Lưu vào ToKhaiThongTin
                saveBase64ToToKhaiThongTin(toKhaiId, processedBase64);
                
                log.info("Đã lưu base64 data cho tờ khai ID: {}", toKhaiId);
                
                return processedBase64;
            } else {
                log.warn("Không tìm thấy base64 data trong response cho tờ khai ID: {}", toKhaiId);
                return null;
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý base64 response cho tờ khai ID {}: ", toKhaiId, e);
            throw new RuntimeException("Lỗi khi xử lý base64 response: " + e.getMessage(), e);
        }
    }

    /**
     * Trích xuất base64 data từ response (có thể là array hoặc object)
     */
    private String extractBase64Data(Object responseObj) {
        try {
            // Nếu response là array
            if (responseObj instanceof java.util.List) {
                @SuppressWarnings("unchecked")
                java.util.List<Object> responseList = (java.util.List<Object>) responseObj;
                
                for (Object item : responseList) {
                    if (item instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        java.util.Map<String, Object> itemMap = (java.util.Map<String, Object>) item;
                        
                        // Tìm kiếm trong field "pdf"
                        Object pdfValue = itemMap.get("pdf");
                        if (pdfValue != null) {
                            String pdfString = pdfValue.toString();
                            if (pdfString.contains("base64,")) {
                                log.info("Tìm thấy base64 data trong field 'pdf' của array item");
                                return pdfString;
                            }
                        }
                        
                        // Tìm kiếm trong các field khác
                        String result = searchBase64InMap(itemMap);
                        if (result != null) {
                            return result;
                        }
                    }
                }
            }
            // Nếu response là object
            else if (responseObj instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> responseMap = (java.util.Map<String, Object>) responseObj;
                
                // Tìm kiếm base64 data trong các field có thể có
                String[] possibleFields = {"pdf", "data", "content", "base64", "file", "document"};
                
                for (String field : possibleFields) {
                    Object value = responseMap.get(field);
                    if (value != null) {
                        String stringValue = value.toString();
                        if (stringValue.contains("base64,")) {
                            log.info("Tìm thấy base64 data trong field: {}", field);
                            return stringValue;
                        }
                    }
                }
                
                // Nếu không tìm thấy trong các field cụ thể, tìm kiếm trong toàn bộ response
                return searchBase64InMap(responseMap);
            }
            
            return null;
        } catch (Exception e) {
            log.error("Lỗi khi trích xuất base64 data: ", e);
            return null;
        }
    }

    /**
     * Tìm kiếm base64 data trong map một cách đệ quy
     */
    private String searchBase64InMap(java.util.Map<String, Object> map) {
        for (java.util.Map.Entry<String, Object> entry : map.entrySet()) {
            Object value = entry.getValue();
            if (value instanceof String) {
                String stringValue = (String) value;
                if (stringValue.contains("base64,")) {
                    log.info("Tìm thấy base64 data trong field: {}", entry.getKey());
                    return stringValue;
                }
            } else if (value instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                String result = searchBase64InMap((java.util.Map<String, Object>) value);
                if (result != null) {
                    return result;
                }
            } else if (value instanceof java.util.List) {
                @SuppressWarnings("unchecked")
                java.util.List<Object> list = (java.util.List<Object>) value;
                for (Object item : list) {
                    if (item instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        String result = searchBase64InMap((java.util.Map<String, Object>) item);
                        if (result != null) {
                            return result;
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Xử lý chuỗi base64, cắt dữ liệu sau 'base64,'
     */
    private String processBase64String(String base64String) {
        if (base64String == null || base64String.isEmpty()) {
            return null;
        }
        
        // Tìm vị trí của 'base64,'
        int base64Index = base64String.indexOf("base64,");
        if (base64Index != -1) {
            // Cắt dữ liệu sau 'base64,'
            String processedData = base64String.substring(base64Index + 7); // 7 là độ dài của "base64,"
            log.info("Đã cắt dữ liệu base64, độ dài sau khi cắt: {}", processedData.length());
            return processedData;
        } else {
            log.warn("Không tìm thấy 'base64,' trong chuỗi, trả về nguyên bản");
            return base64String;
        }
    }

    /**
     * Lưu base64 data vào ToKhaiThongTin
     */
    private void saveBase64ToToKhaiThongTin(Long toKhaiId, String base64Data) {
        try {
            // Lấy tờ khai hiện tại
            com.pht.entity.ToKhaiThongTin toKhai = toKhaiThongTinService.getToKhaiThongTinById(toKhaiId);
            
            // Cập nhật imageBl field
            toKhai.setImageBl(base64Data);
            
            // Lưu vào database
            toKhaiThongTinService.save(toKhai);
            
            log.info("Đã lưu base64 data vào imageBl field cho tờ khai ID: {}, độ dài data: {}", 
                    toKhaiId, base64Data.length());
        } catch (Exception e) {
            log.error("Lỗi khi lưu base64 data cho tờ khai ID {}: ", toKhaiId, e);
            throw new RuntimeException("Lỗi khi lưu base64 data: " + e.getMessage(), e);
        }
    }

    /**
     * Cập nhật trạng thái phát hành sang "02"
     */
    private void updateTrangThaiPhatHanhTo02(Long toKhaiId) {
        try {
            // Lấy tờ khai hiện tại
            com.pht.entity.ToKhaiThongTin toKhai = toKhaiThongTinService.getToKhaiThongTinById(toKhaiId);
            
            // Cập nhật trạng thái phát hành sang "02"
            toKhai.setTrangThaiPhatHanh("02");
            
            // Lưu vào database
            toKhaiThongTinService.save(toKhai);
            
            log.info("Đã cập nhật trangThaiPhatHanh = '02' cho tờ khai ID: {}", toKhaiId);
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật trạng thái phát hành cho tờ khai ID {}: ", toKhaiId, e);
            throw new RuntimeException("Lỗi khi cập nhật trạng thái phát hành: " + e.getMessage(), e);
        }
    }

    /**
     * Tạo response cho frontend với base64 và mã 0000
     */
    private String createFrontendResponse(String processedBase64) {
        try {
            log.info("Bắt đầu tạo response cho frontend - processedBase64: {}", 
                    processedBase64 != null ? "có data, độ dài: " + processedBase64.length() : "null");
            
            // Tạo response object cho frontend
            java.util.Map<String, Object> frontendResponse = new java.util.HashMap<>();
            
            // Thêm mã 0000 (thành công)
            frontendResponse.put("errorCode", "0000");
            frontendResponse.put("errorMessage", "Success");
            
            // Thêm base64 data nếu có
            if (processedBase64 != null && !processedBase64.isEmpty()) {
                frontendResponse.put("base64Data", processedBase64);
                log.info("Đã thêm base64 data vào response cho frontend, độ dài: {}", processedBase64.length());
            } else {
                frontendResponse.put("base64Data", null);
                log.info("Không có base64 data để trả về cho frontend");
            }
            
            // Convert thành JSON string
            String result = objectMapper.writeValueAsString(frontendResponse);
            log.info("Đã tạo response cho frontend thành công: {}", result);
            
            return result;
            
        } catch (Exception e) {
            log.error("Lỗi khi tạo response cho frontend: ", e);
            // Fallback: trả về response đơn giản
            return "{\"errorCode\":\"0000\",\"errorMessage\":\"Success\",\"base64Data\":null}";
        }
    }

}
