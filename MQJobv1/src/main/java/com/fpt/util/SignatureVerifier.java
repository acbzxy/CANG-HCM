package com.fpt.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Base64;
import java.util.Scanner;

import javax.crypto.Cipher;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

import com.signer.BoundedBufferedReader;

public class SignatureVerifier {
	private static Logger logger = LoggerFactory.getLogger(SignatureVerifier.class);
	public static boolean verify(String xml, String urlCer) throws Exception {
		try {
			xml = trimxml(xml).replaceAll(">\\s*<", "><");
			System.out.println(xml);
			String hdrdata = null;
			int tagSec = xml.indexOf("<SECURITY>");
			if (tagSec < 0) {
				System.out.println("Khong tim thay chu ky so tai the: /DATA/SECURITY");
				return false;
			} else {
				hdrdata = xml.substring(xml.indexOf("<HEADER>"), xml.indexOf("</BODY>") + 7);
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

			/*
			 * Writer writer = null; try { writer = new BufferedWriter(new
			 * OutputStreamWriter(new
			 * FileOutputStream("D:\\hdrData"+System.currentTimeMillis()+".txt"), "utf-8"));
			 * writer.write(hdrdata); } catch (Exception e) { logger.error("exception", e); } finally
			 * { try {writer.close();} catch (Exception ex) {} } try { writer = new
			 * BufferedWriter(new OutputStreamWriter(new
			 * FileOutputStream("D:\\verifyStr"+System.currentTimeMillis()+".txt"),
			 * "utf-8")); writer.write(verifyStr); } catch (Exception e) {
			 * logger.error("exception", e); } finally { try {writer.close();} catch (Exception ex)
			 * {} } try { writer = new BufferedWriter(new OutputStreamWriter(new
			 * FileOutputStream("D:\\info"+System.currentTimeMillis()+".txt"), "utf-8"));
			 * writer.write(urlCer+"\n"+Arrays.toString(decryptDigest)+"\n"+Arrays.toString(
			 * digestBytes)+"\n"+verifies); } catch (Exception e) { logger.error("exception", e); }
			 * finally { try {writer.close();} catch (Exception ex) {} }
			 */

			return verifies;
		} catch (Exception e) {
			logger.error("exception", e);
			/*
			 * Writer writer = null; try { writer = new BufferedWriter(new
			 * OutputStreamWriter(new
			 * FileOutputStream("D:\\Error"+System.currentTimeMillis()+".txt"), "utf-8"));
			 * writer.write(e.getMessage()); } catch (Exception ex) { logger.error("exception", ex);
			 * } finally { try {writer.close();} catch (Exception ex) {} }
			 */
			return false;
		}
	}

	public static String trimxml(String input) {
		BufferedReader reader = new BufferedReader(new StringReader(input));
		StringBuffer result = new StringBuffer();
		try {
			String line;
			BoundedBufferedReader breader = new BoundedBufferedReader(reader);
			while ((line = breader.readLine()) != null)
				result.append(line.trim());
			return result.toString();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static void main(String[] args) throws Exception {
//		String strFile = "C:\\\\TCS\\\\HDB\\\\kbnn\\\\20220427\\\\103_TTSP_SHA2.xml";
//		String strFile = "C:\\\\TCS\\\\HDB\\\\kbnn\\\\20220427\\\\195_TCS_SHA2.xml";
//		String strFile = "C:\\TCS\\HDB\\kbnn\\20220427\\202206_195_TCS_SHA2.xml";
//		String strFile = "C:\\TCS\\HDB\\kbnn\\20220427\\202206_103_TTSP_SHA2.xml";
		String strFile = "C:\\TCS\\HDB\\kbnn\\20220427\\OCB_071.xml";

		String cerFile = "C:\\TCS\\HDB\\kbnn\\20220427\\TTSP_KBA.cer";

		String msg = readFile(strFile);
		System.out.println(verify(msg, cerFile));

	}

	private static String readFile(String url) {
		try {
			Scanner scanner = new Scanner(new File(url), "UTF-8");
			String text = scanner.useDelimiter("\\A").next();
			scanner.close();
			return text;
		} catch (Exception e) {
			logger.error("exception", e);
			return null;
		}
	}
}
