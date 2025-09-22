package com.fpt.mq;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fpt.util.Constant;
import com.ibm.mq.MQEnvironment;
import com.ibm.mq.MQException;
import com.ibm.mq.MQGetMessageOptions;
import com.ibm.mq.MQMessage;
import com.ibm.mq.MQPutMessageOptions;
import com.ibm.mq.MQQueue;
import com.ibm.mq.MQQueueManager;
import com.ibm.mq.constants.CMQC;
import com.ibm.mq.constants.MQConstants;

public class MQMain {
	private static Logger logger = LoggerFactory.getLogger(MQMain.class);

	public static MQQueueManager initMQ(MQQueueManager p_qmgr) throws MQException {
		logger.info("connect MQ");
		logger.info(ConstantMQ.QMGR);
		logger.info(ConstantMQ.QUEUE_INBOX);
		logger.info(ConstantMQ.HOST_NAME);
		logger.info(ConstantMQ.CHANNEL);
		logger.info(String.valueOf(ConstantMQ.PORT));
		logger.info(Constant.KBNN_MQ_USER_ID);
		MQEnvironment.hostname = ConstantMQ.HOST_NAME;
		MQEnvironment.channel = ConstantMQ.CHANNEL;
		MQEnvironment.port = ConstantMQ.PORT;
		MQEnvironment.CCSID = ConstantMQ.CCSID;
		if (StringUtils.trimToEmpty(Constant.KBNN_MQ_USER_ID) != null) {
			MQEnvironment.userID = Constant.KBNN_MQ_USER_ID;
		}
		if (StringUtils.trimToEmpty(Constant.KBNN_MQ_USER_PWD) != null) {
			MQEnvironment.password = Constant.KBNN_MQ_USER_PWD;
		}
		p_qmgr = new MQQueueManager(ConstantMQ.QMGR);
		return p_qmgr;
	}

	public static boolean closeMQ(MQQueueManager p_qmgr) throws Exception {
		if (p_qmgr != null)
			p_qmgr.disconnect();
		return true;
	}

	public static boolean checkLastSegment(int iMsgFlag) throws Exception {
		return iMsgFlag >= 6;
	}

	public static String getMessage(MQQueueManager p_qmgr, String queue_name) throws Exception {
		String data = "";
		try {
			int openOptions = 17;

			MQQueue p_queue = p_qmgr.accessQueue(queue_name, openOptions);
			MQMessage mqMsg = new MQMessage();
			mqMsg.format = "MQSTR   ";
			mqMsg.characterSet = 1208;

			MQGetMessageOptions gmo = new MQGetMessageOptions();
			gmo.options = 32768;
			gmo.options += 2;
			p_queue.get(mqMsg, gmo);
			data = mqMsg.readStringOfByteLength(mqMsg.getMessageLength());
			p_queue.close();
		} catch (MQException ex) {
			if ((ex.completionCode == CMQC.MQCC_FAILED) && (ex.reasonCode == CMQC.MQRC_NO_MSG_AVAILABLE)) {
				logger.info("No Message in Queue!");
			} else {
				throw ex;
			}

		}
		return data;
	}

	public static boolean putMessage(MQQueueManager p_qmgr, String queue_name, String data, String messageId)
			throws Exception {
		int openOptions = 16;

		MQQueue p_queue = p_qmgr.accessQueue(queue_name, openOptions);
		MQMessage mqMsg = new MQMessage();
		mqMsg.persistence = 1;
		mqMsg.expiry = 51840000;
		mqMsg.format = "MQSTR   ";
		mqMsg.characterSet = 1208;

		MQPutMessageOptions pmo = new MQPutMessageOptions();
		pmo.options = 32768;
		pmo.options += 2;
		try {
			mqMsg.clearMessage();
			byte[] msgid = messageId.getBytes("UTF-8");
			mqMsg.correlationId = msgid;
			mqMsg.messageId = MQConstants.MQMI_NONE;
			mqMsg.writeString(data);
			p_queue.put(mqMsg, pmo);
		} catch (Exception ex) {
			if (p_qmgr.isConnected())
				p_qmgr.backout();
		}
		p_queue.close();
		return true;
	}
}
