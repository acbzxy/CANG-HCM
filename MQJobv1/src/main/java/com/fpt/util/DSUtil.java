package com.fpt.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.security.MessageDigest;
import java.util.Base64;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.EntityResolver;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.utils.Util;

public class DSUtil {
	private static Logger logger = LoggerFactory.getLogger(DSUtil.class);
	private static MessageDigest sha256;
	static {
		try {
			sha256 = MessageDigest.getInstance("SHA-256");
			
		} catch (Exception ex) {
			logger.error("exception", ex);
		}
	}
	public static String digest(Document doc) throws Exception {
		NodeList nodeList = doc.getElementsByTagName("Body");
		if (nodeList.getLength() == 0)
			nodeList = doc.getElementsByTagName("BODY");
		Source source = new DOMSource(nodeList.item(0));
		StringWriter sw = new StringWriter();
		Result result = new StreamResult(sw);
		Transformer transformer = Util.getTransformerFactory().newTransformer();
		transformer.setOutputProperty("omit-xml-declaration", "yes");
		transformer.transform(source, result);
		byte[] hash = sha256.digest(sw.toString().getBytes("UTF-8"));
		String retval = Base64.getEncoder().encodeToString(hash);
		return retval;
	}

	public static String doc2str(Document doc) throws Exception {
		Source source = new DOMSource(doc);
		StringWriter writer = new StringWriter();
		Result result = new StreamResult(writer);
		Transformer transformer = Util.getTransformerFactory().newTransformer();
		transformer.transform(source, result);
		return writer.toString();
	}

	public static Document str2doc(String xml) throws Exception {
		DocumentBuilderFactory dbf = Util.getDocumentFactory();
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new InputSource(new StringReader(xml)));
		return doc;
	}

	public static void doc2file(Document doc, String file_name) throws Exception {
		Source source = new DOMSource(doc);
		File file = new File(file_name);
		Result result = new StreamResult(file);
		Transformer transformer = Util.getTransformerFactory().newTransformer();
		transformer.transform(source, result);
	}
	public static Document file2doc(String file_name) throws Exception {
		DocumentBuilderFactory dbf = Util.getDocumentFactory();
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new File(file_name));
		return doc;
	}

	public static byte[] read_file(String file_name) throws Exception {
		FileInputStream fis = null;
		try {
			File file = new File(file_name);
			fis = new FileInputStream(file);
			byte[] bytes = new byte[(int) file.length()];
			fis.read(bytes);
			return bytes;
		} catch (Exception e) {
			throw e;
		} finally {
			if (fis != null)
				fis.close();
		}
	}
	public static Document readXml(InputStream is) throws SAXException, IOException, ParserConfigurationException {
		DocumentBuilderFactory dbf = Util.getDocumentFactory();

		dbf.setValidating(false);
		dbf.setIgnoringComments(false);
		dbf.setIgnoringElementContentWhitespace(true);
		dbf.setNamespaceAware(true);
		DocumentBuilder db = null;
		db = dbf.newDocumentBuilder();
		db.setEntityResolver(new NullResolver());
		return db.parse(is);
	}
}
class NullResolver implements EntityResolver {
	public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException {
		return new InputSource(new StringReader(""));
	}
}