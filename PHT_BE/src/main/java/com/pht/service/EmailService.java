package com.pht.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service interface cho việc gửi email
 */
public interface EmailService {
    
    /**
     * Gửi email với attachment PDF (đồng bộ)
     * @param to List email người nhận
     * @param subject Tiêu đề email
     * @param htmlContent Nội dung HTML
     * @param pdfAttachment PDF attachment dưới dạng byte array
     * @param fileName Tên file PDF
     * @return true nếu gửi thành công
     */
    boolean sendEmailWithPdfAttachment(List<String> to, String subject, String htmlContent, 
                                     byte[] pdfAttachment, String fileName);
    
    /**
     * Gửi email với attachment PDF (bất đồng bộ)
     * @param to List email người nhận
     * @param subject Tiêu đề email
     * @param htmlContent Nội dung HTML
     * @param pdfAttachment PDF attachment dưới dạng byte array
     * @param fileName Tên file PDF
     * @return CompletableFuture<Boolean> kết quả gửi email
     */
    CompletableFuture<Boolean> sendEmailWithPdfAttachmentAsync(List<String> to, String subject, String htmlContent, 
                                                             byte[] pdfAttachment, String fileName);
    
    /**
     * Gửi email đơn giản không có attachment
     * @param to List email người nhận
     * @param subject Tiêu đề email
     * @param htmlContent Nội dung HTML
     * @return true nếu gửi thành công
     */
    boolean sendSimpleEmail(List<String> to, String subject, String htmlContent);
}
