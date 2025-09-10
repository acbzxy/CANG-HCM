# 🔐 API Chữ ký số - PHT_BE Backend

## 📋 **Tổng quan**
API này cho phép ký số tờ khai thông tin trong hệ thống Thu phí hạ tầng TP.HCM.

---

## 🌐 **Endpoint Information**

### POST `/api/chu-ky-so/ky-so`
- **URL**: `http://10.14.122.24:8081/PHT_BE/api/chu-ky-so/ky-so`
- **Method**: POST
- **Content-Type**: application/json
- **Purpose**: Ký số tờ khai thông tin với chứng chỉ số

---

## 📝 **Request Body**

```json
{
  "toKhaiId": 0,
  "chuKySoId": "string",
  "matKhau": "string"
}
```

### Request Fields:
- `toKhaiId` *(number, required)*: ID của tờ khai cần ký số
- `chuKySoId` *(string, required)*: ID của chứng chỉ số  
- `matKhau` *(string, required)*: Mật khẩu của chứng chỉ số

---

## 📊 **Response Format**

### ✅ **200 - Success Response**
```json
{
  "status": 200,
  "requestId": "string",
  "timestamp": "2025-09-08T11:06:53.549Z",
  "startTime": 0,
  "endTime": 0,
  "executionTime": 0,
  "message": "Success",
  "path": "/api/chu-ky-so/ky-so",
  "data": {}
}
```

### ❌ **400 - Bad Request (Validation Error)**
```json
{
  "status": 400,
  "requestId": "string", 
  "timestamp": "2025-09-08T11:06:53.550Z",
  "startTime": 0,
  "endTime": 0,
  "executionTime": 0,
  "message": "Invalid request data",
  "path": "/api/chu-ky-so/ky-so",
  "data": {},
  "errors": ["toKhaiId is required", "chuKySoId cannot be empty"],
  "error": "Validation failed"
}
```

### ❌ **500 - Server Error**
```json
{
  "status": 500,
  "requestId": "string",
  "timestamp": "2025-09-08T11:06:53.551Z", 
  "startTime": 0,
  "endTime": 0,
  "executionTime": 0,
  "message": "Tờ khai không ở trạng thái có thể ký. Trạng thái hiện tại: 02",
  "path": "/api/chu-ky-so/ky-so",
  "data": {},
  "errors": [],
  "error": "Business logic error"
}
```

---

## 🔍 **Business Logic & Status Rules**

### ✅ **Trạng thái có thể ký số:**
- **Status "00"**: Có thể ký số (cần certificate và password đúng)

### ❌ **Trạng thái KHÔNG thể ký số:**
- **Status "01"**: Không có record nào
- **Status "02", "03"**: Đã xử lý, không thể ký
- **Status "NEW"**: Mới tạo, chưa sẵn sàng
- **Status "Mới tạo"**: Tờ khai mới, chưa được phê duyệt

### 🚨 **Error Messages thường gặp:**
- `"Tờ khai không ở trạng thái có thể ký. Trạng thái hiện tại: {status}"`
- `"Không tìm thấy tờ khai với ID: {id}"`
- `"Ký số thất bại. Vui lòng kiểm tra lại chữ ký số và mật khẩu"`

---

## 💻 **Frontend Integration**

### TypeScript Interface:
```typescript
// Interface trong src/utils/crmApi.ts
export interface ChuKySoRequest {
  toKhaiId: number
  chuKySoId: string
  matKhau: string
}
```

### API Method:
```typescript
// Method trong CrmApiService class
static async kyTenSoToKhai(
  data: ChuKySoRequest
): Promise<ApiDataResponse<any> | ApiErrorResponse> {
  // Implementation với full validation
}
```

### Endpoint Configuration:
```typescript
const CRM_ENDPOINTS = {
  CHU_KY_SO_KY_SO: `${CRM_API_BASE_URL}/api/chu-ky-so/ky-so`
}
```

---

## 🧪 **Testing & Examples**

