# 🐳 Docker Deployment Guide - PHT Frontend

## **📋 Yêu cầu hệ thống**
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM trống
- 5GB disk space

## **🚀 Cách deploy**

### **1. Deploy đơn giản (chỉ frontend)**
```bash
# Build và chạy
docker build -t pht-frontend .
docker run -d -p 3000:80 --name pht-frontend pht-frontend

# Hoặc sử dụng script
chmod +x deploy.sh
./deploy.sh
```

### **2. Deploy đầy đủ (frontend + backend + database)**
```bash
# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

## **🔧 Cấu hình**

### **Environment Variables**
```bash
# Frontend
NODE_ENV=production

# Backend
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=jdbc:mysql://db:3306/pht_db
DATABASE_USERNAME=pht_user
DATABASE_PASSWORD=pht_password

# Database
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=pht_db
MYSQL_USER=pht_user
MYSQL_PASSWORD=pht_password
```

### **Ports**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: localhost:3306

## **📊 Monitoring**

### **Kiểm tra status**
```bash
# Xem containers đang chạy
docker ps

# Xem logs
docker logs pht-frontend
docker-compose logs -f

# Kiểm tra resource usage
docker stats
```

### **Troubleshooting**
```bash
# Restart service
docker restart pht-frontend

# Rebuild image
docker build --no-cache -t pht-frontend .

# Xóa tất cả containers
docker-compose down -v
docker system prune -a
```

## **🔒 Security**

### **Production deployment**
1. Thay đổi passwords mặc định
2. Sử dụng HTTPS
3. Cấu hình firewall
4. Backup database thường xuyên

### **SSL/HTTPS**
```bash
# Thêm SSL certificate vào nginx
# Copy cert files vào container
docker cp ssl.crt pht-frontend:/etc/nginx/ssl/
docker cp ssl.key pht-frontend:/etc/nginx/ssl/
```

## **📈 Scaling**

### **Load balancing**
```yaml
# docker-compose.yml
services:
  frontend:
    deploy:
      replicas: 3
    ports:
      - "3000-3002:80"
```

### **Database backup**
```bash
# Backup
docker exec db mysqldump -u root -p pht_db > backup.sql

# Restore
docker exec -i db mysql -u root -p pht_db < backup.sql
```

## **🛠️ Development**

### **Hot reload cho development**
```bash
# Chạy với volume mount
docker run -d \
  -p 3000:80 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  pht-frontend:dev
```

### **Debug mode**
```bash
# Chạy với debug port
docker run -d \
  -p 3000:80 \
  -p 9229:9229 \
  -e NODE_ENV=development \
  pht-frontend:dev
```
