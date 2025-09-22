package com.fpt.respository.impl;

import java.sql.Blob;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.InvalidResultSetAccessException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.StoredProcedure;
import org.springframework.stereotype.Repository;

import com.fpt.dto.TcsTdttQueueBean;
import com.fpt.mapper.TcsTdtttXMLIdMapper;
import com.fpt.mapper.TcsTdtttXMLMapper;
import com.fpt.respository.TcsTdttDaoRepository;
import com.fpt.util.DAOException;
import com.ibm.mq.MQQueueManager;

import oracle.jdbc.OracleTypes;

@Repository
public class TcsTdttDaoRepositoryImpl implements TcsTdttDaoRepository {
	private static Logger log = LoggerFactory.getLogger(TcsTdttDaoRepositoryImpl.class);
	protected JdbcTemplate jdbcTemplate = new JdbcTemplate();
	@Autowired
	private DataSource dataSource;

	public Map<?, ?> put_queue() throws Exception {
		Put_queueStoreProcedure proc = new Put_queueStoreProcedure();
		Map<?, ?> map = new HashMap();
		try {
			Map<?, ?> params = new HashMap();
			map = proc.execute(params);
		} catch (DataAccessException ex) {
			throw new DAOException(ex.getMessage());
		}
		return map;
	}

	private class Put_queueStoreProcedure extends StoredProcedure {
		public static final String SQL = "tcs_pck_tdtt_kbnn.prc_tcs_get_xmlout";

		public Put_queueStoreProcedure() throws Exception {
			setDataSource(dataSource);
			setSql(SQL);
			declareParameter(
					new SqlOutParameter("p_out", OracleTypes.CURSOR, new TcsTdtttXMLMapper().new get_dm_kxtd_hdr()));
			compile();
		}
	}

	public Map insert_tdtt_queue_inobox(TcsTdttQueueBean bean, MQQueueManager p_qmg, Blob blob) throws Exception {
		InsertStoreProcedure proc = new InsertStoreProcedure();
		Map map = new HashMap();
		try {
			Map params = new HashMap();
			params.put("p_SENDER_CODE", bean.getSender_code());
			params.put("p_SENDER_NAME", bean.getSender_name());
			params.put("p_RECEIVER_CODE", bean.getReceiver_code());
			params.put("p_RECEIVER_NAME", bean.getReceiver_name());
			params.put("p_TRAN_CODE", bean.getTran_code());
			params.put("p_MSG_ID", bean.getMsg_id());
			params.put("p_MSG_REFID", bean.getMsg_fefid());
			params.put("p_ID_LINK", bean.getId_link());
			params.put("p_SEND_DATE", bean.getSend_date());
			params.put("p_ORIGINAL_CODE", bean.getOrignal_code());
			params.put("p_ORIGINAL_NAME", bean.getOrignal_name());
			params.put("p_ORIGINAL_DATE", bean.getOrignal_date());
			params.put("p_ERROR_CODE", bean.getError_code());
			params.put("p_ERROR_DESC", bean.getError_desc());
			params.put("p_STATUS", bean.getStatus());
			params.put("p_STS_VERIFY", bean.getSts_verify());
			params.put("p_DATA_BLOB", blob);
			params.put("p_ERR_LOG", bean.getErr_log());
			params.put("p_NOTES", bean.getNotes());

			map = proc.execute(params);
		} catch (DataAccessException ex) {
			throw new DAOException(ex.getMessage());
		}
		return map;
	}

	private class InsertStoreProcedure extends StoredProcedure {
		public static final String SQL = "tcs_pck_tdt.prc_tdtt_insert_inbox";

