package com.fpt.signer;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.interfaces.RSAPrivateKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PKIFileBased implements Command {
	private static Logger logger = LoggerFactory.getLogger(PKIFileBased.class);
	private String encodeStr;
	private RSAPrivateKey privatekey;
	private PublicKey pubkey;
	private String signStr;
	private String verifyStr;
	private String decodeStr;

	public PKIFileBased(RSAPrivateKey privatekey) {
		super();
		this.privatekey = privatekey;
	}

	public PKIFileBased(RSAPrivateKey privatekey, PublicKey pubkey) {
		super();
		this.privatekey = privatekey;
		this.pubkey = pubkey;
	}

	public String getVerifyStr() {
		return verifyStr;
	}

	public void setVerifyStr(String verifyStr) {
		this.verifyStr = verifyStr;
	}

	public String getDecodeStr() {
		return decodeStr;
	}

	public void setDecodeStr(String decodeStr) {
		this.decodeStr = decodeStr;
	}

	public boolean checkValidCert() {
		// TODO Auto-generated method stub
		return false;
	}

	public String Descrypt() {
		// TODO Auto-generated method stub
		return null;
	}

	public String Encrypt() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getEncodeStr() {
		return encodeStr;
	}

	public RSAPrivateKey getPrivatekey() {
		return privatekey;
	}

	public PublicKey getPubkey() {
		return pubkey;
	}

	public String getSignStr() {
		return signStr;
	}

	public void setEncodeStr(String encodeStr) {
		this.encodeStr = encodeStr;
	}

	public void setPubkey(PublicKey pubkey) {
		this.pubkey = pubkey;
	}

	public void setSignStr(String signStr) {
		this.signStr = signStr;
	}

	public String signature() {
		Signature sign;
		byte[] result;
		try {
			/* sign = Signature.getInstance("SHA1WithRSAEncryption", "BC"); */
			sign = Signature.getInstance("SHA1WithRSA");
			sign.initSign(privatekey);
			sign.update(signStr.getBytes("UTF-8"));
			result = sign.sign();
			return new String(Base64Coder.encode(result));
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return null;
		} /*
			 * catch (NoSuchProviderException e) { // TODO Auto-generated catch block
			 * logger.error("exception", e); return null; }
			 */ catch (InvalidKeyException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return null;
		} catch (SignatureException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return null;
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return null;
		}
	}

	public boolean verify() {
		Signature sign;
		try {
			sign = Signature.getInstance("SHA1WithRSA");
			// sign = Signature.getInstance("SHA1WithRSAEncryption", "BC");
			sign.initVerify(pubkey);

			byte buf[] = signStr.getBytes("UTF-8");
			sign.update(buf, 0, buf.length);
			byte[] signature = Base64Coder.decode(verifyStr);

			if (sign.verify(signature))
				return true;
			else
				return false;

		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return false;
		} /*
			 * catch (NoSuchProviderException e) { // TODO Auto-generated catch block
			 * logger.error("exception", e); return false; }
			 */ catch (InvalidKeyException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return false;
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return false;
		} catch (SignatureException e) {
			// TODO Auto-generated catch block
			logger.error("exception", e);
			return false;
		} catch (Exception e) {
			logger.error("exception", e);
			return false;
		}
	}
}
