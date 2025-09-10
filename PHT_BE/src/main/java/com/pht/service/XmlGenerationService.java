package com.pht.service;

import com.pht.entity.ToKhaiThongTin;
import com.pht.exception.BusinessException;

public interface XmlGenerationService {
    
    /**
     * Tạo XML từ thông tin tờ khai và lưu vào trường XML tương ứng
     * @param toKhaiId ID của tờ khai
     * @param lanKy Lần ký (1: lưu vào KYLAN1_XML, khác: lưu vào KYLAN2_XML)
     */
    String generateAndSaveXml(Long toKhaiId, Integer lanKy) throws BusinessException;
    
    /**
     * Tạo XML từ đối tượng ToKhaiThongTin
     */
    String generateXml(ToKhaiThongTin toKhai) throws BusinessException;
}
