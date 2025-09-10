import React, { useState, useEffect } from 'react';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';

const ChartDemoPage: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    setIsAnimated(false);
    setTimeout(() => {
      setIsAnimated(true);
    }, 200);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: 'calc(100vh - 60px)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            color: '#0066b3',
            margin: '0 0 15px 0',
            fontWeight: 'bold'
          }}>
            <i className="fas fa-chart-pie" style={{ marginRight: '15px', color: '#f36f21' }}></i>
            Demo Biểu Đồ Pie Chart
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            margin: 0 
          }}>
            Pie Chart đầy đủ với Chart.js và hiệu ứng animation chuyên nghiệp
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          alignItems: 'center'
        }}>
          
          {/* Chart Section */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              margin: '0 0 25px 0', 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              Nguồn Truy Cập Website
            </h3>
            
            <DonutChart isAnimated={isAnimated} showLegend={false} />
            
            {/* Legend */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px', 
              width: '100%',
              marginTop: '10px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#9b59b6', 
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(155, 89, 182, 0.4)'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#2c3e50' }}>Nguồn chính</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>56%</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#f39c12', 
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(243, 156, 18, 0.4)'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#2c3e50' }}>Nguồn phụ</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>25%</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#2ecc71', 
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(46, 204, 113, 0.4)'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#2c3e50' }}>Nguồn khác</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>19%</span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div style={{ padding: '0 20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}></div>
              
              <h4 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
                <i className="fas fa-sparkles" style={{ marginRight: '10px' }}></i>
                Tính năng Chart.js
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Pie chart đầy đủ không rỗng giữa</li>
                <li>Bar chart với easeOutQuart animation</li>
                <li>Animation đồng bộ 1600ms - cùng hoàn thành</li>
                <li>Responsive design tự động</li>
                <li>Tooltip tương tác thông minh</li>
                <li>Hover effects chuyên nghiệp</li>
                <li>Custom colors và styling</li>
              </ul>
            </div>

            <button
              onClick={handleReplay}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#0066b3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#004d8a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0066b3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-play" style={{ fontSize: '12px' }}></i>
              Replay Animation
            </button>
          </div>

        </div>

        {/* PolluxUI Style Demo */}
        <div style={{
          marginTop: '40px',
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '18px',
              color: '#2c3e50',
              margin: '0 0 10px 0',
              fontWeight: '600'
            }}>
              PolluxUI Style - Legend Bottom
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: 0 
            }}>
              Giống hệt template PolluxUI với easeOutCubic và legend bottom
            </p>
          </div>

          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ width: '300px', height: '300px' }}>
              <DonutChart isAnimated={isAnimated} showLegend={true} />
            </div>
          </div>
        </div>

        {/* Bar Chart Demo */}
        <div style={{
          marginTop: '40px',
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '18px',
              color: '#2c3e50',
              margin: '0 0 10px 0',
              fontWeight: '600'
            }}>
              Bar Chart - Thống kê truy cập và doanh số
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: 0 
            }}>
              Chart.js Bar Chart synchronized với Pie Chart
            </p>
          </div>

          <div style={{ 
            background: '#f8f9fc',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <BarChart isAnimated={isAnimated} />
          </div>
        </div>

        {/* Technical Details */}
        <div style={{
          marginTop: '40px',
          padding: '25px',
          backgroundColor: '#f8f9fc',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: '#2c3e50',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-code" style={{ color: '#f36f21' }}></i>
            Chi tiết kỹ thuật
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '20px',
            fontSize: '14px'
          }}>
            <div>
              <strong>Library:</strong> Chart.js v4.x<br/>
              <strong>Type:</strong> Pie Chart<br/>
              <strong>Animation:</strong> 1600ms (synced)
            </div>
            <div>
              <strong>Easing:</strong> easeOutCubic<br/>
              <strong>Shape:</strong> Full circle (no cutout)<br/>
              <strong>Hover Offset:</strong> 12px
            </div>
            <div>
              <strong>Colors:</strong> #9b59b6, #f39c12, #2ecc71<br/>
              <strong>Interactive:</strong> Tooltips + Hover<br/>
              <strong>Responsive:</strong> Auto-resize
            </div>
          </div>
          
          <h4 style={{ 
            margin: '25px 0 15px 0', 
            color: '#2c3e50',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-chart-bar" style={{ color: '#f36f21' }}></i>
            Bar Chart Details
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '20px',
            fontSize: '14px'
          }}>
            <div>
              <strong>Type:</strong> Bar Chart<br/>
              <strong>Animation:</strong> 1600ms (synced)<br/>
              <strong>Easing:</strong> easeOutQuart
            </div>
            <div>
              <strong>Datasets:</strong> UK, VIỆT NAM, USA<br/>
              <strong>Bar Thickness:</strong> 12px<br/>
              <strong>Border Radius:</strong> 2px
            </div>
            <div>
              <strong>Colors:</strong> #3498db, #8e44ad, #e74c3c<br/>
              <strong>Legend:</strong> Top-right position<br/>
              <strong>Grid:</strong> Hidden for clean look
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartDemoPage;
