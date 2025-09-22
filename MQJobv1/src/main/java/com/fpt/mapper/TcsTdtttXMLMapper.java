package com.fpt.mapper;

import java.sql.Blob;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fpt.dto.TcsTdttXML;

public class TcsTdtttXMLMapper {
	public class get_dm_kxtd_hdr extends BeanMapper {
		public Object mapRow(ResultSet rs, int arg1) throws SQLException {
			TcsTdttXML hdrXML = new TcsTdttXML();
			hdrXML.setId(rs.getString("id"));
			Blob obj = rs.getBlob("data_blob");
			hdrXML.setFile_data(obj.getBinaryStream());
			hdrXML.setSender_code(rs.getString("sender_code"));
			hdrXML.setReceiver_code(rs.getString("receiver_code"));
			hdrXML.setSts_verify(rs.getString("sts_sign"));
			hdrXML.setTran_code(rs.getString("tran_code"));
			// hdrXML.setPath_sign(rs.getString("path_sign"));
			// hdrXML.setPos_sign(rs.getString("pos_sign"));
			// hdrXML.setCheck_ky(rs.getString("notes"));

			return hdrXML;
		}
	}
}
