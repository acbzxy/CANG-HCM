package com.fpt.respository;

import java.sql.Blob;
import java.util.Map;

import com.fpt.dto.TcsTdttQueueBean;
import com.ibm.mq.MQQueueManager;

public interface TcsTdttDaoRepository {

	public Map put_queue() throws Exception;

	public void insert_tdtt_queue_in(TcsTdttQueueBean bean, MQQueueManager p_qmgr) throws Exception;

	
	public void update_tdtt_queue_in(TcsTdttQueueBean bean) throws Exception;

	public Map insert_tdtt_queue_inobox(TcsTdttQueueBean bean, MQQueueManager p_qmgr, Blob blob) throws Exception;

	public void insert_tac_nghiep(Long id, MQQueueManager p_qmgr) throws Exception;

	public Map getParamMail(String pkg_id) throws Exception;
}
