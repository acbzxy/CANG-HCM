import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

interface PieChartProps {
  isAnimated?: boolean;
  showLegend?: boolean;
}

export default function DonutChart({ isAnimated = false, showLegend = false }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const start = () => {
      if (chartRef.current) return;
      
      chartRef.current = new Chart(el, {
                 type: 'pie',
        data: {
          labels: ['Nguồn chính', 'Nguồn phụ', 'Nguồn khác'],
          datasets: [{
            data: [56, 25, 19],
            backgroundColor: ['#9b59b6', '#f39c12', '#2ecc71'],
            borderWidth: 0,
            hoverOffset: 12,
            borderRadius: 4
          }]
        },
                 options: {
           responsive: true,
           maintainAspectRatio: false,
                                                          animation: {
                   duration: isAnimated ? 1200 : 0,
                   easing: 'easeOutQuart',
                   animateRotate: true,
                   animateScale: true,
                   delay: isAnimated ? 300 : 0
                 },
          plugins: {
            legend: {
              display: showLegend,
              position: showLegend ? 'bottom' : 'top'
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.parsed;
                  return `${label}: ${value}%`;
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          onHover: (event, activeElements) => {
            if (el) {
              el.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
          }
        }
      });
    };

    // Start chart creation immediately for both animated and non-animated
    start();

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [isAnimated, showLegend]);

  return (
    <div style={{ 
      width: '180px', 
      height: '180px',
      position: 'relative',
      marginBottom: '25px'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
}
