package com.pht.service;

import java.util.List;

import com.pht.exception.BusinessException;
import com.pht.model.request.KySoRequest;
import com.pht.model.response.ChuKySoResponse;
import com.pht.model.response.KySoResponse;

public interface DigitalSignatureService {
    
    /**
     * Lay danh sach chu ky so co san
     */
    List<ChuKySoResponse> layDanhSachChuKySo();
    
    /**
     * Thuc hien ky so to khai
     */
    KySoResponse kySo(KySoRequest request) throws BusinessException;
}
