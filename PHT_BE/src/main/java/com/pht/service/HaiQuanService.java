package com.pht.service;

import com.pht.model.request.LayThongTinHaiQuanRequest;
import com.pht.model.request.ParseHaiQuanDataRequest;
import com.pht.model.response.ThongTinHaiQuanResponse;

public interface HaiQuanService {
    
    ThongTinHaiQuanResponse layThongTinHaiQuan(LayThongTinHaiQuanRequest request);
    
    ThongTinHaiQuanResponse parseHaiQuanResponse(ParseHaiQuanDataRequest request);
    
}
