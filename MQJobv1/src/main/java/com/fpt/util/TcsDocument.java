package com.fpt.util;

import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;

import com.utils.Util;

public class TcsDocument {

	public static Document stringToDom(String xmlSource) throws Exception {
		DocumentBuilderFactory factory = Util.getDocumentFactory();
		DocumentBuilder builder = factory.newDocumentBuilder();
		return builder.parse(new InputSource(new StringReader(xmlSource)));
	}

}
