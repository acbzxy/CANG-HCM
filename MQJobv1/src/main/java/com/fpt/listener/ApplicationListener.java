package com.fpt.listener;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fpt.entity.TcsThamSo;
import com.fpt.respository.TcsSystemParamRepository;
import com.fpt.util.Constant;
import com.utils.AESEncryptionUtil;

import jakarta.annotation.PostConstruct;

@Component
public class ApplicationListener {
	private static final Logger logger = LoggerFactory.getLogger(ApplicationListener.class);
	@Value("${application.key.encrypt}")
	private String encryptKey;
	@Autowired
	private TcsSystemParamRepository systemParamDao;

	@Autowired
	private DataSource dataSource;
	
	@PostConstruct
	public void init() {
		logger.info("Init application context kbnnjob - begin");
		try {
			try (Connection conn = dataSource.getConnection();
					Statement stmt = conn.createStatement();
					ResultSet rs = stmt.executeQuery("SELECT SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') FROM DUAL")) {
				if (rs.next()) {
					logger.info("Current Schema: " + rs.getString(1));
				}

			} catch (Exception e) {
				logger.error("alter schema error",e);
			}
			Constant.TCB_ENCRYPT_KEY = encryptKey;
			AESEncryptionUtil aes = new AESEncryptionUtil(Constant.TCB_ENCRYPT_KEY);
			initSystemParam(aes);
		} catch (Exception ex) {
			logger.error("Error loading parameter", ex);
		}
		logger.info("End application context - begin");
	}

	private void initSystemParam(AESEncryptionUtil aes) throws Exception {
		List<TcsThamSo> lst = this.systemParamDao.reads();
		if (lst != null && !lst.isEmpty()) {
			for (TcsThamSo bean : lst) {
				switch (bean.getMaTs()) {
				case "KBNN_PRIVATE_KEY_PATH" -> {
					Constant.KBNN_PRIVATE_KEY_PATH = bean.getMacDinh();
					logger.info("KBNN_PRIVATE_KEY_PATH " + Constant.KBNN_PRIVATE_KEY_PATH);
				}
				case "KBNN_PRIVATE_KEY_PWD" -> {
					try {
						Constant.KBNN_PRIVATE_KEY_PWD = aes.decrypt(bean.getMacDinh());
					} catch (Exception e) {
						Constant.KBNN_PRIVATE_KEY_PWD = bean.getMacDinh();
						logger.error("exception", e);
					}
				}
				case "KBNN_PUBLIC_KEY_PATH" -> {
					Constant.FILE_PATH_SIGN_HSM_CER = bean.getMacDinh();
					logger.info("KBNN_PUBLIC_KEY_PATH " + Constant.FILE_PATH_SIGN_HSM_CER);
				}
				case "KBNN_CERT_VERIFY_PATH" -> {
					Constant.PATH_OF_CERTKB_FILE = bean.getMacDinh();
					logger.info("KBNN_CERT_VERIFY_PATH " + Constant.PATH_OF_CERTKB_FILE);
				}
				case "KBNN_MQ_USER_ID" -> {
					Constant.KBNN_MQ_USER_ID = bean.getMacDinh();
					logger.info("KBNN_MQ_USER_ID " + Constant.KBNN_MQ_USER_ID);
				}
				case "KBNN_MQ_USER_PWD" -> {
					if (StringUtils.trim(bean.getMacDinh()) != null) {
						try {
							Constant.KBNN_MQ_USER_PWD = aes.decrypt(bean.getMacDinh());
						} catch (Exception e) {
							Constant.KBNN_MQ_USER_PWD = bean.getMacDinh();
							logger.error("exception", e);
						}
					}
				}
				}
			}
		} else {
			throw new Exception("System parameters don't exist");
		}
	}
//	public static void main(String[] args) {
//		try {
//			AESEncryptionUtil aes = new AESEncryptionUtil("dGVzdGtleTEyMzQ1Ng==");
//			System.out.println(aes.encrypt("1"));
//			System.out.println(aes.decrypt("jsDnn9ZgEU+y7SGn7eAuJNHbzxb9cvZIYwz2fv0="));
//		}catch (Exception e) {
//			// TODO Auto-generated catch block
//			logger.error("exception", e);
//		}
//	}
}
