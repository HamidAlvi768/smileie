import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import './EnhancedLayout.scss';

const EnhancedLayout = ({ 
  children, 
  title, 
  subtitle,
  actions,
  sidebar,
  sidebarWidth = 300,
  maxWidth = '100%',
  className = '',
  showHeader = true,
  fluid = true,
  compact = false
}) => {
  return (
    <div className={`enhanced-layout ${compact ? 'compact' : ''} ${className}`}>
      {showHeader && (
        <div className="layout-header">
          <Container fluid={fluid}>
            <Row className="align-items-center">
              <Col>
                <div className="header-content">
                  {title && <h4 className="mb-0">{title}</h4>}
                  {subtitle && <p className="text-muted mb-0 mt-1">{subtitle}</p>}
                </div>
              </Col>
              {actions && (
                <Col xs="auto">
                  <div className="header-actions">
                    {actions}
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </div>
      )}
      
      <div className="layout-body">
        <Container fluid={fluid} style={{ maxWidth }}>
          <Row>
            {sidebar ? (
              <>
                <Col 
                  lg={sidebarWidth ? Math.floor((sidebarWidth / 1200) * 12) : 3}
                  md={sidebarWidth ? Math.floor((sidebarWidth / 768) * 12) : 4}
                  className="sidebar-column"
                >
                  <div className="sidebar-content">
                    {sidebar}
                  </div>
                </Col>
                <Col className="main-content">
                  {children}
                </Col>
              </>
            ) : (
              <Col className="main-content">
                {children}
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
};

// Enhanced Card component
export const EnhancedCard = ({ 
  children, 
  title, 
  subtitle,
  actions,
  className = '',
  loading = false,
  error = null,
  empty = false,
  emptyMessage = "No data available",
  ...props 
}) => {
  return (
    <Card className={`enhanced-card ${className}`} {...props}>
      {(title || actions) && (
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {title && <h5 className="card-title mb-0">{title}</h5>}
              {subtitle && <p className="text-muted mb-0 mt-1 small">{subtitle}</p>}
            </div>
            {actions && (
              <div className="card-actions">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <CardBody className={loading || error || empty ? 'p-0' : ''}>
        {loading ? (
          <div className="loading-state">
            <div className="shimmer-card">
              <div className="shimmer-header">
                <div className="shimmer-avatar"></div>
                <div className="shimmer-content">
                  <div className="shimmer-line" style={{ width: '60%' }}></div>
                  <div className="shimmer-line" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="shimmer-body">
                <div className="shimmer-line" style={{ width: '80%' }}></div>
                <div className="shimmer-line" style={{ width: '70%' }}></div>
                <div className="shimmer-line" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="text-center p-4">
              <i className="fas fa-exclamation-triangle text-warning mb-3" style={{ fontSize: '2rem' }}></i>
              <h6 className="text-muted">{error}</h6>
            </div>
          </div>
        ) : empty ? (
          <div className="empty-state">
            <div className="text-center p-4">
              <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '2rem' }}></i>
              <h6 className="text-muted">{emptyMessage}</h6>
            </div>
          </div>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );
};

// Grid Layout component for maximizing data display
export const DataGrid = ({ 
  children, 
  columns = 1,
  gap = 20,
  className = '',
  responsive = true
}) => {
  const getColumnClass = () => {
    if (!responsive) {
      return `col-${12 / columns}`;
    }
    
    const breakpoints = {
      xs: 12,
      sm: columns >= 2 ? 6 : 12,
      md: columns >= 3 ? 4 : columns >= 2 ? 6 : 12,
      lg: columns >= 4 ? 3 : columns >= 3 ? 4 : columns >= 2 ? 6 : 12,
      xl: columns >= 6 ? 2 : columns >= 4 ? 3 : columns >= 3 ? 4 : columns >= 2 ? 6 : 12
    };
    
    return Object.entries(breakpoints)
      .map(([bp, cols]) => `col-${bp}-${cols}`)
      .join(' ');
  };

  return (
    <div 
      className={`data-grid ${className}`}
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${300}px, 1fr))`,
        gap: `${gap}px`
      }}
    >
      {children}
    </div>
  );
};

// Compact List component for dense data display
export const CompactList = ({ 
  items = [], 
  renderItem,
  loading = false,
  emptyMessage = "No items found",
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`compact-list ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="list-item shimmer-item">
            <div className="shimmer-avatar-small"></div>
            <div className="shimmer-content">
              <div className="shimmer-line" style={{ width: '70%' }}></div>
              <div className="shimmer-line" style={{ width: '50%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`compact-list empty ${className}`}>
        <div className="text-center p-3">
          <i className="fas fa-list text-muted mb-2" style={{ fontSize: '1.5rem' }}></i>
          <p className="text-muted mb-0">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`compact-list ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default EnhancedLayout; 