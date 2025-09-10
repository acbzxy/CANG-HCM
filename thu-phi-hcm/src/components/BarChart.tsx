import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

interface BarChartProps {
  isAnimated?: boolean;
}

export default function BarChart({ isAnimated = false }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const start = () => {
      if (chartRef.current) return;
      
      chartRef.current = new Chart(el, {
        type: 'bar',
        data: {
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
          datasets: [
            {
              label: 'UK',
              data: [45, 32, 35, 52, 68, 40, 35, 48],
              backgroundColor: '#3498db',
              borderRadius: 2,
              barThickness: 12,
            },
            {
              label: 'VIỆT NAM', 
              data: [38, 28, 30, 48, 42, 45, 42, 35],
              backgroundColor: '#8e44ad',
              borderRadius: 2,
              barThickness: 12
            },
            {
              label: 'USA',
              data: [42, 48, 38, 65, 45, 52, 48, 42],
              backgroundColor: '#e74c3c',
              borderRadius: 2,
              barThickness: 12
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: isAnimated ? 1600 : 0,
            easing: 'easeOutQuart',
            delay: isAnimated ? 500 : 0
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                font: {
                  size: 12
                },
                color: '#7f8c8d',
                padding: 5
              },
              fullSize: true,
              maxHeight: 150
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
                title: function(context: any) {
                  return context[0].label;
                },
                label: function(context: any) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value}`;
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                color: '#7f8c8d',
                font: {
                  size: 11,
                  weight: 500
                }
              }
            },
            y: {
              beginAtZero: true,
              display: false,
              grid: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              top: 0,
              bottom: 5
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          onHover: (_event, activeElements) => {
            if (el) {
              el.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
          }
        }
      });
    };

    if (isAnimated) {
      // Trigger animation when component becomes animated
      const timeout = setTimeout(() => {
        start();
      }, 200);
      
      return () => {
        clearTimeout(timeout);
        chartRef.current?.destroy();
        chartRef.current = null;
      };
    } else {
      start();
    }

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [isAnimated]);

  return (
    <div style={{ 
      width: '100%', 
      height: '300px',
      position: 'relative'
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
