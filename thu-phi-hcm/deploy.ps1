# PowerShell script để deploy lên Docker
Write-Host "🚀 Bắt đầu deploy PHT Frontend lên Docker..." -ForegroundColor Green

# Kiểm tra Docker có chạy không
try {
    docker info | Out-Null
    Write-Host "✅ Docker đang chạy" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker không chạy. Vui lòng khởi động Docker Desktop trước." -ForegroundColor Red
    exit 1
}

# Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t pht-frontend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build thành công!" -ForegroundColor Green
} else {
    Write-Host "❌ Build thất bại!" -ForegroundColor Red
    exit 1
}

# Stop container cũ nếu có
Write-Host "🛑 Dừng container cũ..." -ForegroundColor Yellow
docker stop pht-frontend 2>$null
docker rm pht-frontend 2>$null

# Chạy container mới
Write-Host "🏃 Chạy container mới..." -ForegroundColor Yellow
docker run -d `
    --name pht-frontend `
    -p 3002:80 `
    --restart unless-stopped `
    pht-frontend:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy thành công!" -ForegroundColor Green
    Write-Host "🌐 Frontend đang chạy tại: http://localhost:3002" -ForegroundColor Cyan
    Write-Host "📊 Kiểm tra logs: docker logs pht-frontend" -ForegroundColor Cyan
    Write-Host "🛑 Dừng service: docker stop pht-frontend" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deploy thất bại!" -ForegroundColor Red
    exit 1
}
