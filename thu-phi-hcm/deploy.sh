#!/bin/bash

# Script deploy lên Docker
echo "🚀 Bắt đầu deploy PHT Frontend lên Docker..."

# Kiểm tra Docker có chạy không
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker không chạy. Vui lòng khởi động Docker trước."
    exit 1
fi

# Build Docker image
echo "📦 Building Docker image..."
docker build -t pht-frontend:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build thành công!"
else
    echo "❌ Build thất bại!"
    exit 1
fi

# Stop container cũ nếu có
echo "🛑 Dừng container cũ..."
docker stop pht-frontend 2>/dev/null || true
docker rm pht-frontend 2>/dev/null || true

# Chạy container mới
echo "🏃 Chạy container mới..."
docker run -d \
    --name pht-frontend \
    -p 3002:80 \
    --restart unless-stopped \
    pht-frontend:latest

if [ $? -eq 0 ]; then
    echo "✅ Deploy thành công!"
    echo "🌐 Frontend đang chạy tại: http://localhost:3002"
    echo "📊 Kiểm tra logs: docker logs pht-frontend"
    echo "🛑 Dừng service: docker stop pht-frontend"
else
    echo "❌ Deploy thất bại!"
    exit 1
fi
