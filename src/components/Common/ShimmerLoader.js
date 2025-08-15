import React from 'react';
import './ShimmerLoader.scss';

const ShimmerLoader = ({ 
  type = 'default', 
  lines = 3, 
  height = '16px', 
  width = '100%',
  className = '',
  ...props 
}) => {
  const renderShimmer = () => {
    switch (type) {
      case 'dashboard':
    return (
          <div className="shimmer-dashboard">
            {/* User Panel Cards */}
            <div className="shimmer-user-panel">
              <div className="shimmer-card-row">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="shimmer-stat-card">
                    <div className="shimmer-card-header">
                      <div className="shimmer-avatar-circle"></div>
                      <div className="shimmer-content">
                        <div className="shimmer-line" style={{ width: '60%' }}></div>
                        <div className="shimmer-line" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview and Social Source Row */}
            <div className="shimmer-chart-row">
              <div className="shimmer-overview-card">
                <div className="shimmer-card-header">
                  <div className="shimmer-line" style={{ width: '30%' }}></div>
                </div>
                <div className="shimmer-chart-area">
                  <div className="shimmer-chart-bars">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="shimmer-bar" style={{ height: `${40 + Math.random() * 60}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="shimmer-card-footer">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="shimmer-stat-item">
                      <div className="shimmer-dot"></div>
                      <div className="shimmer-line" style={{ width: '70%' }}></div>
                      <div className="shimmer-line" style={{ width: '30%' }}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shimmer-social-card">
                <div className="shimmer-card-header">
                  <div className="shimmer-line" style={{ width: '40%' }}></div>
                </div>
                <div className="shimmer-pie-chart">
                  <div className="shimmer-circle"></div>
                </div>
                <div className="shimmer-legend">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="shimmer-legend-item">
                      <div className="shimmer-dot"></div>
                      <div className="shimmer-line" style={{ width: '60%' }}></div>
                      <div className="shimmer-line" style={{ width: '20%' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Patients and Revenue Row */}
            <div className="shimmer-data-row">
              <div className="shimmer-table-card">
                <div className="shimmer-card-header">
                  <div className="shimmer-line" style={{ width: '25%' }}></div>
                </div>
                <div className="shimmer-table">
                  <div className="shimmer-table-header">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="shimmer-table-cell" style={{ width: `${25 - i * 2}%` }}></div>
                    ))}
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="shimmer-table-row">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="shimmer-table-cell" style={{ width: `${25 - j * 2}%` }}></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="shimmer-map-card">
                <div className="shimmer-card-header">
                  <div className="shimmer-line" style={{ width: '35%' }}></div>
                </div>
                <div className="shimmer-map-area">
                  <div className="shimmer-map-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="shimmer-card">
            <div className="shimmer-header">
              <div className="shimmer-avatar"></div>
              <div className="shimmer-content">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="shimmer-line" style={{ width: i === 0 ? '60%' : '40%' }}></div>
                ))}
              </div>
            </div>
            <div className="shimmer-body">
              {[...Array(lines)].map((_, i) => (
                <div key={i} className="shimmer-line" style={{ width: `${80 - i * 10}%` }}></div>
              ))}
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="shimmer-table">
            {[...Array(lines)].map((_, i) => (
              <div key={i} className="shimmer-row">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="shimmer-cell" style={{ width: `${25 - j * 2}%` }}></div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="shimmer-list">
            {[...Array(lines)].map((_, i) => (
              <div key={i} className="shimmer-list-item">
                <div className="shimmer-avatar-small"></div>
                <div className="shimmer-content">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="shimmer-line" style={{ width: j === 0 ? '70%' : '50%' }}></div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'chart':
        return (
          <div className="shimmer-chart">
            <div className="shimmer-chart-header">
              <div className="shimmer-line"></div>
            </div>
            <div className="shimmer-chart-body">
              <div className="shimmer-bars">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shimmer-bar" style={{ height: `${60 + Math.random() * 40}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div className="shimmer-custom" style={{ width, height }}>
            {[...Array(lines)].map((_, i) => (
              <div key={i} className="shimmer-line" style={{ height, width: `${100 - i * 10}%` }}></div>
            ))}
          </div>
        );

      default:
        return (
          <div className="shimmer-default">
            {[...Array(lines)].map((_, i) => (
              <div key={i} className="shimmer-line" style={{ height, width: `${100 - i * 10}%` }}></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`shimmer-loader ${className}`} {...props}>
      {renderShimmer()}
        </div>
    );
};

export default ShimmerLoader;