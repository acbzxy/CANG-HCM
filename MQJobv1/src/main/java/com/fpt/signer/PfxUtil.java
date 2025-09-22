package com.fpt.signer;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.util.Enumeration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class PfxUtil {
	private static Logger logger = LoggerFactory.getLogger(PfxUtil.class);
	private PublicKey pubKey;
	private RSAPrivateKey privateKey;
	private boolean status = false;
	private String message = "";

	public String getMessage() {
		return message;
	}

	private static String provider = "BC";
	private static String type = "PKCS12";

	public boolean isStatus() {
		return status;
	}

	public PfxUtil(String pfxFilePath, String privatekeyPass) {
		try {

			FileInputStream file = new FileInputStream(pfxFilePath);
			KeyStore key = KeyStore.getInstance(type);
			key.load(file, privatekeyPass.toCharArray());
			file.close();
			Enumeration e = key.aliases();
			if (e == null || !e.hasMoreElements()) {
				throw new Exception("No entries found in the key store");
			}
			String alias = "";
			boolean isHasPrivateKey = false;
			while (e.hasMoreElements()) {
				alias = (String) e.nextElement();
				if (key.isKeyEntry(alias)) {
					isHasPrivateKey = true;
					break;
				}
			}

			if (isHasPrivateKey) {
				privateKey = (RSAPrivateKey) key.getKey(alias, privatekeyPass.toCharArray());
				Certificate cert = key.getCertificate(alias);
				pubKey = cert.getPublicKey();
				this.status = true;
				this.message = "";
			}

		} catch (FileNotFoundException e) {
			status = false;
			message = "File khong ton tai";
			logger.error("exception", e);
		} catch (KeyStoreException e) {
			status = false;
			message = "Loi khi getInstance cua provider";
			logger.error("exception", e);
		} catch (NoSuchProviderException e) {
			// TODO Auto-generated catch block
			status = false;
			message = "Khong ton tai provider";
			logger.error("exception", e);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			status = false;
			message = "Khong ton tai thuat toan ma hoa";
			logger.error("exception", e);
		} catch (CertificateException e) {
			// TODO Auto-generated catch block
			status = false;
			message = "Loi lien quan Certification";
			logger.error("exception", e);
		} catch (IOException e) {
			status = false;
			message = "Loi lien quan den IO";
			logger.error("exception", e);
		} catch (UnrecoverableKeyException e) {
			// TODO Auto-generated catch block
			status = false;
			message = "Khong lay duoc private key";
			logger.error("exception", e);
		} catch (Exception e) {
			status = false;
			message = e.getMessage();
			logger.error("exception", e);
		}
	}

	public PublicKey getPubKey() {
		return pubKey;
	}

	public RSAPrivateKey getPrivateKey() {
		return privateKey;

	}

}
