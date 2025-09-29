import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { CrmApiService } from "../utils/crmApi";

interface DigitalSignature {
  id: number;
  serial: string;
  issuer: string;
  subject: string;
  cert: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState({
    fullname: "",
    mail: "",
    phone: "",
    address: "",
    note: "",
  });
  // Load user profile từ backend
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        if (!user?.username) return;
        // Gọi API với username chính xác từ phiên đăng nhập
        let data: any = null;
        const res: any = await CrmApiService.viewSysUser({
          username: user.username,
        });
        data = (res && (res.data || res)) || null;

        if (!mounted) return;
        setProfile(data);
        try {
          sessionStorage.setItem("userProfile", JSON.stringify(data || {}));
        } catch {}
        setForm({
          fullname: data?.fullname || "",
          mail: data?.mail || "",
          phone: data?.phone || "",
          address: data?.address || "",
          note: data?.note || "",
        });
      } catch (err: any) {
        if (!mounted) return;
        showError(err?.message || "Tải thông tin tài khoản thất bại");
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user?.username]);
  const [activeTab, setActiveTab] = useState("signatures"); // signatures, banks, customers

  // Form data for digital signature
  const [signatureForm, setSignatureForm] = useState({
    serial: "",
    issuer: "",
    subject: "",
    cert: "",
    validFrom: "",
    validTo: "",
  });

  // Form data for bank account
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    status: "active",
  });

  // Form data for customer
  const [customerForm, setCustomerForm] = useState({
    customerCode: "",
    customerName: "",
    address: "",
    systemType: "",
  });

  // Function to clear signature form
  const clearSignatureForm = () => {
    setSignatureForm({
      serial: "",
      issuer: "",
      subject: "",
      cert: "",
      validFrom: "",
      validTo: "",
    });
  };

  // Function to view signature details and fill form
  const handleViewSignature = (signature: DigitalSignature) => {
    // Get current date in dd/mm/yyyy format
    const today = new Date();
    const currentDate =
      today.getDate().toString().padStart(2, "0") +
      "/" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      today.getFullYear();

    setSignatureForm({
      serial: signature.serial,
      issuer: signature.issuer,
      subject: signature.subject,
      cert: signature.cert,
      validFrom: currentDate, // Tự động lấy ngày hôm nay
      validTo: signature.validTo,
    });
  };

  // Function to clear bank form
  const clearBankForm = () => {
    setBankForm({
      bankName: "",
      accountNumber: "",
      accountName: "",
      status: "active",
    });
  };

  // Function to clear customer form
  const clearCustomerForm = () => {
    setCustomerForm({
      customerCode: "",
      customerName: "",
      address: "",
      systemType: "",
    });
  };

  // Function to format date input (dd/mm/yyyy)
  const formatDateInput = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Apply formatting
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 4) {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(
        2,
        4
      )}/${numericValue.slice(4, 8)}`;
    } else {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(
        2,
        4
      )}/${numericValue.slice(4, 8)}`;
    }
  };

  // Handle date input change
  const handleDateChange = (field: "validFrom" | "validTo", value: string) => {
    const formattedValue = formatDateInput(value);
    setSignatureForm({ ...signatureForm, [field]: formattedValue });
  };

  // Sample data for MST user
  const [digitalSignatures] = useState<DigitalSignature[]>([
    {
      id: 1,
      serial: "540113505151C65B4D4609FC9C2F647A",
      issuer: "CN=HILO-CA SHA-256, O=T-VAN HILO, C=VN",
      subject:
        "OID.0.9.2342.19200300.100.1.1=MST:0109844160, CN=CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV, OU=CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV, O=CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV, L=44 đường Lê Quang Đạo - Phường Phú Đô - Quận Nam Từ Liêm - Hà Nội, S=Hà Nội, C=VN",
      cert: "MIIFVDCCBDygAwIBAgIQVAETUFFRxltNRgn8nC9kejANBgkqhkiG9w0BAQsFADA8MQsWCQYDVQQGEWJWTJETMBEGA1UECgwKVC1WQU4gSEIMTZEYMBYGA1UEAwwPSEIMTY1DQSBTSEEtMjU2MB4XDTIzMTAyMzE2MDczM10XDTI3MDEwNDA4MT",
      validFrom: "23/10/2023",
      validTo: "04/01/2027",
      isActive: true,
    },
  ]);

  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: 1,
      bankName: "Vietcombank - Chi nhánh TP.HCM",
      accountNumber: "0071002611909",
      accountName: "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV",
      isDefault: true,
    },
    {
      id: 2,
      bankName: "Techcombank - Chi nhánh Tân Bình",
      accountNumber: "19028309876543",
      accountName: "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV",
      isDefault: false,
    },
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: 1,
      customerCode: "KH001",
      customerName: "CÔNG TY XNK MINH KHAI",
      phone: "028-39876543",
      email: "contact@minhkhai.com.vn",
      address: "Quận 1, TP.HCM",
      isActive: true,
    },
    {
      id: 2,
      customerCode: "KH002",
      customerName: "CÔNG TY CP VẬN TẢI BIỂN ĐÔNG",
      phone: "028-38765432",
      email: "info@biendongtrans.com",
      address: "Quận 7, TP.HCM",
      isActive: true,
    },
  ]);

  // Get company data based on user type
  const getCompanyData = () => {
    // Ưu tiên dữ liệu từ backend profile nếu có
    if (profile) {
      return {
        companyCode: profile.username || user?.taxCode || "",
        companyName: profile.fullname || user?.companyName || "",
        phone: profile.phone || user?.phone || "",
        email: profile.mail || user?.email || "",
        address: profile.address || user?.address || "",
      };
    }

    if (user?.userType === "mst_custom" || user?.taxCode === "0304126484") {
      return {
        companyCode: "0109844160",
        companyName: "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ SPV",
        phone: "0916926829",
        email: "tuannt6829@gmail.com",
        address: "44 đường Lê Quang Đạo, Phường Tự Liêm, TP Hà Nội, Việt Nam",
      };
    }

    return {
      companyCode: user?.taxCode || "0109844160",
      companyName: user?.companyName || "CÔNG TY DEMO",
      phone: user?.phone || "1900 1286",
      email: user?.email || "demo@example.com",
      address: user?.address || "TP. Hồ Chí Minh",
    };
  };

  const companyData = getCompanyData();

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Profile summary (từ API) */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "12px 16px",
          marginBottom: "12px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <i
            className="fas fa-user-circle"
            style={{ fontSize: "26px", color: "#0d6efd" }}
          ></i>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "15px" }}>
              {loadingProfile
                ? "Đang tải..."
                : profile?.fullname || user?.fullName || "Tài khoản"}
            </div>
            <div style={{ color: "#6b7280", fontSize: "13px" }}>
              {profile?.username || user?.username || ""}
              {profile?.mail || user?.email
                ? ` • ${profile?.mail || user?.email}`
                : ""}
            </div>
          </div>
          {loadingProfile && (
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              <i className="fas fa-spinner fa-spin"></i> Đang tải thông tin
            </span>
          )}
        </div>

        {/* Tự động tải theo tài khoản đăng nhập */}
      </div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <i
          className="fas fa-info-circle"
          style={{
            color: "#007bff",
            fontSize: "24px",
            marginRight: "12px",
          }}
        ></i>
        <h1
          style={{
            margin: 0,
            color: "#333",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Cập Nhật Thông Tin Tài Khoản Doanh Nghiệp
        </h1>
      </div>

      {/* Group & quyền từ backend */}
      {profile && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "12px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          {/* Editable fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "10px 16px",
            }}
          >
            <label style={{ fontWeight: 700, color: "#374151" }}>
              Tên hiển thị
            </label>
            <input
              type="text"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
              }}
            />

            <label style={{ fontWeight: 700, color: "#374151" }}>Email</label>
            <input
              type="email"
              value={form.mail}
              onChange={(e) => setForm({ ...form, mail: e.target.value })}
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
              }}
            />

            <label style={{ fontWeight: 700, color: "#374151" }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
              }}
            />

            <label style={{ fontWeight: 700, color: "#374151" }}>Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
              }}
            />

            <label style={{ fontWeight: 700, color: "#374151" }}>Ghi chú</label>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 12,
            }}
          >
            <button
              onClick={async () => {
                try {
                  if (!user?.username) return;
                  setSaving(true);
                  await CrmApiService.updateSysUser({
                    id: (profile?.userId ?? profile?.id) || 0,
                    username: user.username,
                    groupId: profile?.groupId,
                    fullname: form.fullname,
                    mail: form.mail,
                    phone: form.phone,
                    address: form.address,
                    note: form.note,
                  });
                  // reload profile
                  const res: any = await CrmApiService.viewSysUser({
                    username: user.username,
                  });
                  const data = (res && (res.data || res)) || null;
                  setProfile(data);
                  showSuccess("Cập nhật thông tin tài khoản thành công");
                } catch (err: any) {
                  showError(err?.message || "Lưu thông tin thất bại");
                } finally {
                  setSaving(false);
                }
              }}
              style={{
                padding: "8px 12px",
                backgroundColor: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "#374151" }}>Nhóm:</span>
            <span>{profile.groupName || `ID ${profile.groupId ?? "-"}`}</span>
          </div>
          <div style={{ marginTop: "6px" }}>
            <div
              style={{ fontWeight: 700, color: "#374151", marginBottom: "4px" }}
            >
              Chức năng được phép (
              {Array.isArray(profile.allowedFunctions)
                ? profile.allowedFunctions.length
                : 0}
              ):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {Array.isArray(profile.allowedFunctions) &&
              profile.allowedFunctions.length > 0 ? (
                profile.allowedFunctions.map((f: any) => (
                  <span
                    key={`${f.funcId}-${f.funcIdCode}`}
                    style={{
                      background: "#eef2ff",
                      color: "#3730a3",
                      border: "1px solid #c7d2fe",
                      padding: "4px 8px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                    }}
                  >
                    {f.funcName || f.funcIdCode}
                  </span>
                ))
              ) : (
                <span style={{ color: "#6b7280", fontSize: "13px" }}>
                  Không có dữ liệu
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company Information Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            borderBottom: "2px solid #ddd",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, color: "#333", fontSize: "16px" }}>
            THÔNG TIN TÀI KHOẢN
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr 100px 1fr 100px 1fr",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <label
            style={{ fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}
          >
            Mã doanh nghiệp:
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="text"
            value={companyData.companyCode}
            readOnly
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f8f9fa",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "20px",
              fontSize: "14px",
              gridColumn: "span 4",
              alignItems: "center",
              paddingLeft: "40px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="radio"
                name="accountType"
                value="enterprise"
                defaultChecked
                style={{ accentColor: "#007bff" }}
              />
              DN KHAI PHÍ
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="radio"
                name="accountType"
                value="individual"
                style={{ accentColor: "#007bff" }}
              />
              CÁ NHÂN KHAI PHÍ
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="radio"
                name="accountType"
                value="agent"
                style={{ accentColor: "#007bff" }}
              />
              ĐẠI LÝ KHAI PHÍ
            </label>
          </div>

          <label
            style={{ fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}
          >
            Tên doanh nghiệp:
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="text"
            value={companyData.companyName}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              gridColumn: "span 5",
            }}
          />

          <label
            style={{ fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}
          >
            Số điện thoại:
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="text"
            value={companyData.phone}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />

          <label
            style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            Email:<span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="email"
            value={companyData.email}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              gridColumn: "span 3",
            }}
          />

          <label
            style={{ fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}
          >
            Địa chỉ:
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="text"
            value={companyData.address}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              gridColumn: "span 5",
            }}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #ddd",
          }}
        >
          <button
            onClick={() => setActiveTab("signatures")}
            style={{
              flex: 1,
              padding: "15px 20px",
              border: "none",
              backgroundColor:
                activeTab === "signatures" ? "#007bff" : "#f8f9fa",
              color: activeTab === "signatures" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              borderTopLeftRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fas fa-list"></i>
            Danh sách chữ ký số đã đăng ký
          </button>

          <button
            onClick={() => setActiveTab("banks")}
            style={{
              flex: 1,
              padding: "15px 20px",
              border: "none",
              backgroundColor: activeTab === "banks" ? "#007bff" : "#f8f9fa",
              color: activeTab === "banks" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fas fa-university"></i>
            Danh sách tài khoản ngân hàng thu hưởng
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            style={{
              flex: 1,
              padding: "15px 20px",
              border: "none",
              backgroundColor:
                activeTab === "customers" ? "#007bff" : "#f8f9fa",
              color: activeTab === "customers" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              borderTopRightRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fas fa-users"></i>
            Danh sách khách hàng
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: "20px" }}>
          {/* Digital Signatures Tab */}
          {activeTab === "signatures" && (
            <div>
              {/* Digital Signatures Table */}
              <div style={{ marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        STT
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "70px",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "200px",
                        }}
                      >
                        Serial
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          minWidth: "400px",
                        }}
                      >
                        Subject
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "110px",
                        }}
                      >
                        Ngày hiệu lực
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "110px",
                        }}
                      >
                        Ngày hết hạn
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        TT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalSignatures.map((signature, index) => (
                      <tr key={signature.id}>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <i
                              className="fas fa-edit"
                              style={{
                                color: "#007bff",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                              onClick={() => handleViewSignature(signature)}
                              title="Xem chi tiết"
                            ></i>
                            <i
                              className="fas fa-trash"
                              style={{
                                color: "#dc3545",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            ></i>
                          </div>
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontSize: "13px",
                            fontFamily: "monospace",
                          }}
                        >
                          {signature.serial}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontSize: "13px",
                            lineHeight: "1.4",
                          }}
                        >
                          {signature.subject}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          {signature.validFrom}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          {signature.validTo}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={signature.isActive}
                            readOnly
                            style={{
                              accentColor: "#28a745",
                              transform: "scale(1.1)",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ĐĂNG KÝ THÊM CHỮ KÝ SỐ Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  paddingLeft: "5px",
                }}
              >
                <i
                  className="fas fa-plus-circle"
                  style={{
                    color: "#007bff",
                    marginRight: "8px",
                    fontSize: "16px",
                  }}
                ></i>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  ĐĂNG KÝ THÊM CHỮ KÝ SỐ
                </span>
              </div>

              {/* Control buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "15px",
                  padding: "8px 12px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ accentColor: "#007bff" }}
                  />
                  <span style={{ fontWeight: "500" }}>Active chữ ký số</span>
                </label>

                <button
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Chọn chữ ký số mới
                </button>

                <button
                  onClick={clearSignatureForm}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <i className="fas fa-upload"></i>
                  Nhập lại
                </button>
              </div>

              {/* Form fields section */}
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "15px",
                  backgroundColor: "#fafafa",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "12px 15px",
                    alignItems: "center",
                  }}
                >
                  {/* Row 1: Serial */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Serial:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={signatureForm.serial}
                    onChange={(e) =>
                      setSignatureForm({
                        ...signatureForm,
                        serial: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 2: Issuer */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Issuer:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={signatureForm.issuer}
                    onChange={(e) =>
                      setSignatureForm({
                        ...signatureForm,
                        issuer: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 3: Subject (full width) */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Subject:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={signatureForm.subject}
                    onChange={(e) =>
                      setSignatureForm({
                        ...signatureForm,
                        subject: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                      resize: "vertical",
                    }}
                  />

                  {/* Row 4: Cert (full width) */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Cert:
                  </label>
                  <textarea
                    rows={3}
                    value={signatureForm.cert}
                    onChange={(e) =>
                      setSignatureForm({
                        ...signatureForm,
                        cert: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                      resize: "vertical",
                    }}
                  />

                  {/* Row 5: Ngày hiệu lực */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Ngày hiệu lực:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={signatureForm.validFrom}
                      onChange={(e) =>
                        handleDateChange("validFrom", e.target.value)
                      }
                      maxLength={10}
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                        fontSize: "13px",
                        width: "120px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          color: "#333",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ngày hết hạn:
                        <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={signatureForm.validTo}
                        onChange={(e) =>
                          handleDateChange("validTo", e.target.value)
                        }
                        maxLength={10}
                        style={{
                          padding: "6px 8px",
                          border: "1px solid #ddd",
                          borderRadius: "3px",
                          fontSize: "13px",
                          width: "120px",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons trong tab chữ ký số */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    paddingTop: "20px",
                  }}
                >
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: "90px",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fas fa-save" style={{ fontSize: "12px" }}></i>
                    Lưu lại
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: "90px",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="fas fa-times"
                      style={{ fontSize: "12px" }}
                    ></i>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === "banks" && (
            <div>
              {/* Bank Accounts Table */}
              <div style={{ marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        STT
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "70px",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          minWidth: "200px",
                        }}
                      >
                        Ngân hàng
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        Số tài khoản
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          minWidth: "200px",
                        }}
                      >
                        Chủ tài khoản
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "100px",
                        }}
                      >
                        Ngày tạo
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        TT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          border: "1px solid #ddd",
                          padding: "20px",
                          textAlign: "center",
                          color: "#007bff",
                          fontStyle: "italic",
                        }}
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ĐĂNG KÝ THÊM TÀI KHOẢN NGÂN HÀNG Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <i
                  className="fas fa-plus-circle"
                  style={{
                    color: "#28a745",
                    fontSize: "16px",
                  }}
                ></i>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  ĐĂNG KÝ THÊM TÀI KHOẢN NGÂN HÀNG
                </span>
              </div>

              {/* Form fields section */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr",
                    gap: "12px 15px",
                    alignItems: "center",
                  }}
                >
                  {/* Row 1: Ngân hàng */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Ngân hàng:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <select
                    value={bankForm.bankName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, bankName: e.target.value })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="vietcombank">Vietcombank</option>
                    <option value="techcombank">Techcombank</option>
                    <option value="bidv">BIDV</option>
                    <option value="agribank">Agribank</option>
                  </select>

                  {/* Row 2: Số tài khoản */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Số tài khoản:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountNumber}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountNumber: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 3: Tên chủ tài khoản */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Tên chủ tài khoản:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, accountName: e.target.value })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 4: Trạng thái */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                    }}
                  >
                    Trạng thái:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <select
                    value={bankForm.status}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, status: e.target.value })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="active">Sử dụng</option>
                    <option value="inactive">Khóa - chưa sử dụng</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={clearBankForm}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-redo"></i>
                    Nhập lại
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-save"></i>
                    Lưu tài khoản NH
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div>
              {/* Customers Table */}
              <div style={{ marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        STT
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "70px",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "150px",
                        }}
                      >
                        Mã khách hàng
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          minWidth: "200px",
                        }}
                      >
                        Tên khách hàng
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          width: "100px",
                        }}
                      >
                        Ngày tạo
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px 8px",
                          textAlign: "center",
                          minWidth: "200px",
                        }}
                      >
                        Xuất biên lai cho DN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          border: "1px solid #ddd",
                          padding: "20px",
                          textAlign: "center",
                          color: "#007bff",
                          fontStyle: "italic",
                        }}
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ĐĂNG KÝ THÊM KHÁCH HÀNG Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <i
                  className="fas fa-plus-circle"
                  style={{
                    color: "#28a745",
                    fontSize: "16px",
                  }}
                ></i>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  ĐĂNG KÝ THÊM KHÁCH HÀNG
                </span>
              </div>

              {/* Form fields section */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: "12px 15px",
                    alignItems: "center",
                  }}
                >
                  {/* Row 1: Mã khách hàng */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Mã khách hàng:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Mã doanh nghiệp"
                      value={customerForm.customerCode}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          customerCode: e.target.value,
                        })
                      }
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                        fontSize: "13px",
                        flex: 1,
                      }}
                    />
                    <button
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>

                  {/* Row 2: Tên khách hàng */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tên khách hàng:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={customerForm.customerName}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        customerName: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 3: Địa chỉ */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Địa chỉ:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={customerForm.address}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        address: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                    }}
                  />

                  {/* Row 4: Hệ thống xuất biên lai cho */}
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Hệ thống xuất biên lai cho:
                    <span style={{ color: "#dc3545", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <select
                    value={customerForm.systemType}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        systemType: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      fontSize: "13px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Cho đại lý</option>
                    <option value="enterprise">Cho doanh nghiệp</option>
                    <option value="individual">Cho cá nhân</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={clearCustomerForm}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-redo"></i>
                    Nhập lại
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fas fa-save"></i>
                    Lưu khách hàng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