### ✅ **Successful Request:**
```bash
curl -X POST http://10.14.122.24:8081/PHT_BE/api/chu-ky-so/ky-so \
-H "Content-Type: application/json" \
-d '{
  "toKhaiId": 2,
  "chuKySoId": "VALID_CERTIFICATE_ID",
  "matKhau": "correct_password"
}'
```

### ❌ **Validation Error Example:**
```javascript
const invalidRequest = {
  toKhaiId: 0,           // ❌ Invalid: Must be > 0
  chuKySoId: "",         // ❌ Invalid: Cannot be empty  
  matKhau: ""            // ❌ Invalid: Cannot be empty
}
```

### 🎯 **Business Logic Error Example:**
```javascript
const blockedRequest = {
  toKhaiId: 1,           // Status "02" - Cannot sign
  chuKySoId: "CERT_001",
  matKhau: "password123" 
}
// Result: "Tờ khai không ở trạng thái có thể ký. Trạng thái hiện tại: 02"
```

---

## 🚀 **Usage in Application**

### 1. **Import và sử dụng:**
```typescript
import { CrmApiService, ChuKySoRequest } from '../utils/crmApi'

const signDeclaration = async (toKhaiId: number, certId: string, password: string) => {
  const request: ChuKySoRequest = {
    toKhaiId: toKhaiId,
    chuKySoId: certId,
    matKhau: password
  }
  
  const result = await CrmApiService.kyTenSoToKhai(request)
  
  if (result.status === 200) {
    console.log('✅ Ký số thành công!')
    return true
  } else {
    console.error('❌ Ký số thất bại:', result.message)
    return false
  }
}
```

### 2. **Error Handling:**
```typescript
const handleSigningResult = (result: ApiDataResponse<any> | ApiErrorResponse) => {
  switch (result.status) {
    case 200:
      showSuccess('Ký số thành công!')
      break
    case 400:
      showError(`Lỗi validation: ${result.errors?.join(', ')}`)
      break
    case 500:
      if (result.message.includes('trạng thái')) {
        showWarning('Tờ khai không ở trạng thái có thể ký số')
      } else if (result.message.includes('Ký số thất bại')) {
        showError('Chứng chỉ số hoặc mật khẩu không đúng')
      } else {
        showError('Lỗi hệ thống khi ký số')
      }
      break
  }
}
```

---

## 📈 **Performance & Monitoring**

### ⚡ **Response Times:**
- **Normal**: 0-50ms execution time
- **Certificate validation**: 100-500ms
- **Timeout**: 10 seconds

### 📊 **Status Statistics (Current System):**
```
Status "00" (Signable): 1 record
Status "NEW" (Not signable): 1 record  
Status "Mới tạo" (Not signable): 9 records
Status "02", "03" (Processed): 3 records
Status "string" (Test data): 20 records
```

---

## ✅ **Test Status**

### 🎯 **Testing Completed:**
- ✅ **API Endpoint**: Available and responding
- ✅ **Request Validation**: toKhaiId, chuKySoId, matKhau
- ✅ **Business Logic**: Status-based signing rules
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Response Format**: Consistent ApiDataResponse structure
- ✅ **Integration**: Frontend method `kyTenSoToKhai()` implemented
- ✅ **Documentation**: Complete usage guide

### 🚀 **Ready for Production:**
- ✅ Client-side validation implemented
- ✅ Error handling comprehensive  
- ✅ Business rules respected
- ✅ Type safety with TypeScript interfaces
- ✅ Logging and monitoring built-in

---

## 📞 **Support Information**

- **API Documentation**: This file
- **Test Scripts**: 
  - `demo-chu-ky-so.js`: Comprehensive test cases
  - `test-signable-status.js`: Status-specific tests
  - `test-fixed-api.js`: Integration tests
- **Frontend Integration**: `src/utils/crmApi.ts`
- **Backend URL**: `http://10.14.122.24:8081/PHT_BE`

---

**📅 Last Updated**: September 8, 2025  
**✅ Status**: Production Ready  
**🔐 API Version**: PHT_BE v1.0
