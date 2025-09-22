package com.fpt.signer;

import java.io.FileInputStream;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.fpt.util.Constant;
import com.fpt.util.TcsDocument;
import com.utils.Util;

public class Signer {
	private static Logger logger = LoggerFactory.getLogger(Signer.class);

	public String signData(String strXML) throws Exception {
		try {
//			Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
			String signStr = strXML.substring(strXML.indexOf("<HEADER>"), strXML.indexOf("<SECURITY>"));
			byte[] datas = signStr.getBytes("UTF-8");
			MessageDigest sha1 = MessageDigest.getInstance("SHA-256");
			byte[] digestBytes = sha1.digest(datas);
			String url = Constant.KBNN_PRIVATE_KEY_PATH;
			PfxUtil pfx = new PfxUtil(url, Constant.KBNN_PRIVATE_KEY_PWD);
			Cipher cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.ENCRYPT_MODE, pfx.getPrivateKey());
			byte[] digitalSignature = cipher.doFinal(digestBytes);
			String sign = new String(Base64Coder.encode(digitalSignature));
			strXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DATA>" + signStr + "<SECURITY><SIGNATURE>" + sign
					+ "</SIGNATURE></SECURITY></DATA>";
			return strXML;
		} catch (Exception e) {
			throw e;
		}
	}

	public String getSingValue(String xml) {
		String sign = "";
		int markHEADER = xml.indexOf("<HEADER>");
		int markSECURITY = xml.indexOf("<SECURITY>");
		int markSIGNATURE = xml.indexOf("<SIGNATURE>");
		int markEndSIGNATURE = xml.indexOf("</SIGNATURE>");
		String hdrdata = xml.substring(markHEADER, markSECURITY);
		// Security.addProvider(new
		// org.bouncycastle.jce.provider.BouncyCastleProvider());

		String url = Constant.KBNN_PRIVATE_KEY_PATH;
		PfxUtil pfx = new PfxUtil(url, Constant.KBNN_PRIVATE_KEY_PWD);
		PKIFileBased pki = new PKIFileBased(pfx.getPrivateKey());
		url = Constant.FILE_PATH_SIGN_HSM_CER;
		CerUtil cer = new CerUtil(url);
		pki.setPubkey(cer.getPublicKey());
		pki.setSignStr(hdrdata);
		System.out.println("hdrdata:" + hdrdata);
		Crypt crypt = new Crypt(pki);
		sign = crypt.signature();
		xml = xml.substring(0, markSIGNATURE + 11) + sign + xml.substring(markEndSIGNATURE);

		System.out.println("Chu ky so sinh ra :" + sign);
		return xml;
	}

	public boolean verify(String xml, String urlCer) throws Exception {
		try {
			String hdrdata = null;
			int tagSec = xml.indexOf("<SECURITY>");
			if (tagSec < 0) {
				System.out.println("Khong tim thay chu ky so tai the: /DATA/SECURITY");
				return false;
			} else {
				hdrdata = xml.substring(xml.indexOf("<HEADER>"), xml.indexOf("<SECURITY>") - 3);
			}

			// get signvalue
			Document doc = TcsDocument.stringToDom(xml);
			XPath xPath = XPathFactory.newInstance().newXPath();
			String verifyStr = ((String) xPath.evaluate("/DATA/SECURITY/SIGNATURE", doc, XPathConstants.STRING))
					.replaceAll(" ", "");
			if (verifyStr == null || verifyStr.length() < 1) {
				System.out.println("Khong tim thay chu ky so tai the: /DATA/SECURITY/SIGNATURE");
				return false;
			}

			// get publicKey
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			X509Certificate x509Certificate = (X509Certificate) cf.generateCertificate(new FileInputStream(urlCer));
			PublicKey publicKey = x509Certificate.getPublicKey();

			// decryptDigest
			Cipher cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.DECRYPT_MODE, publicKey);
			byte[] signs = Base64.getDecoder().decode(verifyStr);
			byte[] decryptDigest = cipher.doFinal(signs);
			System.out.println(Arrays.toString(decryptDigest));

			// digestBytes
			byte[] datas = hdrdata.getBytes("UTF-8");
			MessageDigest sha1 = MessageDigest.getInstance("SHA-256");
			byte[] digestBytes = sha1.digest(datas);
			System.out.println(Arrays.toString(digestBytes));

			boolean verifies = Arrays.equals(digestBytes, decryptDigest);
			System.out.println(verifies);
			return verifies;
		} catch (Exception e) {
			logger.error("exception", e);
			return false;
		}
	}

	public void verify_test() {
		try {
			DocumentBuilderFactory dbf = Util.getDocumentFactory();
			dbf.setNamespaceAware(true);
			DocumentBuilder documentBuilder = dbf.newDocumentBuilder();
			Document doc = documentBuilder.parse(new FileInputStream("c:/khobac.xml"));

			// get sign
			NodeList nodeList = doc.getElementsByTagName("SIGNATURE");
			String sign = nodeList.item(0).getFirstChild().getNodeValue();
			System.out.println(sign);

			// get publicKey
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			X509Certificate x509Certificate = (X509Certificate) cf
					.generateCertificate(new FileInputStream("c:/KBNN.cer"));
			PublicKey publicKey = x509Certificate.getPublicKey();

			// decryptDigest
			Cipher cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.DECRYPT_MODE, publicKey);
			byte[] signs = Base64.getDecoder().decode(sign);
			byte[] decryptDigest = cipher.doFinal(signs);
			System.out.println(Arrays.toString(decryptDigest));

			// digestBytes
			String data = "<HEADER><VERSION>1.0</VERSION><SENDER_CODE>TCS_KBA</SENDER_CODE><SENDER_NAME>He thong Thu NSNN cua Kho bac Nha nuoc</SENDER_NAME><RECEIVER_CODE>TCS_MB</RECEIVER_CODE><RECEIVER_NAME>Ngan hang MB</RECEIVER_NAME><TRAN_CODE>199</TRAN_CODE><MSG_ID>19900000000000092764</MSG_ID><MSG_REFID>19900000000000092764</MSG_REFID><SEND_DATE>01-06-2017 08:51:44</SEND_DATE><ORIGINAL_CODE>TCS_KBA</ORIGINAL_CODE><ORIGINAL_NAME>Kho bac Nha nuoc</ORIGINAL_NAME><ORIGINAL_DATE>01-06-2017 08:51:44</ORIGINAL_DATE><ERROR_CODE/><ERROR_DESC/><SPARE1/><SPARE2/><SPARE3/></HEADER><BODY><MT_ID>17701199T0000377</MT_ID><SEND_BANK>01701014</SEND_BANK><RECEIVE_BANK>01311033</RECEIVE_BANK><CREATED_DATE>01-06-2017 08:51:15</CREATED_DATE><CREATOR>HIENNT42</CREATOR><MANAGER>PHUONGNTM07</MANAGER><VERIFIED_DATE>01-06-2017 08:51:44</VERIFIED_DATE><F20>17701199T0000377</F20><F21/><F79>Test CKS 3</F79></BODY>";
			byte[] datas = data.getBytes("UTF-8");
			MessageDigest sha1 = MessageDigest.getInstance("SHA-256");
			byte[] digestBytes = sha1.digest(datas);
			System.out.println(Arrays.toString(digestBytes));

			boolean verifies = Arrays.equals(digestBytes, decryptDigest);
			System.out.println(verifies);
		} catch (Exception e) {
			logger.error("exception", e);
		}
	}
}
