import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { CrmApiService } from "../utils/crmApi";

// Import background image
const backgroundImage = "/tphcm-bkg.jpg";
const cangvuLogo = "/cangvu-hcm-logo.png";

const CangVuLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captcha: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    companyCode: "",
    email: "",
  });
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<
    Record<string, string>
  >({});

  // Register modal states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    address: "",
    email: "",
    phone: "",
    mobile: "",
    notes: "",
    digitalSignature: false,
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {}
  );
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Auto-fill admin credentials on double-click
  const handleUsernameDblClick = () => {
    setFormData((prev) => ({
      ...prev,
      username: "admin",
      password: "123456",
      captcha: captchaCode,
    }));
    showSuccess("Cán bộ cảng vụ credentials auto-filled!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tài khoản cán bộ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    if (!formData.captcha.trim()) {
      newErrors.captcha = "Vui lòng nhập mã xác thực";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        username: formData.username,
        password: formData.password,
        captcha: formData.captcha,
        rememberMe: formData.rememberMe,
      });

      showSuccess("Đăng nhập thành công!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đăng nhập thất bại";
      showError(errorMessage);
    }
  };

  const [captchaCode, setCaptchaCode] = useState("UJDZF");

  const refreshCaptcha = () => {
    // Generate random captcha (for demo purposes)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newCode = "";
    for (let i = 0; i < 5; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(newCode);
    setFormData((prev) => ({ ...prev, captcha: "" }));
    showSuccess("Mã xác thực đã được làm mới!");
  };

  // Forgot password functions
  const handleForgotPasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (forgotPasswordErrors[name]) {
      setForgotPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForgotPasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!forgotPasswordData.companyCode.trim()) {
      newErrors.companyCode = "Vui lòng nhập mã cán bộ";
    }

    if (!forgotPasswordData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    setForgotPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForgotPasswordForm()) {
      return;
    }

    // Mock API call
    showSuccess("Yêu cầu khôi phục mật khẩu đã được gửi đến email của bạn!");
    setShowForgotPasswordModal(false);
    setForgotPasswordData({ companyCode: "", email: "" });
    setForgotPasswordErrors({});
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordData({ companyCode: "", email: "" });
    setForgotPasswordErrors({});
  };

  // Register functions
  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};

    if (!registerData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!registerData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!registerData.companyName.trim()) {
      newErrors.companyName = "Vui lòng nhập tên cán bộ";
    }

    if (!registerData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!registerData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!registerData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setIsRegisterLoading(true);

    try {
      // Cán bộ Cảng vụ = groupId 3
      const payload = {
        username: registerData.username,
        password: registerData.password,
        groupId: 3,
        fullname: registerData.companyName,
        mail: registerData.email,
        phone: registerData.phone,
        address: registerData.address,
        note: registerData.notes || "",
      };

      // Call CRM API
      const response = await CrmApiService.registerSysUser(payload);

      // Success
      showSuccess(
        `Đăng ký tài khoản thành công! Tài khoản ${response.data.username} đã được tạo.`
      );
      closeRegisterModal();
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      showError(errorMessage);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterData({
      username: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      address: "",
      email: "",
      phone: "",
      mobile: "",
      notes: "",
      digitalSignature: false,
    });
    setRegisterErrors({});
  };

  return (
    <div>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }

          /* Custom scrollbar for Login Page only */
          ::-webkit-scrollbar {
            width: 5px !important;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
          }

          ::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 5px !important;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
          }

          ::-webkit-scrollbar-button {
            display: none !important;
          }
          
          .card-hover:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2) !important;
          }
          
          .unified-container:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 50px 120px rgba(0, 0, 0, 0.25) !important;
          }
          
          @media (max-width: 1200px) {
            .split-layout {
              minHeight: calc(100vh - 130px) !important;
            }
            .unified-main-container > div {
              flex-direction: column !important;
              gap: 25px !important;
              align-items: center !important;
            }
            .login-container {
              max-width: 500px !important;
              width: 100% !important;
              flex: none !important;
            }
            .info-cards-container {
              max-width: 800px !important;
              min-width: auto !important;
              width: 100% !important;
              flex: none !important;
            }
            .cards-stack {
              gap: 20px !important;
            }
          }
          
          @media (max-width: 768px) {
            .split-layout {
              padding: 20px 15px 70px !important;
              minHeight: calc(100vh - 120px) !important;
            }
            .unified-main-container {
              padding: 20px !important;
              margin: 0 10px !important;
            }
            .unified-main-container > div {
              gap: 20px !important;
            }
            .header-section h1 {
              fontSize: 1.8rem !important;
            }
            .header-section p {
              fontSize: 0.9rem !important;
            }
          }
        `}
      </style>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0066b3 0%, #004d87 40%, #003366 100%)",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Modern Background Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "3%",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))",
            backdropFilter: "blur(10px)",
            zIndex: 0,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "65%",
            right: "5%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
            backdropFilter: "blur(15px)",
            zIndex: 0,
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "12%",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background:
              "linear-gradient(45deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))",
            backdropFilter: "blur(8px)",
            zIndex: 0,
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
          }}
        ></div>

        <div
          className="content-login"
          style={{ height: "100vh", position: "relative", zIndex: 1 }}
        >
          {/* Modern Layout - Full Background */}
          <div
            style={{
              height: "100vh",
              background: `url(${backgroundImage}) center center / cover no-repeat`,
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Background Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(0, 102, 179, 0.3) 0%, rgba(0, 77, 135, 0.4) 40%, rgba(0, 51, 102, 0.5) 100%)",
                zIndex: 1,
              }}
            ></div>
            {/* Header Section */}
            <div
              className="header-section"
              style={{
                position: "relative",
                zIndex: 10,
                textAlign: "center",
                padding: "20px 20px 10px",
                maxWidth: "1200px",
                margin: "0 auto",
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
            >
              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  color: "#ffd700",
                  margin: "0 0 10px 0",
                  textShadow:
                    "0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)",
                  letterSpacing: "1px",
                  lineHeight: "1.2",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                SỞ XÂY DỰNG THÀNH PHỐ HỒ CHÍ MINH
                <br />
                CẢNG VỤ ĐƯỜNG THỦY NỘI ĐỊA
              </h1>

              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255, 255, 255, 0.95)",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  lineHeight: "1.3",
                  fontWeight: "400",
                  letterSpacing: "0.5px",
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                ĐĂNG NHẬP DÀNH CHO CÁN BỘ CẢNG VỤ
              </p>
            </div>
            {/* Main Content Area - Unified Layout */}
            <div
              className="split-layout"
              style={{
                position: "relative",
                zIndex: 2,
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "30px 20px 80px",
                maxWidth: "1400px",
                margin: "0 auto",
                width: "100%",
                minHeight: "calc(100vh - 140px)",
                boxSizing: "border-box",
              }}
            >
              {/* Login Container */}
              <div
                className="login-container"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(25px)",
                  borderRadius: "24px",
                  padding: "40px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
                  minWidth: "400px",
                  maxWidth: "450px",
                  position: "relative",
                  animation: "fadeInUp 1s ease-out",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "35px",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 25px",
                      position: "relative",
                      animation: "float 6s ease-in-out infinite",
                    }}
                  >
                    <img
                      src={cangvuLogo}
                      alt="Cảng vụ HCM Logo"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        filter:
                          "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      marginBottom: "30px",
                      textAlign: "center",
                      fontWeight: "800",
                      fontSize: "24px",
                      color: "#0066b3",
                      letterSpacing: "1px",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    ĐĂNG NHẬP CÁN BỘ CẢNG VỤ
                  </h3>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div
                    style={{
                      marginBottom: "5px",
                      fontSize: "14px",
                      color: "#2c3e50",
                    }}
                  >
                    Tài khoản cán bộ
                  </div>
                  <div
                    style={{ position: "relative", marginBottom: "10px" }}
                  >
                    <i
                      className="fas fa-user-tie"
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#7f8c8d",
                      }}
                    ></i>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onDoubleClick={handleUsernameDblClick}
                      placeholder="Tài khoản cán bộ..."
                      style={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        padding: "8px 15px 8px 40px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                      title="Double-click để auto-fill admin/123456"
                    />
                  </div>
                  {errors.username && (
                    <div
                      style={{
                        color: "#0066b3",
                        fontSize: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {errors.username}
                    </div>
                  )}

                  {/* Password */}
                  <div
                    style={{
                      marginBottom: "5px",
                      fontSize: "14px",
                      color: "#2c3e50",
                    }}
                  >
                    Mật khẩu
                  </div>
                  <div
                    style={{ position: "relative", marginBottom: "10px" }}
                  >
                    <i
                      className="fas fa-key"
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#7f8c8d",
                      }}
                    ></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Mật khẩu..."
                      style={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        padding: "8px 75px 8px 40px",
                        fontSize: "15px",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "2px",
                        top: "2px",
                        bottom: "2px",
                        backgroundColor: "#fee",
                        border: "none",
                        padding: "0 12px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#e74c3c",
                        borderRadius: "0 2px 2px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i
                        className={
                          showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                        }
                      ></i>
                      Show
                    </button>
                  </div>
                  {errors.password && (
                    <div
                      style={{
                        color: "#0066b3",
                        fontSize: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {errors.password}
                    </div>
                  )}

                  {/* Captcha */}
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        marginBottom: "5px",
                        fontSize: "14px",
                        color: "#2c3e50",
                      }}
                    >
                      Mã xác nhận
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "120px",
                            height: "40px",
                            backgroundColor: "#e8f0fe",
                            border: "1px solid #d0d7de",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#0066b3",
                            letterSpacing: "4px",
                            fontFamily: "monospace",
                          }}
                        >
                          {captchaCode}
                        </div>
                        <input
                          type="text"
                          name="captcha"
                          value={formData.captcha}
                          onChange={handleInputChange}
                          style={{
                            height: "40px",
                            border: "1px solid #ced4da",
                            borderRadius: "4px",
                            padding: "8px 12px",
                            width: "80px",
                            textTransform: "uppercase",
                            outline: "none",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                          maxLength={5}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          refreshCaptcha();
                        }}
                        style={{
                          height: "40px",
                          backgroundColor: "#e8f0fe",
                          border: "1px solid #d0d7de",
                          borderRadius: "4px",
                          padding: "0 12px",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "#0066b3",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          marginLeft: "8px",
                        }}
                      >
                        <i className="fas fa-sync-alt"></i>
                        Refresh
                      </button>
                    </div>
                    {errors.captcha && (
                      <div
                        style={{
                          color: "#0066b3",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.captcha}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "14px",
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        style={{ marginRight: "8px", cursor: "pointer" }}
                      />
                      Duy trì đăng nhập
                    </label>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowForgotPasswordModal(true);
                      }}
                      style={{
                        color: "#0066b3",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      <i
                        className="fas fa-question-circle"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Quên mật khẩu
                    </a>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div
                      style={{
                        background: "#fee",
                        color: "#e74c3c",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "15px",
                        fontSize: "13px",
                        textAlign: "center",
                      }}
                    >
                      <i
                        className="fas fa-exclamation-triangle"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      color: "#fff",
                      padding: "12px",
                      background: "#0066b3",
                      borderRadius: "4px",
                      fontSize: "16px",
                      fontWeight: "500",
                      border: "none",
                      width: "100%",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#004d87";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#0066b3";
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <i
                          className="fas fa-spinner fa-spin"
                          style={{ marginRight: "8px" }}
                        ></i>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i
                          className="fas fa-sign-in-alt"
                          style={{ marginRight: "8px" }}
                        ></i>
                        Đăng nhập
                      </>
                    )}
                  </button>

                  {/* Register Link */}
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontSize: "14px",
                      color: "#2c3e50",
                    }}
                  >
                    Bạn chưa có tài khoản cán bộ? Đăng ký{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowRegisterModal(true);
                      }}
                          style={{
                            color: "#0066b3",
                            fontWeight: "bold",
                            textDecoration: "none",
                          }}
                    >
                      Tại đây
                    </a>
                  </div>
                </form>

                {/* Link back to main login */}
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                    style={{
                      color: "#6c757d",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(108, 117, 125, 0.1)";
                      e.currentTarget.style.color = "#495057";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6c757d";
                    }}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Quay về đăng nhập chính
                  </a>
                </div>
              </div>
            </div>

            {/* Modern Footer */}
            <div
              style={{
                zIndex: 100,
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%)",
                backdropFilter: "blur(10px)",
                padding: "10px",
                position: "absolute",
                bottom: "0px",
                left: "0",
                right: "0",
                textAlign: "center",
                color: "#fff",
                fontSize: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <strong
                style={{
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #0066b3, #004d87)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Copyright © 2025
              </strong>{" "}
              - ĐĂNG NHẬP CÁN BỘ CẢNG VỤ
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              width: "500px",
              maxWidth: "90vw",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f8fafc",
              }}
            >
              <i
                className="fas fa-key"
                style={{
                  color: "#0066b3",
                  fontSize: "20px",
                  marginRight: "12px",
                }}
              ></i>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Khôi Phục Tài Khoản Cán Bộ
              </h3>
              <button
                onClick={closeForgotPasswordModal}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {/* Modal Content */}
            <div style={{ padding: "20px" }}>
              {/* Description */}
              <div
                style={{
                  marginBottom: "20px",
                  fontSize: "14px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                }}
              >
                Vui lòng điền Mã cán bộ và Email đã đăng ký. Hệ thống sẽ gửi
                xác nhận qua email của bạn.
              </div>

              <form onSubmit={handleForgotPasswordSubmit}>
                {/* Company Code Field */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Mã cán bộ
                    <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="companyCode"
                    value={forgotPasswordData.companyCode}
                    onChange={handleForgotPasswordInputChange}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "8px 12px",
                      border: `1px solid ${
                        forgotPasswordErrors.companyCode ? "#ef4444" : "#d1d5db"
                      }`,
                      borderRadius: "4px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    placeholder="Nhập mã cán bộ"
                  />
                  {forgotPasswordErrors.companyCode && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {forgotPasswordErrors.companyCode}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    Email đã đăng ký
                    <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordInputChange}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "8px 12px",
                      border: `1px solid ${
                        forgotPasswordErrors.email ? "#ef4444" : "#d1d5db"
                      }`,
                      borderRadius: "4px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    placeholder="Nhập email đăng ký"
                  />
                  {forgotPasswordErrors.email && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {forgotPasswordErrors.email}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "44px",
                    backgroundColor: "#0066b3",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#004d87";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#0066b3";
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                  Gửi yêu cầu
                </button>
              </form>

              {/* Close Button */}
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={closeForgotPasswordModal}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#6b7280",
                    fontSize: "14px",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              width: "900px",
              maxWidth: "95vw",
              maxHeight: "95vh",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              position: "relative",
              overflow: "auto",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f8fafc",
              }}
            >
              <i
                className="fas fa-user-plus"
                style={{
                  color: "#0066b3",
                  fontSize: "20px",
                  marginRight: "12px",
                }}
              ></i>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Đăng Ký Tài Khoản Cán Bộ Cảng Vụ
              </h3>
              <button
                onClick={closeRegisterModal}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "20px" }}>
              <form onSubmit={handleRegisterSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  {/* Left Column */}
                  <div>
                    {/* Username */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Tên đăng nhập (Mã cán bộ):
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập mã cán bộ..."
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.username ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.username && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.username}
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Mật khẩu đăng nhập:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        placeholder="***"
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.password ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.password && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.password}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Nhập lại mật khẩu:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        placeholder="***"
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.confirmPassword
                              ? "#ef4444"
                              : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.confirmPassword && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.confirmPassword}
                        </div>
                      )}
                    </div>

                    {/* Full Name */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Tên cán bộ:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={registerData.companyName}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập tên cán bộ..."
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.companyName ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.companyName && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.companyName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Email */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Email:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập Email..."
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.email ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.email && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.email}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Số điện thoại liên hệ:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập Số điện thoại..."
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.phone ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.phone && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.phone}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Địa chỉ:
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={registerData.address}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập địa chỉ..."
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "8px 12px",
                          border: `1px solid ${
                            registerErrors.address ? "#ef4444" : "#d1d5db"
                          }`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      {registerErrors.address && (
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {registerErrors.address}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        Ghi chú:
                      </label>
                      <textarea
                        name="notes"
                        value={registerData.notes}
                        onChange={handleRegisterInputChange}
                        placeholder="Nhập ghi chú..."
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notice */}
                <div
                  style={{
                    marginBottom: "20px",
                    backgroundColor: "#fef2f2",
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Lưu ý:
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    - Chỉ cán bộ được ủy quyền mới có thể đăng ký tài khoản này.
                    <br />- Mọi thông tin chi tiết xin liên hệ số Tổng đài Hỗ trợ:{" "}
                    <strong>1900 1286</strong>
                  </div>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <button
                    type="submit"
                    disabled={isRegisterLoading}
                    style={{
                      flex: 1,
                      height: "44px",
                      backgroundColor: isRegisterLoading
                        ? "#6c757d"
                        : "#0066b3",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: isRegisterLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: isRegisterLoading ? 0.7 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isRegisterLoading) {
                        e.currentTarget.style.backgroundColor = "#004d87";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isRegisterLoading) {
                        e.currentTarget.style.backgroundColor = "#0066b3";
                      }
                    }}
                  >
                    {isRegisterLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Đăng ký
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeRegisterModal}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "12px 24px",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#4b5563";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#6b7280";
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CangVuLoginPage;