		public InsertStoreProcedure() throws Exception {
			setDataSource(dataSource);
			setSql(SQL);
			declareParameter(new SqlParameter("p_SENDER_CODE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_SENDER_NAME", Types.VARCHAR));
			declareParameter(new SqlParameter("p_RECEIVER_CODE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_RECEIVER_NAME", Types.VARCHAR));
			declareParameter(new SqlParameter("p_TRAN_CODE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_MSG_REFID", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ID_LINK", Types.VARCHAR));
			declareParameter(new SqlParameter("p_SEND_DATE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ORIGINAL_CODE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ORIGINAL_NAME", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ORIGINAL_DATE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ERROR_CODE", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ERROR_DESC", Types.VARCHAR));
			declareParameter(new SqlParameter("p_STATUS", Types.VARCHAR));
			declareParameter(new SqlParameter("p_STS_VERIFY", Types.VARCHAR));
			declareParameter(new SqlParameter("p_DATA_BLOB", Types.BLOB));
			declareParameter(new SqlParameter("p_ERR_LOG", Types.VARCHAR));
			declareParameter(new SqlParameter("p_NOTES", Types.VARCHAR));
			declareParameter(
					new SqlOutParameter("p_out", OracleTypes.CURSOR, new TcsTdtttXMLIdMapper().new get_dm_kxtd_hdr()));
			compile();
		}
	}

	public void insert_tdtt_queue_in(TcsTdttQueueBean bean, MQQueueManager p_qmgr) throws Exception {
		String sqlUpdate = "call tcs_pck_tdtt_kbnn.prc_tdtt_insertInbox(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		try {
			log.info("begin insert DB");
			jdbcTemplate.setDataSource(dataSource);
			jdbcTemplate.update(sqlUpdate,
					new Object[] { bean.getSender_code(), bean.getSender_name(), bean.getReceiver_code(),
							bean.getReceiver_name(), bean.getTran_code(), bean.getMsg_id(), bean.getMsg_fefid(),
							bean.getId_link(), bean.getSend_date(), bean.getOrignal_code(), bean.getOrignal_name(),
							bean.getOrignal_date(), bean.getError_code(), bean.getError_desc(), bean.getStatus(),
							bean.getSts_verify(), bean.getData_blob(), bean.getData_blob_4(), bean.getErr_log(),
							bean.getNotes() });
			log.info("finish insert DB");
		} catch (BadSqlGrammarException ex) {
			log.error(" BadSqlGrammarException: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :" + bean.getTsn_code()
					+ " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (DataIntegrityViolationException ex) {
			log.error(" DataIntegrityViolationException: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :"
					+ bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (UncategorizedSQLException ex) {
			log.error(" UncategorizedSQLException: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :"
					+ bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (InvalidResultSetAccessException ex) {
			log.error(" InvalidResultSetAccessException: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :"
					+ bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			p_qmgr.backout();
			throw new Exception(ex.getMessage());
		} catch (DataAccessException ex) {
			log.error(" DataAccessException: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :" + bean.getTsn_code()
					+ " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			p_qmgr.backout();
			throw new Exception(ex.getMessage());
		} catch (Exception ex) {
			log.error(" ================LOI====INSERT===============");
			log.error(" Insert_tdtt_queue: " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :" + bean.getTsn_code()
					+ " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		}
	}

	public void update_tdtt_queue_in(TcsTdttQueueBean bean) throws Exception {
		try {
			if (bean.getFile_ky() != null) {
				String sqlUpdate = "call tcs_pck_tdtt_kbnn.prc_tcs_update_xmlout(?,?,?,?,?)";
				jdbcTemplate.setDataSource(dataSource);
				jdbcTemplate.update(sqlUpdate, new Object[] { bean.getId(), bean.getStatus(), bean.getSts_verify(),
						bean.getErr_log(), bean.getFile_ky()

				});
			} else {
				String sqlUpdate = "call tcs_pck_tdtt_kbnn.prc_tcs_update_xmlout_error(?,?,?,?)";
				jdbcTemplate.setDataSource(dataSource);
				jdbcTemplate.update(sqlUpdate,
						new Object[] { bean.getId(), bean.getStatus(), bean.getSts_verify(), bean.getErr_log()

						});
			}
		} catch (BadSqlGrammarException ex) {
			log.error(" Update_tdtt_queue_in BadSqlGrammarException:  " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :"
					+ bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
		} catch (DataIntegrityViolationException ex) {
			log.error(" Update_tdtt_queue_in Update_tdtt_queue_in DataIntegrityViolationException:  " + " Pkg_id :"
					+ bean.getPkg_id() + " Tsn_code :" + bean.getTsn_code() + " Parent_id :" + bean.getParent_id()
					+ " ex :" + ex.toString());
		} catch (UncategorizedSQLException ex) {
			log.error(" Update_tdtt_queue_in UncategorizedSQLException:  " + " Pkg_id :" + bean.getPkg_id()
					+ " Tsn_code :" + bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :"
					+ ex.toString());
		} catch (InvalidResultSetAccessException ex) {
			log.error(" Update_tdtt_queue_in InvalidResultSetAccessException:  " + " Pkg_id :" + bean.getPkg_id()
					+ " Tsn_code :" + bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :"
					+ ex.toString());
		} catch (DataAccessException ex) {
			log.error(" Update_tdtt_queue_in DataAccessException:  " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :"
					+ bean.getTsn_code() + " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
		} catch (Exception ex) {
			log.error(" ================LOI===UPDATE================");
			log.error(" Update_tdtt_queue_in:  " + " Pkg_id :" + bean.getPkg_id() + " Tsn_code :" + bean.getTsn_code()
					+ " Parent_id :" + bean.getParent_id() + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		}
	}

	private class getParamSP extends StoredProcedure {
		public static final String SQL = "TCS_PCK_TDTT_KBNN.prc_getParam";

		public getParamSP() throws Exception {
			setDataSource(dataSource);
			setSql(SQL);
			declareParameter(new SqlParameter("p_pkg_id", OracleTypes.VARCHAR));
			declareParameter(new SqlOutParameter("p_mail", OracleTypes.VARCHAR));
			declareParameter(new SqlOutParameter("p_ma_nh", OracleTypes.VARCHAR));
			declareParameter(new SqlOutParameter("p_cur", OracleTypes.CURSOR,
					new TcsTdtttXMLIdMapper().new SystemParamMapper()));

			compile();
		}
	}

	public Map getParamMail(String pkg_id) throws Exception {
		log.info("Begin get param job mail Method");
		Map map = new HashMap();
		try {
			getParamSP proc = new getParamSP();

			Map params = new HashMap();
			params.put("p_pkg_id", pkg_id);
			map = proc.execute(params);
		} catch (DataAccessException ex) {
			log.error("exception", ex);
			log.debug(ex.getMessage());
			throw new DAOException(ex.getMessage());
		} catch (Exception ex) {

			throw new Exception(ex.getMessage());
		}
		log.info("Finish execute_getDetailChungTuByKey job mail Method");
		return map;
	}

	public void insert_tac_nghiep(Long id, MQQueueManager p_qmgr) throws Exception {
		String sqlUpdate = "call tcs_pck_tdt.prc_tdtt_insert_inbox(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		try {
			jdbcTemplate.setDataSource(dataSource);
			jdbcTemplate.update(sqlUpdate, new Object[] { id });
		} catch (BadSqlGrammarException ex) {
			log.error(" BadSqlGrammarException: " + " Pkg_id :" + id + " Tsn_code :" + id + " Parent_id :" + id
					+ " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (DataIntegrityViolationException ex) {
			log.error(" DataIntegrityViolationException: " + " Pkg_id :" + id + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (UncategorizedSQLException ex) {
			log.error(" UncategorizedSQLException: " + " Pkg_id :" + id + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		} catch (InvalidResultSetAccessException ex) {
			log.error(" InvalidResultSetAccessException: " + " Pkg_id :" + id + " ex :" + ex.toString());
			p_qmgr.backout();
			throw new Exception(ex.getMessage());
		} catch (DataAccessException ex) {
			log.error(" DataAccessException: " + " Pkg_id :" + id + " ex :" + ex.toString());
			p_qmgr.backout();
			throw new Exception(ex.getMessage());
		} catch (Exception ex) {
			log.error(" ================LOI====INSERT===============");
			log.error(" Insert_tdtt_queue: " + " Pkg_id :" + id + " ex :" + ex.toString());
			throw new Exception(ex.getMessage());
		}
	}
}