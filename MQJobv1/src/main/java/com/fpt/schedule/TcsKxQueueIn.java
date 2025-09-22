package com.fpt.schedule;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.xml.sax.SAXParseException;

import com.fpt.dto.TcsTdttQueueBean;
import com.fpt.mq.ConstantMQ;
import com.fpt.mq.MQMain;
import com.fpt.service.TcsTdttKxTdttQueueService;
import com.fpt.util.Constant;
import com.fpt.util.SignatureVerifier;
import com.fpt.util.TcsDocument;
import com.ibm.mq.MQException;
import com.ibm.mq.MQQueueManager;

import jakarta.transaction.Transactional;

@Component
public class TcsKxQueueIn {
	@Autowired
	private TcsTdttKxTdttQueueService queueService;
	private static Logger log = LoggerFactory.getLogger(TcsKxQueueIn.class);

	@Transactional
	public void execute() {
		MQQueueManager p_qmgr = null;
		Map map = new HashMap();
		try {
			boolean check = true;
			int count = 0;
			int _check = 0;
			log.info(":========================START QUEUE IN=====================");
			p_qmgr = MQMain.initMQ(p_qmgr);
			if (p_qmgr == null) {
				check = false;
			}
			String strXML = "";
			TcsTdttQueueBean bean = null;
			log.info(": ============Check =" + check);
			while (check) {
				try {
					log.info(": ============START GET QUEUE ======================" + ConstantMQ.QUEUE_INBOX);
					strXML = MQMain.getMessage(p_qmgr, ConstantMQ.QUEUE_INBOX);

					// strXML = getMessageFromFile("C:\\TCS\\simulator\\071.xml");
					log.info("message from kbnn:  " + strXML);
					log.info(": ======END GET QUEUE===========");
					if (strXML != null && !"".equals(strXML)) {
						Document doc = TcsDocument.stringToDom(strXML);
						XPath xPath = XPathFactory.newInstance().newXPath();
						System.out.println((String) xPath.evaluate("/DATA/HEADER/MSG_ID", doc, XPathConstants.STRING));
						// header
						String id = (String) xPath.evaluate("/DATA/HEADER/ID", doc, XPathConstants.STRING);
						if (id.isEmpty()) {
							id = (String) xPath.evaluate("/DATA/HEADER/ID", doc, XPathConstants.STRING);
						}
						String sender_Code = (String) xPath.evaluate("/Data/Header/SENDER_CODE", doc,
								XPathConstants.STRING);
						if (sender_Code.isEmpty()) {
							sender_Code = (String) xPath.evaluate("/DATA/HEADER/SENDER_CODE", doc,
									XPathConstants.STRING);
						}
						String SENDER_NAME = (String) xPath.evaluate("/DATA/HEADER/SENDER_NAME", doc,
								XPathConstants.STRING);
						if (SENDER_NAME.isEmpty()) {
							SENDER_NAME = (String) xPath.evaluate("/DATA/HEADER/SENDER_NAME", doc,
									XPathConstants.STRING);
						}
						String RECEIVER_CODE = (String) xPath.evaluate("/DATA/HEADER/RECEIVER_CODE", doc,
								XPathConstants.STRING);
						if (RECEIVER_CODE.isEmpty()) {
							RECEIVER_CODE = (String) xPath.evaluate("/DATA/HEADER/RECEIVER_CODE", doc,
									XPathConstants.STRING);
						}
						String RECEIVER_NAME = (String) xPath.evaluate("/DATA/HEADER/RECEIVER_NAME", doc,
								XPathConstants.STRING);
						if (RECEIVER_NAME.isEmpty()) {
							RECEIVER_NAME = (String) xPath.evaluate("/DATA/HEADER/RECEIVER_NAME", doc,
									XPathConstants.STRING);
						}
						String TRAN_CODE = (String) xPath.evaluate("/DATA/HEADER/TRAN_CODE", doc,
								XPathConstants.STRING);
						if (TRAN_CODE.isEmpty()) {
							TRAN_CODE = (String) xPath.evaluate("/DATA/HEADER/TRAN_CODE", doc, XPathConstants.STRING);
						}
						String MSG_ID = (String) xPath.evaluate("/DATA/HEADER/MSG_ID", doc, XPathConstants.STRING);
						if (MSG_ID.isEmpty()) {
							MSG_ID = (String) xPath.evaluate("/DATA/HEADER/MSG_ID", doc, XPathConstants.STRING);
						}
						String MSG_REFID = (String) xPath.evaluate("/DATA/HEADER/MSG_REFID", doc,
								XPathConstants.STRING);
						if (MSG_REFID.isEmpty()) {
							MSG_REFID = (String) xPath.evaluate("/DATA/HEADER/MSG_REFID", doc, XPathConstants.STRING);
						}
						String ID_LINK = (String) xPath.evaluate("/DATA/HEADER/ID_LINK", doc, XPathConstants.STRING);
						if (ID_LINK.isEmpty()) {
							ID_LINK = (String) xPath.evaluate("/DATA/HEADER/ID_LINK", doc, XPathConstants.STRING);
						}
						String SEND_DATE = (String) xPath.evaluate("/DATA/HEADER/SEND_DATE", doc,
								XPathConstants.STRING);
						if (SEND_DATE.isEmpty()) {
							SEND_DATE = (String) xPath.evaluate("/DATA/HEADER/SEND_DATE", doc, XPathConstants.STRING);
						}
						String ORIGINAL_CODE = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_CODE", doc,
								XPathConstants.STRING);
						if (ORIGINAL_CODE.isEmpty()) {
							ORIGINAL_CODE = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_CODE", doc,
									XPathConstants.STRING);
						}
						String ORIGINAL_NAME = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_NAME", doc,
								XPathConstants.STRING);
						if (ORIGINAL_NAME.isEmpty()) {
							ORIGINAL_NAME = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_NAME", doc,
									XPathConstants.STRING);
						}
						String ORIGINAL_DATE = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_DATE", doc,
								XPathConstants.STRING);
						if (ORIGINAL_DATE.isEmpty()) {
							ORIGINAL_DATE = (String) xPath.evaluate("/DATA/HEADER/ORIGINAL_DATE", doc,
									XPathConstants.STRING);
						}
						String ERROR_CODE = (String) xPath.evaluate("/DATA/HEADER/ERROR_CODE", doc,
								XPathConstants.STRING);
						if (ERROR_CODE.isEmpty()) {
							ERROR_CODE = (String) xPath.evaluate("/DATA/HEADER/ERROR_CODE", doc, XPathConstants.STRING);
						}
						String ERROR_DESC = (String) xPath.evaluate("/DATA/HEADER/ERROR_DESC", doc,
								XPathConstants.STRING);
						if (ERROR_DESC.isEmpty()) {
							ERROR_DESC = (String) xPath.evaluate("/DATA/HEADER/ERROR_DESC", doc, XPathConstants.STRING);
						}
						String STATUS = (String) xPath.evaluate("/DATA/HEADER/ERROR_DESC", doc, XPathConstants.STRING);
						if (STATUS.isEmpty()) {
							STATUS = (String) xPath.evaluate("/DATA/HEADER/STATUS", doc, XPathConstants.STRING);
						}
						String STS_VERIFY = (String) xPath.evaluate("/DATA/HEADER/STS_VERIFY", doc,
								XPathConstants.STRING);
						if (STS_VERIFY.isEmpty()) {
							STS_VERIFY = (String) xPath.evaluate("/DATA/HEADER/STS_VERIFY", doc, XPathConstants.STRING);
						}
						String ERR_LOG = (String) xPath.evaluate("/DATA/HEADER/ERR_LOG", doc, XPathConstants.STRING);
						if (ERR_LOG.isEmpty()) {
							ERR_LOG = (String) xPath.evaluate("/DATA/HEADER/ERR_LOG", doc, XPathConstants.STRING);
						}
						String NOTES = (String) xPath.evaluate("/DATA/HEADER/NOTES", doc, XPathConstants.STRING);
						if (NOTES.isEmpty()) {
							NOTES = (String) xPath.evaluate("/DATA/HEADER/NOTES", doc, XPathConstants.STRING);
						}
						log.info(": ================START INSERT DB, ID ============= " + id + ", TSN_CODE = "
								+ TRAN_CODE + ", TRAN_NUM = " + MSG_ID);
						bean = new TcsTdttQueueBean();
						// bean.setId(Long.valueOf(id));
						bean.setSender_code(sender_Code);
						bean.setSender_name(SENDER_NAME);
						bean.setReceiver_code(RECEIVER_CODE);
						bean.setReceiver_name(RECEIVER_NAME);
						bean.setTran_code(TRAN_CODE);
						bean.setMsg_id(MSG_ID);
						bean.setMsg_fefid(MSG_REFID);
						bean.setId_link(ID_LINK);
						bean.setSend_date(SEND_DATE);
						bean.setOrignal_code(ORIGINAL_CODE);
						bean.setOrignal_name(ORIGINAL_NAME);
						bean.setOrignal_date(ORIGINAL_DATE.toString());
						bean.setError_code(ERROR_CODE);
						bean.setError_desc(ERROR_DESC);
						bean.setNotes(NOTES);
						bean.setData_blob(strXML.getBytes("UTF-8"));
						bean.setData_blob_4(strXML.getBytes("UTF-8"));

//						if ("099".equals(TRAN_CODE)) {
//							bean.setStatus("00");
//							bean.setSts_verify("11");
//						} else {
//
//							if (SignatureVerifier.verify(strXML, Constant.PATH_OF_CERTKB_FILE)) {
//								bean.setStatus("00");
//								bean.setSts_verify("11");
//							} else {
//								bean.setStatus("13");
//								bean.setSts_verify("31");
//							}
//						}

