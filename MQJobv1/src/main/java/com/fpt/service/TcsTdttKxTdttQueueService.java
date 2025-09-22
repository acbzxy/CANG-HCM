package com.fpt.service;

import java.sql.Blob;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpt.dto.TcsTdttQueueBean;
import com.fpt.respository.TcsTdttDaoRepository;
import com.ibm.mq.MQQueueManager;

@Service
public class TcsTdttKxTdttQueueService {

	@Autowired
	private TcsTdttDaoRepository tdttDmTuDongDao;

	@Transactional
	public void insertTdttQueueIn(TcsTdttQueueBean bean, MQQueueManager pQmgr) throws Exception {
		try {
			tdttDmTuDongDao.insert_tdtt_queue_in(bean, pQmgr);
		} catch (Exception e) {
			if (e.toString().contains("For input string")) {
				bean.setTran_num("0");
				bean.setError_code("LOI FIELD");
				bean.setError_desc(e.getMessage());
				tdttDmTuDongDao.insert_tdtt_queue_in(bean, pQmgr);
			} else if (e.toString().contains("unique constraint")) {
				throw e;
			} else {
				throw e;
			}
		}
	}

	@Transactional
	public int updateTdttQueueIn(TcsTdttQueueBean bean) throws Exception {
		try {
			tdttDmTuDongDao.update_tdtt_queue_in(bean);
			return 0;
		} catch (Exception e) {
			throw e;
		}
	}

	public Map<?, ?> getPutQueue() throws Exception {
		return tdttDmTuDongDao.put_queue();
	}

	@Transactional
	public Map<?, ?> insertTdttQueueInbox(TcsTdttQueueBean bean, MQQueueManager pQmgr, Blob blob) throws Exception {
		try {
			return tdttDmTuDongDao.insert_tdtt_queue_inobox(bean, pQmgr, blob);
		} catch (Exception e) {
			throw e;
		}
	}

	@Transactional
	public void insertTacNghiep(Long id, MQQueueManager pQmgr) throws Exception {
		try {
			tdttDmTuDongDao.insert_tac_nghiep(id, pQmgr);
		} catch (Exception e) {
			throw e;
		}
	}

	public Map<?, ?> getSystemParams(String pkgId) throws Exception {
		return tdttDmTuDongDao.getParamMail(pkgId);
	}
}
