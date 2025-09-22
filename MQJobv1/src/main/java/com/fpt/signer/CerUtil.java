package com.fpt.signer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.X509Certificate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CerUtil {
	private static Logger logger = LoggerFactory.getLogger(CerUtil.class);
	private String cerFilePath;
	private boolean valid;

	public boolean isValid() {
		return valid;
	}

	public String getCerFilePath() {
		return cerFilePath;
	}

	public void setCerFilePath(String cerFilePath) {
		this.cerFilePath = cerFilePath;
	}

	public CerUtil(String cerFilePath) {
		this.cerFilePath = cerFilePath;
	}

	public PublicKey getPublicKey() {
		File file = new File(cerFilePath);
		try {
			FileInputStream in = new FileInputStream(file);

			CertificateFactory cf = CertificateFactory.getInstance("X509");
			X509Certificate cer = (X509Certificate) cf.generateCertificate(in);
			cer.checkValidity();
			valid = true;
			return cer.getPublicKey();

		} catch (CertificateExpiredException e) {
			logger.error("exception", e);
			valid = false;
			return null;

		} catch (CertificateNotYetValidException e) {
			logger.error("exception", e);
			valid = false;
			return null;
		} catch (CertificateException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			valid = false;
			return null;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			valid = false;
			return null;
		}
	}

}
