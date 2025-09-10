import React from 'react'

const EcomPaymentPage: React.FC = () => {
  const handleVietcombankPayment = () => {
    alert('Chuyển đến thanh toán Vietcombank')
    // Simulate payment processing
  }

  const handleOtherBankPayment = () => {
    alert('Chuyển đến thanh toán ngân hàng khác')
    // Simulate payment processing
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Header */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '60px',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          Ngân hàng thanh toán
        </h1>

        {/* Payment Options Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          marginBottom: '50px'
        }}>
          {/* Vietcombank Option */}
          <div 
            onClick={handleVietcombankPayment}
            style={{
              width: '350px',
              backgroundColor: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '15px',
              padding: '50px 40px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4CAF50'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(76,175,80,0.15)'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Vietcombank Logo */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px',
              minHeight: '100px'
            }}>
              <img 
                src="/vietcombank-logo-official.png" 
                alt="Vietcombank" 
                style={{
                  height: '80px',
                  width: 'auto',
                  maxWidth: '200px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  // Fallback to SVG if PNG fails to load
                  (e.target as HTMLImageElement).src = '/vietcombank-logo.svg'
                }}
              />
            </div>
            
            {/* Vietcombank Text */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#333',
                lineHeight: '1.5'
              }}>
                Dành cho Khách hàng có<br />
                Tài khoản Vietcombank
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(76,175,80,0.02) 0%, rgba(76,175,80,0.05) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              borderRadius: '15px',
              pointerEvents: 'none'
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget.previousElementSibling) {
                (e.currentTarget.previousElementSibling as HTMLElement).style.opacity = '1'
              }
            }}></div>
          </div>

          {/* Other Bank Option */}
          <div 
            onClick={handleOtherBankPayment}
            style={{
              width: '350px',
              backgroundColor: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '15px',
              padding: '50px 40px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2196F3'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(33,150,243,0.15)'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Bank Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px',
              minHeight: '100px'
            }}>
              <i 
                className="fas fa-university" 
                style={{
                  fontSize: '64px',
                  color: '#2196F3',
                  textShadow: '0 2px 4px rgba(33,150,243,0.2)'
                }}
              ></i>
            </div>
            
            {/* Other Bank Text */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#333',
                lineHeight: '1.5'
              }}>
                Dành cho Khách hàng có<br />
                Tài khoản Ngân hàng khác
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(33,150,243,0.02) 0%, rgba(33,150,243,0.05) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              borderRadius: '15px',
              pointerEvents: 'none'
            }}></div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#2196F3' }}></i>
          Vui lòng chọn ngân hàng để tiếp tục thanh toán
        </div>
      </div>
    </div>
  )
}

export default EcomPaymentPage
