package com.fpt.schedule;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;

import com.fpt.dto.TcsTdttQueueBean;
import com.fpt.dto.TcsTdttXML;
import com.fpt.mq.ConstantMQ;
import com.fpt.mq.MQMain;
import com.fpt.service.TcsTdttKxTdttQueueService;
import com.fpt.signer.Signer;
import com.fpt.util.DSUtil;
import com.fpt.util.TcsDocument;
import com.ibm.mq.MQException;
import com.ibm.mq.MQQueueManager;
import com.signer.BoundedBufferedReader;

@Component
public class TcsKxQueueOut {
	@Autowired
	private TcsTdttKxTdttQueueService queueService;
	private static Logger log = LoggerFactory.getLogger(TcsKxQueueOut.class);

	@Transactional
	public void execute() {
		MQQueueManager p_qmgr = null;
		try {
			InputStream inputStream = null;
			Map map = new HashMap();
			List list_dm;
			String id;
			boolean check = true;
			log.info(":========================START QUEUE OUT=====================");
			p_qmgr = MQMain.initMQ(p_qmgr);
			if (p_qmgr == null) {
				check = false;
			}
			// check = false, khong xu ly
			while (check) {
				map = this.queueService.getPutQueue();
				list_dm = (List) map.get("p_out");
				int size = list_dm.size();
				if (size > 0) {
					for (int i = 0; i < size; i++) {
						TcsTdttXML fileXml = new TcsTdttXML();
						fileXml = (TcsTdttXML) list_dm.get(i);
						inputStream = fileXml.getFile_data();
						String strXML = new Scanner(inputStream, "UTF-8").useDelimiter("\\A").next();

						if (!"099".equals(fileXml.getTran_code())) {
							strXML = trimxml(strXML);
							strXML = new Signer().signData(strXML);
						}
						id = fileXml.getId();
						String sender_code = fileXml.getSender_code();
						String receiver_code = fileXml.getReceiver_code();
						TcsTdttQueueBean bean = new TcsTdttQueueBean();
						bean.setPkg_id(id);
						// Chuyen sang file hash
						try {
							Document doc = TcsDocument.stringToDom(strXML);

							String file_hash = DSUtil.digest(doc);
							bean.setFile_hash(file_hash);
							bean.setFile_data(strXML.getBytes("UTF-8"));
							// put to MQ
							log.info(": ======START PUT QUEUE = " + ConstantMQ.QUEUE_OUTBOX + ", ID = " + id
									+ ", sender_code = " + sender_code + ", receiver_code = " + receiver_code);
							try {
								MQMain.putMessage(p_qmgr, ConstantMQ.QUEUE_OUTBOX, strXML, id);
								p_qmgr.commit();
							} catch (Exception exx) {
								throw new Exception("Lỗi Kết nối EQueue");
							}
							bean.setId(Long.valueOf(id));
							bean.setStatus("99");
							bean.setSts_verify("11");
							bean.setXml(strXML);
							bean.setFile_ky(strXML.getBytes("UTF-8"));
							log.info(": ======START UPDATE DB, ID = " + id + ", sender_code = " + sender_code
									+ ", receiver_code = " + receiver_code);
							int _check = this.queueService.updateTdttQueueIn(bean);

							log.info(": ======END UPDATE DB, ID = " + id + ", sender_code = " + sender_code
									+ ", receiver_code = " + receiver_code + ", STATUS = " + _check);
							log.info(": ======END PUT QUEUE, ID = " + id + ", sender_code = " + sender_code
									+ ", receiver_code = " + receiver_code);
						} catch (Exception e) {
							log.info("put msg error", e);
						}
					}
				} else {
					check = false;
				}
			}
		} catch (MQException ex) {
			log.error(": MQException: ", ex);
		} catch (Exception ex) {
			log.error(": IOException: ", ex);
		}
		try {
			MQMain.closeMQ(p_qmgr);
		} catch (Exception ex) {
			log.error(": Exception: ", ex);
		}
		try {
			log.info(":========================END QUEUE OUT=====================");
			Thread.sleep(5L * 1000L);
		} catch (Exception ex) {
		}
	}

	public String trimxml(String input) {
		BufferedReader reader = new BufferedReader(new StringReader(input));
		StringBuffer result = new StringBuffer();
		try {
			String line;
			BoundedBufferedReader breader = new BoundedBufferedReader(reader);
			while ((line = breader.readLine()) != null)
				result.append(line.trim());
			return result.toString();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}