						bean.setStatus("00");
						bean.setSts_verify("11");

						if (p_qmgr == null) {
							log.info("p_qmgr is null before insert DB");
							check = false;
						}

						queueService.insertTdttQueueIn(bean, p_qmgr);
						count = count + 1;
						log.info(": ======COMMITED COUNT======= : " + count);
						if (p_qmgr == null) {
							log.info("p_qmgr is null after insert DB");
							check = false;
						} else {
							p_qmgr.commit();
						}

						log.info(": ======END INSERT DB, ID ========== " + ERR_LOG + ", TSN_CODE = " + ERR_LOG
								+ ", TRAN_NUM = " + ERR_LOG + ", STATUS = " + _check);
					} else {
						count = 0;
						log.info(": ======NO DATA FOUND=============");
						check = false;
					}
				} catch (MQException ex) {
					p_qmgr.backout();
					log.error(": MQException: Completion Code " + ex.completionCode + " Reason Code " + ex.reasonCode);
					check = false;
				} catch (java.io.IOException ex) {
					log.error(": IOException: " + ex.getMessage() + ", Data: " + strXML);
					bean.setFile_hash("Error file_hash ");
					queueService.insertTdttQueueIn(bean, p_qmgr);
					p_qmgr.commit();
				} catch (Exception ex) {
					log.error("Exception get msg queue kbnn", ex);
//					facade.insert_tdtt_queue_in(bean, p_qmgr);
					if (ex instanceof SAXParseException) {
						p_qmgr.commit();
					} else if (ex.toString().contains("For input string")) {
						p_qmgr.commit();
					} else {
						if (ex.toString().contains("unique constraint")) {
							p_qmgr.commit();
						} else {
							log.error(": ==Exception: ==" + ex.getMessage() + ", Data: " + strXML);
							if (p_qmgr == null) {
								log.info("p_qmgr is null");
							} else {
								p_qmgr.commit();
							}
							check = false;
						}
					}
				}
			}
		} catch (Exception ex) {
			log.error(": Exception: " + ex.getMessage());
		}
		try {
			MQMain.closeMQ(p_qmgr);
		} catch (Exception ex) {
			log.error(": Exception: " + ex.getMessage());
		}
		try {
			log.info(":========================END QUEUE IN=====================");
			Thread.sleep(5L * 1000L);
		} catch (Exception ex) {
		}

		/*
		 * com.fpt.util.Constant.workStatus = true; }else{ log.error("Job can't start");
		 * }
		 */
	}

	private String readFile(String pathname) throws IOException {
		File file = new File(pathname);
		StringBuilder fileContents = new StringBuilder((int) file.length());
		Scanner scanner = new Scanner(file);
		String lineSeparator = System.getProperty("line.separator");
		try {
			while (scanner.hasNextLine()) {
				fileContents.append(scanner.nextLine() + lineSeparator);
			}
			return fileContents.toString();
		} finally {
			scanner.close();
		}
	}

	private String getMessageFromFile(String str) {
		String rs = "";
		try {
			File file = new File(str);
			if (file.exists()) {
				InputStream is = new FileInputStream(file);
				byte[] b = new byte[(int) file.length()];
				int len = b.length;
				int total = 0;

				while (total < len) {
					int result = is.read(b, total, len - total);
					if (result == -1) {
						break;
					}
					total += result;
				}
				rs = new String(b, "UTF-8");
				is.close();
			}
		} catch (Exception e) {
			log.error("exception", e);
		}
		return rs;
	}
}