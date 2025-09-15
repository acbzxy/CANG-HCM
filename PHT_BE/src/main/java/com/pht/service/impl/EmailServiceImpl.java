package com.pht.service.impl;

import java.util.List;
import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import java.io.ByteArrayInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.concurrent.CompletableFuture;

import com.pht.service.EmailService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Value("${email.host:smtp.gmail.com}")
    private String emailHost;

    @Value("${email.port:587}")
    private String emailPort;

    @Value("${email.username:}")
    private String emailUsername;

    @Value("${email.password:}")
    private String emailPassword;

    @Value("${email.from:}")
    private String emailFrom;

    @Override
    @Async("emailTaskExecutor")
    public CompletableFuture<Boolean> sendEmailWithPdfAttachmentAsync(List<String> to, String subject, String htmlContent,
                                                                     byte[] pdfAttachment, String fileName) {
        try {
            log.info("🚀 Bắt đầu gửi email bất đồng bộ với PDF attachment. To: {}, Subject: {}, File: {}",
                    to, subject, fileName);
            
            boolean result = sendEmailWithPdfAttachment(to, subject, htmlContent, pdfAttachment, fileName);
            
            if (result) {
                log.info("✅ Gửi email bất đồng bộ THÀNH CÔNG đến: {}", to);
            } else {
                log.error("❌ Gửi email bất đồng bộ THẤT BẠI đến: {}", to);
            }
            
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("❌ Lỗi khi gửi email bất đồng bộ: ", e);
            return CompletableFuture.completedFuture(false);
        }
    }

    @Override
    public boolean sendEmailWithPdfAttachment(List<String> to, String subject, String htmlContent,
                                               byte[] pdfAttachment, String fileName) {
        try {
            log.info("🚀 Bắt đầu gửi email với PDF attachment. To: {}, Subject: {}, File: {}", 
                    to, subject, fileName);

            if (to == null || to.isEmpty()) {
                log.warn("❌ Danh sách email người nhận trống");
                return false;
            }

            // Log cấu hình email (ẩn password)
            log.info("📧 Cấu hình email - Host: {}, Port: {}, Username: {}, Password: {}", 
                    emailHost, emailPort, emailUsername, 
                    StringUtils.hasText(emailPassword) ? "[SET]" : "[EMPTY]");

            if (!StringUtils.hasText(emailHost) || !StringUtils.hasText(emailUsername) || 
                !StringUtils.hasText(emailPassword)) {
                log.error("❌ Cấu hình email chưa đầy đủ. Host: {}, Username: {}, Password: [HIDDEN]", 
                        emailHost, emailUsername, StringUtils.hasText(emailPassword) ? "SET" : "EMPTY");
                return false;
            }

            // Cấu hình properties
            Properties props = new Properties();
            props.put("mail.smtp.host", emailHost);
            props.put("mail.smtp.port", emailPort);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.ssl.trust", emailHost);
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
            props.put("mail.smtp.ssl.checkserveridentity", "true");
            
            // Cấu hình timeout - tăng thời gian timeout
            props.put("mail.smtp.connectiontimeout", "30000");
            props.put("mail.smtp.timeout", "30000");
            props.put("mail.smtp.writetimeout", "30000");
            
            // Cấu hình buffer và chunking
            props.put("mail.smtp.chunksize", "1048576"); // 1MB chunks
            props.put("mail.smtp.ssl.checkserveridentity", "false");

            // Tạo session với debug
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(emailUsername, emailPassword);
                }
            });
            
            // Enable debug để xem chi tiết kết nối
            session.setDebug(true);

            // Tạo message
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(StringUtils.hasText(emailFrom) ? emailFrom : emailUsername));
            
            // Set recipients
            InternetAddress[] toAddresses = new InternetAddress[to.size()];
            for (int i = 0; i < to.size(); i++) {
                toAddresses[i] = new InternetAddress(to.get(i));
            }
            message.setRecipients(Message.RecipientType.TO, toAddresses);
            message.setSubject(subject, "UTF-8");

            // Tạo multipart message
            Multipart multipart = new MimeMultipart();

            // Thêm nội dung HTML
            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(htmlContent, "text/html; charset=UTF-8");
            multipart.addBodyPart(htmlPart);

            // Thêm PDF attachment
            if (pdfAttachment != null && pdfAttachment.length > 0) {
                // Kiểm tra kích thước file
                long fileSizeMB = pdfAttachment.length / (1024 * 1024);
                if (fileSizeMB > 10) {
                    log.warn("⚠️ PDF file khá lớn: {} MB, có thể gây timeout", fileSizeMB);
                }
                
                MimeBodyPart attachmentPart = new MimeBodyPart();
                
                // Sử dụng DataHandler với ByteArrayDataSource
                ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfAttachment, "application/pdf");
                attachmentPart.setDataHandler(new DataHandler(dataSource));
                attachmentPart.setFileName(fileName != null ? fileName : "bien_lai.pdf");
                attachmentPart.setDisposition(MimeBodyPart.ATTACHMENT);
                multipart.addBodyPart(attachmentPart);
                
                log.info("Đã thêm PDF attachment: {} ({} bytes, {} MB)", 
                        fileName != null ? fileName : "bien_lai.pdf", pdfAttachment.length, fileSizeMB);
            }

            message.setContent(multipart);

            // Gửi email
            log.info("📤 Đang gửi email...");
            Transport.send(message);
            
            log.info("✅ Gửi email THÀNH CÔNG đến: {}", to);
            return true;

        } catch (MessagingException e) {
            log.error("❌ Lỗi MessagingException khi gửi email với PDF attachment: ", e);
            
            // Thử fallback với SSL thay vì STARTTLS
            if (e.getMessage().contains("TLS") || e.getMessage().contains("SSL") || 
                e.getMessage().contains("IOException") || e.getMessage().contains("timeout")) {
                log.info("🔄 Thử fallback với SSL connection...");
                return sendEmailWithSslFallback(to, subject, htmlContent, pdfAttachment, fileName);
            }
            
            return false;
        } catch (Exception e) {
            log.error("❌ Lỗi không xác định khi gửi email: ", e);
            return false;
        }
    }

    /**
     * Fallback method sử dụng SSL thay vì STARTTLS
     */
    private boolean sendEmailWithSslFallback(List<String> to, String subject, String htmlContent, 
                                           byte[] pdfAttachment, String fileName) {
        try {
            log.info("🔄 Thử gửi email với SSL connection...");
            
            // Cấu hình properties cho SSL
            Properties props = new Properties();
            props.put("mail.smtp.host", emailHost);
            props.put("mail.smtp.port", "465"); // Port SSL cho Gmail
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.ssl.trust", emailHost);
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
            
            // Cấu hình timeout - tăng thời gian timeout cho SSL
            props.put("mail.smtp.connectiontimeout", "30000");
            props.put("mail.smtp.timeout", "30000");
            props.put("mail.smtp.writetimeout", "30000");
            
            // Cấu hình buffer và chunking cho SSL
            props.put("mail.smtp.chunksize", "1048576"); // 1MB chunks
            props.put("mail.smtp.ssl.checkserveridentity", "false");
            
            // Tạo session
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(emailUsername, emailPassword);
                }
            });
            
            // Tạo message
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(StringUtils.hasText(emailFrom) ? emailFrom : emailUsername));
            
            // Set recipients
            InternetAddress[] toAddresses = new InternetAddress[to.size()];
            for (int i = 0; i < to.size(); i++) {
                toAddresses[i] = new InternetAddress(to.get(i));
            }
            message.setRecipients(Message.RecipientType.TO, toAddresses);
            message.setSubject(subject, "UTF-8");

            // Tạo multipart message
            Multipart multipart = new MimeMultipart();

            // Thêm nội dung HTML
            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(htmlContent, "text/html; charset=UTF-8");
            multipart.addBodyPart(htmlPart);

            // Thêm PDF attachment nếu có
            if (pdfAttachment != null && pdfAttachment.length > 0) {
                // Kiểm tra kích thước file
                long fileSizeMB = pdfAttachment.length / (1024 * 1024);
                if (fileSizeMB > 10) {
                    log.warn("⚠️ PDF file khá lớn: {} MB, có thể gây timeout", fileSizeMB);
                }
                
                MimeBodyPart attachmentPart = new MimeBodyPart();
                
                // Sử dụng DataHandler với ByteArrayDataSource
                ByteArrayDataSource dataSource = new ByteArrayDataSource(pdfAttachment, "application/pdf");
                attachmentPart.setDataHandler(new DataHandler(dataSource));
                attachmentPart.setFileName(fileName != null ? fileName : "bien_lai.pdf");
                attachmentPart.setDisposition(MimeBodyPart.ATTACHMENT);
                multipart.addBodyPart(attachmentPart);
                
                log.info("SSL Fallback - Đã thêm PDF attachment: {} ({} bytes, {} MB)", 
                        fileName != null ? fileName : "bien_lai.pdf", pdfAttachment.length, fileSizeMB);
            }

            message.setContent(multipart);

            // Gửi email
            Transport.send(message);
            
            log.info("✅ Gửi email THÀNH CÔNG với SSL connection đến: {}", to);
            return true;

        } catch (Exception e) {
            log.error("❌ Lỗi khi gửi email với SSL fallback: ", e);
            return false;
        }
    }

    @Override
    public boolean sendSimpleEmail(List<String> to, String subject, String htmlContent) {
        return sendEmailWithPdfAttachment(to, subject, htmlContent, null, null);
    }
    
    /**
     * Custom DataSource để xử lý byte array
     */
    public static class ByteArrayDataSource implements DataSource {
        private byte[] data;
        private String type;
        
        public ByteArrayDataSource(byte[] data, String type) {
            this.data = data;
            this.type = type;
        }
        
        @Override
        public String getContentType() {
            return type;
        }
        
        @Override
        public java.io.InputStream getInputStream() throws java.io.IOException {
            return new ByteArrayInputStream(data);
        }
        
        @Override
        public String getName() {
            return "ByteArrayDataSource";
        }
        
        @Override
        public java.io.OutputStream getOutputStream() throws java.io.IOException {
            throw new java.io.IOException("Not supported");
        }
    }
}
