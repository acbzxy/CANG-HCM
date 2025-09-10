package com.pht.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pht.entity.ToKhaiThongTin;
import com.pht.entity.ToKhaiThongTinChiTiet;
import com.pht.exception.BusinessException;
import com.pht.repository.ToKhaiThongTinRepository;
import com.pht.service.XmlGenerationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class XmlGenerationServiceImpl implements XmlGenerationService {

    private final ToKhaiThongTinRepository toKhaiThongTinRepository;

    @Override
    @Transactional
    public String generateAndSaveXml(Long toKhaiId, Integer lanKy) throws BusinessException {
        log.info("Bắt đầu tạo XML cho tờ khai ID: {}, lần ký: {}", toKhaiId, lanKy);
        
        try {
            // Lấy thông tin tờ khai
            ToKhaiThongTin toKhai = toKhaiThongTinRepository.findById(toKhaiId)
                    .orElseThrow(() -> new BusinessException("Không tìm thấy tờ khai với ID: " + toKhaiId));
            
            // Kiểm tra trạng thái hiện tại
            if (!"00".equals(toKhai.getTrangThai())) {
                throw new BusinessException("Tờ khai không ở trạng thái có thể tạo XML. Trạng thái hiện tại: " + toKhai.getTrangThai());
            }
            
            // Tạo XML
            String xmlContent = generateXml(toKhai);
            
            // Log nội dung XML để kiểm tra
            log.info("=== XML CONTENT GENERATED ===");
            log.info("ToKhai ID: {}, LanKy: {}", toKhaiId, lanKy);
            log.info("XML Content:\n{}", xmlContent);
            log.info("=== END XML CONTENT ===");
            
            // Lưu XML vào trường tương ứng và cập nhật trạng thái dựa trên lanKy
            if (lanKy != null && lanKy == 1) {
                toKhai.setKylan1Xml(xmlContent);
                toKhai.setTrangThai("01");
                log.info("Lưu XML vào KYLAN1_XML và cập nhật trạng thái sang 01 cho tờ khai ID: {}", toKhaiId);
            } else {
                toKhai.setKylan2Xml(xmlContent);
                toKhai.setTrangThai("03");
                log.info("Lưu XML vào KYLAN2_XML và cập nhật trạng thái sang 03 cho tờ khai ID: {}", toKhaiId);
            }
            
            // Lưu vào database
            toKhaiThongTinRepository.save(toKhai);
            
            String trangThaiMoi = (lanKy != null && lanKy == 1) ? "01" : "03";
            log.info("Tạo XML thành công cho tờ khai ID: {}, lần ký: {}, trạng thái mới: {}", toKhaiId, lanKy, trangThaiMoi);
            
            return xmlContent;
            
        } catch (BusinessException e) {
            log.error("Lỗi khi tạo XML: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi tạo XML: ", e);
            throw new BusinessException("Lỗi hệ thống khi tạo XML: " + e.getMessage());
        }
    }

    @Override
    public String generateXml(ToKhaiThongTin toKhai) throws BusinessException {
        try {
            log.info("Bắt đầu tạo XML cho tờ khai ID: {}, Số tờ khai: {}", toKhai.getId(), toKhai.getSoToKhai());
            log.info("Thông tin tờ khai - Mã DN khai phí: {}, Tên DN: {}, Tổng tiền phí: {}", 
                    toKhai.getMaDoanhNghiepKhaiPhi(), toKhai.getTenDoanhNghiepKhaiPhi(), toKhai.getTongTienPhi());
            log.info("Số chi tiết: {}", toKhai.getChiTietList() != null ? toKhai.getChiTietList().size() : 0);
            
            StringBuilder xml = new StringBuilder();
            
            // XML Header
            xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            xml.append("<Customs>");
            
            // Header section
            xml.append("<Header>");
            xml.append("<Application_Name>Payment</Application_Name>");
            xml.append("<Application_Version>3.0</Application_Version>");
            xml.append("<Sender_Code>HQ</Sender_Code>");
            xml.append("<Sender_Name>Tổng cục Hải quan</Sender_Name>");
            xml.append("<Message_Version>3.0</Message_Version>");
            xml.append("<Message_Type>320</Message_Type>");
            xml.append("<Message_Name>Thông điệp trả lời số phí hạ tầng phải thu</Message_Name>");
            xml.append("<Transaction_Date>").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))).append("</Transaction_Date>");
            xml.append("<Transaction_ID>").append(UUID.randomUUID().toString()).append("</Transaction_ID>");
            xml.append("<Request_ID>").append(UUID.randomUUID().toString().toUpperCase()).append("</Request_ID>");
            xml.append("</Header>");
            
            // Data section
            xml.append("<Data>");
            xml.append("<ThongTinChungTu>");
            
            // Thông tin chung từ tờ khai
            xml.append("<ID_CT>").append(escapeXml(toKhai.getSoTiepNhanKhaiPhi() != null ? toKhai.getSoTiepNhanKhaiPhi() : "PHT_" + toKhai.getId())).append("</ID_CT>");
            xml.append("<So_CT>").append(escapeXml(toKhai.getSoToKhai() != null ? toKhai.getSoToKhai() : String.valueOf(toKhai.getId()))).append("</So_CT>");
            xml.append("<KyHieu_CT>").append(escapeXml(toKhai.getKyHieuBienLai() != null ? toKhai.getKyHieuBienLai() : "PHT")).append("</KyHieu_CT>");
            xml.append("<Ngay_CT>").append(toKhai.getNgayToKhai() != null ? toKhai.getNgayToKhai().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("</Ngay_CT>");
            
            // Thông tin doanh nghiệp
            xml.append("<Ma_DV>").append(escapeXml(toKhai.getMaDoanhNghiepKhaiPhi() != null ? toKhai.getMaDoanhNghiepKhaiPhi() : "")).append("</Ma_DV>");
            xml.append("<Ten_DV>").append(escapeXml(toKhai.getTenDoanhNghiepKhaiPhi() != null ? toKhai.getTenDoanhNghiepKhaiPhi() : "")).append("</Ten_DV>");
            xml.append("<Chuong_NS>000</Chuong_NS>");
            xml.append("<TieuMuc>2267</TieuMuc>");
            xml.append("<DiaChi>").append(escapeXml(toKhai.getDiaChiKhaiPhi() != null ? toKhai.getDiaChiKhaiPhi() : "")).append("</DiaChi>");
            
            // Thông tin phí
            xml.append("<Ma_LoaiPhi>").append(escapeXml(toKhai.getNhomLoaiPhi() != null ? toKhai.getNhomLoaiPhi() : "PHT01")).append("</Ma_LoaiPhi>");
            xml.append("<Ten_LoaiPhi>Phí sử dụng kết cấu hạ tầng cảng biển</Ten_LoaiPhi>");
            xml.append("<Ma_DV_ThuPhi>31</Ma_DV_ThuPhi>");
            xml.append("<Ma_CQT_DV_ThuPhi>STCHP</Ma_CQT_DV_ThuPhi>");
            xml.append("<Ten_DV_ThuPhi>TP Hải Phòng</Ten_DV_ThuPhi>");
            
            // Thông tin hải quan
            xml.append("<So_TK_HQ>").append(escapeXml(toKhai.getSoToKhai() != null ? toKhai.getSoToKhai() : "")).append("</So_TK_HQ>");
            xml.append("<Ma_LH>").append(escapeXml(toKhai.getMaLoaiHinh() != null ? toKhai.getMaLoaiHinh() : "A11")).append("</Ma_LH>");
            xml.append("<Ngay_TK_HQ>").append(toKhai.getNgayToKhai() != null ? toKhai.getNgayToKhai().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("</Ngay_TK_HQ>");
            xml.append("<Ma_HQ>").append(escapeXml(toKhai.getMaHaiQuan() != null ? toKhai.getMaHaiQuan() : "03CC")).append("</Ma_HQ>");
            
            // Thông tin nộp phí
            xml.append("<So_TK_NP>").append(escapeXml(toKhai.getSoTiepNhanKhaiPhi() != null ? toKhai.getSoTiepNhanKhaiPhi() : "")).append("</So_TK_NP>");
            xml.append("<Ngay_TK_NP>").append(toKhai.getNgayKhaiPhi() != null ? toKhai.getNgayKhaiPhi().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("</Ngay_TK_NP>");
            
            // Thông tin kho bạc
            xml.append("<TKKB>351101071070</TKKB>");
            xml.append("<Ten_TKKB>Phòng Tàichính – Kế hoạch quận Hải An</Ten_TKKB>");
            xml.append("<Ma_KB>0063</Ma_KB>");
            xml.append("<Ten_KB>Kho bạc Nhà nước Hải An</Ten_KB>");
            
            // Tổng tiền
            xml.append("<SoTien_TO>").append(toKhai.getTongTienPhi() != null ? toKhai.getTongTienPhi().toString() : "0").append("</SoTien_TO>");
            
            // Diễn giải
            String dienGiai = String.format("ID_CT:%s;LP:%s;DVNP:%s;DVTP:%s;MA_CQT:STCHP;TM:2267;ST:%s;", 
                    toKhai.getId(),
                    toKhai.getNhomLoaiPhi() != null ? toKhai.getNhomLoaiPhi() : "PHT01",
                    toKhai.getMaDoanhNghiepKhaiPhi() != null ? toKhai.getMaDoanhNghiepKhaiPhi() : "",
                    toKhai.getMaDoanhNghiepXNK() != null ? toKhai.getMaDoanhNghiepXNK() : "",
                    toKhai.getTongTienPhi() != null ? toKhai.getTongTienPhi().toString() : "0");
            xml.append("<DienGiai>").append(escapeXml(dienGiai)).append("</DienGiai>");
            
            // Thông tin chi tiết nộp tiền
            if (toKhai.getChiTietList() != null && !toKhai.getChiTietList().isEmpty()) {
                int soTT = 1;
                for (ToKhaiThongTinChiTiet chiTiet : toKhai.getChiTietList()) {
                    xml.append("<ThongTinNopTien>");
                    xml.append("<SoTT>").append(soTT).append("</SoTT>");
                    xml.append("<Ma_BieuCuoc>TF003_20HK</Ma_BieuCuoc>");
                    xml.append("<Ten_BieuCuoc>Container 20feet hàngkhô</Ten_BieuCuoc>");
                    xml.append("<So_VD>").append(escapeXml(chiTiet.getSoVanDon() != null ? chiTiet.getSoVanDon() : "")).append("</So_VD>");
                    xml.append("<So_Hieu_Container>").append(escapeXml(chiTiet.getSoHieu() != null ? chiTiet.getSoHieu() : "")).append("</So_Hieu_Container>");
                    xml.append("<Don_Gia>250000</Don_Gia>");
                    xml.append("<So_Luong>1</So_Luong>");
                    xml.append("<Don_Vi_Tinh>Đồng/Container</Don_Vi_Tinh>");
                    xml.append("<Thanh_Tien>250000</Thanh_Tien>");
                    xml.append("</ThongTinNopTien>");
                    soTT++;
                }
            } else {
                // Tạo thông tin mặc định nếu không có chi tiết
                xml.append("<ThongTinNopTien>");
                xml.append("<SoTT>1</SoTT>");
                xml.append("<Ma_BieuCuoc>TF003_20HK</Ma_BieuCuoc>");
                xml.append("<Ten_BieuCuoc>Container 20feet hàngkhô</Ten_BieuCuoc>");
                xml.append("<So_VD>").append(escapeXml(toKhai.getSoToKhai() != null ? toKhai.getSoToKhai() : "")).append("</So_VD>");
                xml.append("<So_Hieu_Container>DEFAULT</So_Hieu_Container>");
                xml.append("<Don_Gia>250000</Don_Gia>");
                xml.append("<So_Luong>1</So_Luong>");
                xml.append("<Don_Vi_Tinh>Đồng/Container</Don_Vi_Tinh>");
                xml.append("<Thanh_Tien>250000</Thanh_Tien>");
                xml.append("</ThongTinNopTien>");
            }
            
            xml.append("</ThongTinChungTu>");
            xml.append("</Data>");
            
            // Signature section (giả lập)
            xml.append("<Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\">");
            xml.append("<SignedInfo>");
            xml.append("<CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\"/>");
            xml.append("<SignatureMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#rsa-sha1\"/>");
            xml.append("<Reference URI=\"\">");
            xml.append("<Transforms>");
            xml.append("<Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\"/>");
            xml.append("</Transforms>");
            xml.append("<DigestMethod Algorithm=\"http://www.w3.org/2000/09/xmldsig#sha1\"/>");
            xml.append("<DigestValue>pnTA3kbmes3JRiZXOlvYJdEA/uw=</DigestValue>");
            xml.append("</Reference>");
            xml.append("</SignedInfo>");
            xml.append("<SignatureValue>u9+ovv7aUg5IZwj7r3ZBWsXq30nR5Y2R/fps9EQoGN57dsCdEnkgDGVxuvtNliqXryB/EK74FKJU3vOeAtNsUry20dYeKw0gfk4BRrIj4MmRgeBxBT/yi9aP4S0KqNTBSVMQQ0tck4ZAe92c3d08QcD62TU+2B3GsbmO3GUIUH7rZANmNfTQ6lcS6u4CDJGZI50/LfS6vavaqkpY+JkhH35yjn4lH1gyktlLSXd0CymWY50W76dcWG5j1E/7G6RC4r+lP4AHCLlYY3SLKSE+tRwCWZk9mnuJZ7X9VfN5zzccIzJGBPI9K2+xZCVll3jFc0JUj0l2tU6uhaQSMUtddA==</SignatureValue>");
            xml.append("<KeyInfo>");
            xml.append("<X509Data>");
            xml.append("<X509IssuerSerial>");
            xml.append("<X509IssuerName>CN=VNPT Certification Authority, OU=VNPT-CA Trust Network, O=VNPT Group, C=VN</X509IssuerName>");
            xml.append("<X509SerialNumber>111661711467037078643656049484791041769</X509SerialNumber>");
            xml.append("</X509IssuerSerial>");
            xml.append("<X509Certificate>MIIGWjCCBEKgAwIBAgIQVAFDbJUnKkrOAPTcUfhO6TANBgkqhkiG9w0BAQUFADBpMQswCQYDVQQGEwJWTjETMBEGA1UEChMKVk5QVCBHcm91cDEeMBwGA1UECxMVVk5QVC1DQSBUcnVzdCBOZXR3b3JrMSUwIwYDVQQDExxWTlBUIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTE3MDkyNjA5MDMzNFoXDTE5MTIxNjA2NTgwOFowgaUxCzAJBgNVBAYTAlZOMRIwEAYDVQQIDAlIw4AgTuG7mEkxFTATBgNVBAcMDEhvw6BuIEtp4bq/bTFLMEkGA1UEAwxCTkfDgk4gSMOATkcgVEjGr8agTkcgTeG6oEkgQ+G7lCBQSOG6pk4gTkdP4bqgSSBUSMavxqBORyBWSeG7hlQgTkFNMR4wHAYKCZImiZPyLGQBAQwOTVNUOjAxMDAxMTI0MzcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/4RV2ukLUENDA0G4ivIEaIYonbUcrpP1CPmLPFFwep8wlaP06zu+f7FEdqPjaBbsVmLlZvnq8LdF6RBAT6xZEEOFh4m3/O52AjUTisVO6jB8Ey02UhsRwIC+k8RiPopZuGiLTktKCNyXFIZcZoMajhqUe+20DBlgjONx0xT6yb+hziR9C6RQsKiR9HCFrcFvDfc6urtdl1I/8whUp0Z/qTh84qy1lPBXRAnoDXlBc6FQn5THomPgSMcA3t/ncFUbNWpQSsoCVEfzc7CRKrIs+MidvhV5bPLiI1eFZOTFqyDmpQyXB2sZXkJceIMCaliBEl1u69dT8iKjSui3H8YtVAgMBAAGjggG/MIIBuzBwBggrBgEFBQcBAQRkMGIwMgYIKwYBBQUHMAKGJmh0dHA6Ly9wdWIudm5wdC1jYS52bi9jZXJ0cy92bnB0Y2EuY2VyMCwGCCsGAQUFBzABhiBodHRwOi8vb2NzcC52bnB0LWNhLnZuL3Jlc3BvbmRlcjAdBgNVHQ4EFgQUNqkFaQ95J/BzQW+1ZiAKhOn5bDQwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBQGacDV1QKKFY1Gfel84mgKVaxqrzBrBgNVHSAEZDBiMGAGDSsGAQQBge0DAQEDAQUwTzAmBggrBgEFBQcCAjAaHhgARABJAEQALQBCADIALgAwAC0AMwA2AG0wJQYIKwYBBQUHAgEWGWh0dHA6Ly9wdWIudm5wdC1jYS52bi9ycGEwMQYDVR0fBCowKDAmoCSgIoYgaHR0cDovL2NybC52bnB0LWNhLnZuL3ZucHRjYS5jcmwwDgYDVR0PAQH/BAQDAgTwMB8GA1UdJQQYMBYGCCsGAQUFBwMCBgorBgEEAYI3CgMMMCgGA1UdEQQhMB+BHWNoaW5obnQuaG9AdmlldGNvbWJhbmsuY29tLnZuMA0GCSqGSIb3DQEBBQUAA4ICAQAMPzm4gXM28n97OdGmiDUsRZ4ZOXu80evnkG31CnUDrrRkdkAQMm/FUvnvL84+H4XDlcmnU8alBC3VyNzgnqnWyLvauUwivAGf5jHErXYHFDaWT6YCIvborlvxk5biA05Wxvp2GKRyfg5qRQ6tcbByDjm4Bd/GLTo0ybVoTSGkrFr0pzxPS9gO1nEFV5z9Q3s5lyfH5OI7myshUS1g2hiPn3zhooY8Ee3blHlhGpm5WgEd4ac9khNwT974oJHnQN77T9o70SjdkrVo3djNznuwlJWX9AuhHzi5Qzj8lGnfb9NXARe4pSijPiRlGnMMGoFfOp71T9LCPgAJM0tMQDOxdUsIU+h+IXFy2/7Oh8UFlM3EK0l6HeK78Els3giNJscJIDGBRuNneSHEbfd2RQujZ/51Z49Ra4bLcqnd56mpXidjmkLgatilbQ9atwBmLciDJBlhR9cpapGKaN5jeER/xzPor2DuA2ofM1vZlNIRXeNhU+Spr+26OL9mr1jAyHCezWzo6qk47EqndAqDqefKgTlyka+X8VS5SD4h2o8TEHbIbivvZVLahSzaoFR1NqSZlAs8nxsujYE3oIjYxowi+53XKffqq+ide7kvqI8N18jNpEqzxRldVGQihO6EvOUzLd8L+uu1ocVRQEwiQbnWgP7l+dGdeq7Xpuc+cJE3EQ==</X509Certificate>");
            xml.append("</X509Data>");
            xml.append("</KeyInfo>");
            xml.append("</Signature>");
            
            xml.append("</Customs>");
            
            String result = xml.toString();
            log.info("Hoàn thành tạo XML cho tờ khai ID: {}, độ dài XML: {} ký tự", toKhai.getId(), result.length());
            
            return result;
            
        } catch (Exception e) {
            log.error("Lỗi khi tạo XML: ", e);
            throw new BusinessException("Lỗi khi tạo XML: " + e.getMessage());
        }
    }
    
    /**
     * Escape XML special characters
     */
    private String escapeXml(String input) {
        if (input == null) {
            return "";
        }
        return input.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&apos;");
    }
}
