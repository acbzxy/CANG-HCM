package com.fpt.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.fpt.dto.SystemParamBean;
import com.fpt.dto.TcsTdttXML;

public class TcsTdtttXMLIdMapper {
	public class get_dm_kxtd_hdr extends BeanMapper {
		public Object mapRow(ResultSet rs, int arg1) throws SQLException {
			TcsTdttXML hdrXML = new TcsTdttXML();
			hdrXML.setId(rs.getString("id"));
			return hdrXML;
		}
	}

	public class SystemParamMapper extends BeanMapper {
		public Object mapRow(ResultSet rs, int arg1) throws SQLException {
			SystemParamBean bean = new SystemParamBean();
			bean.setCode(rs.getString("ma_ts"));
			bean.setValue(rs.getString("mac_dinh"));
			bean.setType(rs.getString("loai"));
			bean.setOrderNumber(rs.getInt("sap_xep"));
			bean.setDescription(rs.getString("mo_ta"));
			return bean;
		}
	}
}
