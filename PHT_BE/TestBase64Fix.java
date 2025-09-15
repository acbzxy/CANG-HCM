import java.util.Base64;

public class TestBase64Fix {
    
    public static void main(String[] args) {
        // Test case: base64 with underscore (illegal character)
        String invalidBase64 = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKB";
        
        System.out.println("Original invalid base64: " + invalidBase64);
        
        // Apply our cleaning logic
        String cleaned = cleanBase64Data(invalidBase64);
        System.out.println("Cleaned base64: " + cleaned);
        
        try {
            byte[] decoded = Base64.getDecoder().decode(cleaned);
            System.out.println("Successfully decoded " + decoded.length + " bytes");
        } catch (Exception e) {
            System.out.println("Failed to decode: " + e.getMessage());
        }
    }
    
    private static String cleanBase64Data(String base64Data) {
        if (base64Data == null || base64Data.trim().isEmpty()) {
            return base64Data;
        }
        
        // Loại bỏ whitespace và newlines
        String cleaned = base64Data.replaceAll("\\s+", "");
        
        // Thay thế các ký tự không hợp lệ trong base64
        // Underscore (_) thường được sử dụng trong URL-safe base64 nhưng không hợp lệ trong standard base64
        cleaned = cleaned.replace("_", "/");
        
        // Thêm padding nếu cần thiết
        int remainder = cleaned.length() % 4;
        if (remainder > 0) {
            cleaned += "=".repeat(4 - remainder);
        }
        
        return cleaned;
    }
}
