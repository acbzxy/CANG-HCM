# Hướng dẫn cấu hình Email

## Vấn đề: Email không được gửi

Để gửi email thành công, bạn cần cấu hình đúng thông tin email trong file `application.yml`.

## Cấu hình hiện tại

```yaml
# Email configuration
email:
  host: smtp.gmail.com
  port: 587
  username: your-email@gmail.com  # ⚠️ CẦN THAY ĐỔI
  password: your-app-password     # ⚠️ CẦN THAY ĐỔI
  from: your-email@gmail.com      # ⚠️ CẦN THAY ĐỔI
```

## Hướng dẫn cấu hình Gmail

### Bước 1: Tạo App Password cho Gmail

1. Vào [myaccount.google.com](https://myaccount.google.com)
2. Chọn **Security** → **2-Step Verification** (bật nếu chưa có)
3. Chọn **App passwords**
4. Tạo app password mới cho ứng dụng
5. Copy password (16 ký tự, dạng: xxxx xxxx xxxx xxxx)

### Bước 2: Cập nhật application.yml

```yaml
# Email configuration
email:
  host: smtp.gmail.com
  port: 587
  username: your-actual-email@gmail.com
  password: your-16-char-app-password
  from: your-actual-email@gmail.com
```

### Ví dụ thực tế:

```yaml
email:
  host: smtp.gmail.com
  port: 587
  username: mycompany@gmail.com
  password: abcd efgh ijkl mnop
  from: mycompany@gmail.com
```

## Cấu hình cho email server khác

### Outlook/Hotmail:
```yaml
email:
  host: smtp-mail.outlook.com
  port: 587
  username: your-email@outlook.com
  password: your-password
  from: your-email@outlook.com
```

### Yahoo:
```yaml
email:
  host: smtp.mail.yahoo.com
  port: 587
  username: your-email@yahoo.com
  password: your-app-password
  from: your-email@yahoo.com
```

## Kiểm tra logs

Sau khi cấu hình, chạy API và kiểm tra logs:

```
📧 Cấu hình email - Host: smtp.gmail.com, Port: 587, Username: your-email@gmail.com, Password: [SET]
🚀 Bắt đầu gửi email với PDF attachment. To: [user@example.com], Subject: Biên lai thanh toán - BL123, File: bien_lai_BL123.pdf
📤 Đang gửi email...
✅ Gửi email THÀNH CÔNG đến: [user@example.com]
```

## Troubleshooting

### Lỗi "Could not convert socket to TLS":
```
javax.mail.MessagingException: Could not convert socket to TLS
```
**Giải pháp:**
- API đã được cập nhật để tự động thử SSL fallback
- Nếu STARTTLS (port 587) thất bại, sẽ tự động thử SSL (port 465)
- Kiểm tra logs để xem có thông báo "🔄 Thử fallback với SSL connection..." không

### Lỗi "Authentication failed":
- Kiểm tra username/password
- Đảm bảo đã bật 2-Step Verification
- Sử dụng App Password thay vì password thường

### Lỗi "Connection refused":
- Kiểm tra host và port
- Kiểm tra firewall/network
- Thử port khác: 465 (SSL) hoặc 587 (STARTTLS)

### Các cấu hình khác nhau để thử:

#### Gmail với STARTTLS (port 587):
```yaml
email:
  host: smtp.gmail.com
  port: 587
  username: your-email@gmail.com
  password: your-app-password
  from: your-email@gmail.com
```

#### Gmail với SSL (port 465):
```yaml
email:
  host: smtp.gmail.com
  port: 465
  username: your-email@gmail.com
  password: your-app-password
  from: your-email@gmail.com
```

## Test cấu hình

API sẽ tự động test cấu hình email khi gửi biên lai. Kiểm tra logs để xem kết quả test.

### Logs thành công:
```
📧 Cấu hình email - Host: smtp.gmail.com, Port: 587, Username: your-email@gmail.com, Password: [SET]
🚀 Bắt đầu gửi email với PDF attachment...
📤 Đang gửi email...
✅ Gửi email THÀNH CÔNG đến: [user@example.com]
```

### Logs với fallback:
```
❌ Lỗi MessagingException khi gửi email với PDF attachment: Could not convert socket to TLS
🔄 Thử fallback với SSL connection...
✅ Gửi email THÀNH CÔNG với SSL connection đến: [user@example.com]
```
