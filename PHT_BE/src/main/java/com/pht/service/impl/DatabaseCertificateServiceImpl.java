package com.pht.service.impl;

import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pht.entity.ChukySo;
import com.pht.repository.ChukySoRepository;
import com.pht.service.DatabaseCertificateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseCertificateServiceImpl implements DatabaseCertificateService {
    
    private final ChukySoRepository chukySoRepository;
    
    @Override
    public List<ChukySo> getActiveCertificates() {
        log.info("Lấy danh sách chữ ký số đang hoạt động từ database");
        return chukySoRepository.findActiveCertificates();
    }
    
    @Override
    public ChukySo findBySerialNumber(String serialNumber) {
        log.info("Tìm chữ ký số với serial number: {}", serialNumber);
        return chukySoRepository.findBySerialNumber(serialNumber).orElse(null);
    }
    
    @Override
    public ChukySo findByThumbprint(String thumbprint) {
        log.info("Tìm chữ ký số với thumbprint: {}", thumbprint);
        return chukySoRepository.findByThumbprint(thumbprint).orElse(null);
    }
    
    @Override
    @Transactional
    public String signXmlWithDatabaseCertificate(String xmlContent, String serialNumber) {
        try {
            log.info("Bắt đầu ký XML với chữ ký số từ database, serial number: {}", serialNumber);
            
            // Tìm chữ ký số trong database
            ChukySo chukySo = findBySerialNumber(serialNumber);
            if (chukySo == null) {
                throw new RuntimeException("Không tìm thấy chữ ký số với serial number: " + serialNumber);
            }
            
            if (!Boolean.TRUE.equals(chukySo.getIsActive())) {
                throw new RuntimeException("Chữ ký số đã bị vô hiệu hóa");
            }
            
            log.info("Tìm thấy chữ ký số trong database");
            
            // Parse certificate và private key từ database
            X509Certificate certificate = parseCertificateFromDatabase(chukySo.getCertificateData());
            PrivateKey privateKey = parsePrivateKeyFromDatabase(chukySo.getPrivateKey(), chukySo.getPassword());
            
            // Sử dụng thông tin thuật toán từ database
            String hashAlgorithm = getHashAlgorithmFromDatabase(chukySo);
            String signatureAlgorithm = getSignatureAlgorithmFromDatabase(chukySo);
            
            // Ký XML với certificate từ database
            return signXmlWithRealCertificate(xmlContent, privateKey, certificate, chukySo, hashAlgorithm, signatureAlgorithm);
            
        } catch (Exception e) {
            log.error("Lỗi khi ký XML với chữ ký số từ database: ", e);
            throw new RuntimeException("Lỗi khi ký XML: " + e.getMessage(), e);
        }
    }
    
    /**
     * Parse certificate từ database
     */
    private X509Certificate parseCertificateFromDatabase(String certificateData) throws Exception {
        try {
            // Data trong database đã được clean (không có header/footer)
            byte[] certBytes = Base64.getDecoder().decode(certificateData);
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            return (X509Certificate) certFactory.generateCertificate(new ByteArrayInputStream(certBytes));
            
        } catch (Exception e) {
            throw new RuntimeException("Không thể parse certificate từ database: " + e.getMessage());
        }
    }
    
    /**
     * Parse private key từ database
     */
    private PrivateKey parsePrivateKeyFromDatabase(String privateKeyData, String password) throws Exception {
        try {
            // Data trong database đã được clean (không có header/footer)
            byte[] keyBytes = Base64.getDecoder().decode(privateKeyData);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePrivate(keySpec);
            
        } catch (Exception e) {
            throw new RuntimeException("Không thể parse private key từ database: " + e.getMessage());
        }
    }
    
    /**
     * Lấy thuật toán hash từ database
     */
    private String getHashAlgorithmFromDatabase(ChukySo chukySo) {
        String hashAlg = chukySo.getHashAlgorithm();
        if (hashAlg != null && !hashAlg.trim().isEmpty()) {
            // Convert từ format database sang XML URI
            return convertHashAlgorithmToXmlUri(hashAlg);
        }
        
        // Fallback: xác định từ certificate
        try {
            X509Certificate certificate = parseCertificateFromDatabase(chukySo.getCertificateData());
            return determineHashAlgorithm(certificate);
        } catch (Exception e) {
            log.warn("Không thể parse certificate để xác định hash algorithm, sử dụng mặc định");
            return "http://www.w3.org/2001/04/xmlenc#sha256";
        }
    }
    
    /**
     * Lấy thuật toán ký từ database
     */
    private String getSignatureAlgorithmFromDatabase(ChukySo chukySo) {
        String sigAlg = chukySo.getSignatureAlgorithm();
        if (sigAlg != null && !sigAlg.trim().isEmpty()) {
            // Convert từ format database sang XML URI
            return convertSignatureAlgorithmToXmlUri(sigAlg);
        }
        
        // Fallback: xác định từ certificate
        try {
            X509Certificate certificate = parseCertificateFromDatabase(chukySo.getCertificateData());
            return determineSignatureAlgorithm(certificate);
        } catch (Exception e) {
            log.warn("Không thể parse certificate để xác định signature algorithm, sử dụng mặc định");
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
        }
    }
    
    /**
     * Convert hash algorithm từ database format sang XML URI
     */
    private String convertHashAlgorithmToXmlUri(String hashAlgorithm) {
        String hash = hashAlgorithm.toUpperCase();
        
        if (hash.contains("SHA256") || hash.contains("SHA-256")) {
            return "http://www.w3.org/2001/04/xmlenc#sha256";
        } else if (hash.contains("SHA1") || hash.contains("SHA-1")) {
            return "http://www.w3.org/2000/09/xmldsig#sha1";
        } else if (hash.contains("SHA384") || hash.contains("SHA-384")) {
            return "http://www.w3.org/2001/04/xmlenc#sha384";
        } else if (hash.contains("SHA512") || hash.contains("SHA-512")) {
            return "http://www.w3.org/2001/04/xmlenc#sha512";
        }
        
        return "http://www.w3.org/2001/04/xmlenc#sha256";
    }
    
    /**
     * Convert signature algorithm từ database format sang XML URI
     */
    private String convertSignatureAlgorithmToXmlUri(String signatureAlgorithm) {
        String sig = signatureAlgorithm.toUpperCase();
        
        if (sig.contains("SHA256") || sig.contains("SHA-256")) {
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
        } else if (sig.contains("SHA1") || sig.contains("SHA-1")) {
            return "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
        } else if (sig.contains("SHA384") || sig.contains("SHA-384")) {
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha384";
        } else if (sig.contains("SHA512") || sig.contains("SHA-512")) {
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512";
        }
        
        return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    }
    
    /**
     * Xác định thuật toán hash dựa trên certificate (fallback)
     */
    private String determineHashAlgorithm(X509Certificate certificate) {
        try {
            String sigAlg = certificate.getSigAlgName();
            
            if (sigAlg != null) {
                if (sigAlg.contains("SHA256") || sigAlg.contains("SHA-256")) {
                    return "http://www.w3.org/2001/04/xmlenc#sha256";
                } else if (sigAlg.contains("SHA1") || sigAlg.contains("SHA-1")) {
                    return "http://www.w3.org/2000/09/xmldsig#sha1";
                } else if (sigAlg.contains("SHA384") || sigAlg.contains("SHA-384")) {
                    return "http://www.w3.org/2001/04/xmlenc#sha384";
                } else if (sigAlg.contains("SHA512") || sigAlg.contains("SHA-512")) {
                    return "http://www.w3.org/2001/04/xmlenc#sha512";
                }
            }
            
            return "http://www.w3.org/2001/04/xmlenc#sha256";
            
        } catch (Exception e) {
            log.error("Lỗi khi xác định thuật toán hash: ", e);
            return "http://www.w3.org/2001/04/xmlenc#sha256";
        }
    }
    
    /**
     * Xác định thuật toán ký dựa trên certificate
     */
    private String determineSignatureAlgorithm(X509Certificate certificate) {
        try {
            String sigAlg = certificate.getSigAlgName();
            
            if (sigAlg != null) {
                if (sigAlg.contains("SHA256") || sigAlg.contains("SHA-256")) {
                    return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
                } else if (sigAlg.contains("SHA1") || sigAlg.contains("SHA-1")) {
                    return "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
                } else if (sigAlg.contains("SHA384") || sigAlg.contains("SHA-384")) {
                    return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha384";
                } else if (sigAlg.contains("SHA512") || sigAlg.contains("SHA-512")) {
                    return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512";
                }
            }
            
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
            
        } catch (Exception e) {
            log.error("Lỗi khi xác định thuật toán ký: ", e);
            return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
        }
    }
    
    /**
     * Ký XML với certificate thực từ database
     */
    private String signXmlWithRealCertificate(String xmlContent, PrivateKey privateKey, X509Certificate certificate, 
                                            ChukySo chukySo, String hashAlgorithm, String signatureAlgorithm) {
        try {
            log.info("Ký XML với certificate từ database");
            
            // Parse XML
            javax.xml.parsers.DocumentBuilderFactory factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            javax.xml.parsers.DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document doc = builder.parse(new ByteArrayInputStream(xmlContent.getBytes("UTF-8")));
            
            // Tạo signature element với thuật toán phù hợp
            org.w3c.dom.Element signatureElement = createSignatureElement(doc, certificate, privateKey, chukySo, hashAlgorithm, signatureAlgorithm);
            
            // Thêm signature vào XML
            doc.getDocumentElement().appendChild(signatureElement);
            
            // Convert Document to String
            javax.xml.transform.TransformerFactory transformerFactory = javax.xml.transform.TransformerFactory.newInstance();
            javax.xml.transform.Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.INDENT, "yes");
            
            StringWriter writer = new StringWriter();
            transformer.transform(new javax.xml.transform.dom.DOMSource(doc), new javax.xml.transform.stream.StreamResult(writer));
            
            String signedXml = writer.toString();
            log.info("Ký XML thành công với certificate từ database");
            
            return signedXml;
            
        } catch (Exception e) {
            log.error("Lỗi khi ký XML với certificate từ database: ", e);
            throw new RuntimeException("Lỗi khi ký XML với certificate từ database: " + e.getMessage(), e);
        }
    }
    
    /**
     * Tạo signature element với certificate từ database
     */
    private org.w3c.dom.Element createSignatureElement(org.w3c.dom.Document doc, X509Certificate certificate, 
                                                      PrivateKey privateKey, ChukySo chukySo, 
                                                      String hashAlgorithm, String signatureAlgorithm) {
        org.w3c.dom.Element signature = doc.createElementNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
        
        // SignedInfo
        org.w3c.dom.Element signedInfo = doc.createElement("SignedInfo");
        
        org.w3c.dom.Element canonicalizationMethod = doc.createElement("CanonicalizationMethod");
        canonicalizationMethod.setAttribute("Algorithm", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315");
        signedInfo.appendChild(canonicalizationMethod);
        
        org.w3c.dom.Element signatureMethod = doc.createElement("SignatureMethod");
        signatureMethod.setAttribute("Algorithm", signatureAlgorithm);
        signedInfo.appendChild(signatureMethod);
        
        org.w3c.dom.Element reference = doc.createElement("Reference");
        reference.setAttribute("URI", "");
        
        org.w3c.dom.Element transforms = doc.createElement("Transforms");
        org.w3c.dom.Element transform = doc.createElement("Transform");
        transform.setAttribute("Algorithm", "http://www.w3.org/2000/09/xmldsig#enveloped-signature");
        transforms.appendChild(transform);
        reference.appendChild(transforms);
        
        org.w3c.dom.Element digestMethod = doc.createElement("DigestMethod");
        digestMethod.setAttribute("Algorithm", hashAlgorithm);
        reference.appendChild(digestMethod);
        
        org.w3c.dom.Element digestValue = doc.createElement("DigestValue");
        // Tính toán digest thực tế với thuật toán phù hợp
        String actualDigest = calculateDigest(doc.getDocumentElement(), hashAlgorithm);
        digestValue.setTextContent(actualDigest);
        reference.appendChild(digestValue);
        
        signedInfo.appendChild(reference);
        signature.appendChild(signedInfo);
        
        // SignatureValue (tính toán thực tế)
        org.w3c.dom.Element signatureValue = doc.createElement("SignatureValue");
        String actualSignature = calculateSignature(signedInfo, privateKey, signatureAlgorithm);
        signatureValue.setTextContent(actualSignature);
        signature.appendChild(signatureValue);
        
        // KeyInfo
        org.w3c.dom.Element keyInfo = doc.createElement("KeyInfo");
        org.w3c.dom.Element x509Data = doc.createElement("X509Data");
        
        // Thêm X509Certificate (public key)
        org.w3c.dom.Element x509Certificate = doc.createElement("X509Certificate");
        try {
            x509Certificate.setTextContent(java.util.Base64.getEncoder().encodeToString(certificate.getEncoded()));
        } catch (java.security.cert.CertificateEncodingException e) {
            log.error("Lỗi khi encode certificate: ", e);
            throw new RuntimeException("Không thể encode certificate: " + e.getMessage(), e);
        }
        x509Data.appendChild(x509Certificate);
        
        // Thêm X509IssuerSerial
        org.w3c.dom.Element x509IssuerSerial = doc.createElement("X509IssuerSerial");
        
        org.w3c.dom.Element x509IssuerName = doc.createElement("X509IssuerName");
        x509IssuerName.setTextContent(certificate.getIssuerX500Principal().getName());
        x509IssuerSerial.appendChild(x509IssuerName);
        
        org.w3c.dom.Element x509SerialNumber = doc.createElement("X509SerialNumber");
        x509SerialNumber.setTextContent(certificate.getSerialNumber().toString());
        x509IssuerSerial.appendChild(x509SerialNumber);
        
        x509Data.appendChild(x509IssuerSerial);
        keyInfo.appendChild(x509Data);
        signature.appendChild(keyInfo);
        
        return signature;
    }
    
    /**
     * Tính toán signature thực tế cho SignedInfo
     */
    private String calculateSignature(org.w3c.dom.Element signedInfo, PrivateKey privateKey, String signatureAlgorithm) {
        try {
            // Chuyển SignedInfo thành string
            javax.xml.transform.TransformerFactory transformerFactory = javax.xml.transform.TransformerFactory.newInstance();
            javax.xml.transform.Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.ENCODING, "UTF-8");
            
            StringWriter writer = new StringWriter();
            transformer.transform(new javax.xml.transform.dom.DOMSource(signedInfo), new javax.xml.transform.stream.StreamResult(writer));
            String signedInfoString = writer.toString();
            
            // Xác định thuật toán signature từ URI
            String algorithm;
            if (signatureAlgorithm.contains("rsa-sha256")) {
                algorithm = "SHA256withRSA";
            } else if (signatureAlgorithm.contains("rsa-sha1")) {
                algorithm = "SHA1withRSA";
            } else if (signatureAlgorithm.contains("rsa-sha384")) {
                algorithm = "SHA384withRSA";
            } else if (signatureAlgorithm.contains("rsa-sha512")) {
                algorithm = "SHA512withRSA";
            } else {
                algorithm = "SHA256withRSA"; // Mặc định
            }
            
            // Tạo signature bằng private key
            java.security.Signature signature = java.security.Signature.getInstance(algorithm);
            signature.initSign(privateKey);
            signature.update(signedInfoString.getBytes("UTF-8"));
            byte[] signatureBytes = signature.sign();
            
            // Chuyển thành Base64
            return Base64.getEncoder().encodeToString(signatureBytes);
            
        } catch (Exception e) {
            log.error("Lỗi khi tính signature với thuật toán {}: ", signatureAlgorithm, e);
            throw new RuntimeException("Không thể tính signature: " + e.getMessage(), e);
        }
    }
    
    /**
     * Tính toán digest cho XML element với thuật toán phù hợp
     */
    private String calculateDigest(org.w3c.dom.Element element, String hashAlgorithm) {
        try {
            // Chuyển element thành string
            javax.xml.transform.TransformerFactory transformerFactory = javax.xml.transform.TransformerFactory.newInstance();
            javax.xml.transform.Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.ENCODING, "UTF-8");
            
            StringWriter writer = new StringWriter();
            transformer.transform(new javax.xml.transform.dom.DOMSource(element), new javax.xml.transform.stream.StreamResult(writer));
            String xmlString = writer.toString();
            
            // Xác định thuật toán hash từ URI
            String algorithm;
            if (hashAlgorithm.contains("sha256")) {
                algorithm = "SHA-256";
            } else if (hashAlgorithm.contains("sha1")) {
                algorithm = "SHA-1";
            } else if (hashAlgorithm.contains("sha384")) {
                algorithm = "SHA-384";
            } else if (hashAlgorithm.contains("sha512")) {
                algorithm = "SHA-512";
            } else {
                algorithm = "SHA-256"; // Mặc định
            }
            
            // Tính hash
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance(algorithm);
            byte[] hash = digest.digest(xmlString.getBytes("UTF-8"));
            
            // Chuyển thành Base64
            return Base64.getEncoder().encodeToString(hash);
            
        } catch (Exception e) {
            log.error("Lỗi khi tính digest với thuật toán {}: ", hashAlgorithm, e);
            throw new RuntimeException("Không thể tính digest: " + e.getMessage(), e);
        }
    }
}
