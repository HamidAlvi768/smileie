import React, { useState, useEffect } from 'react';

const topicsData = [
  {
    title: 'Device Support',
    items: [
      'iPhone 16 Series Support for ScanBox Pro',
      'Supported Android Devices',
      'ScanBox Pro Compatibility',
    ],
  },
  {
    title: 'Usage Instructions',
    items: [
      'The DentalMonitoring Adapter: Instructions for Use',
      'How to take a scan',
      'How to use ScanBox Pro',
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      'Why is my scan overexposed?',
      'App not detecting device',
      'Scan upload failed',
    ],
  },
];

const iconStyle = {
  fontSize: 22,
  verticalAlign: 'middle',
  marginRight: 8,
};

function HelpMobilePanel({ userName, onClose }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'messages', 'help'
  // Animate in on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false);
  };

  // After exit transition, call onClose
  const handleTransitionEnd = () => {
    if (!isVisible) onClose();
  };

  const modalTransition = {
    transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s cubic-bezier(.4,0,.2,1)',
    transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
    opacity: isVisible ? 1 : 0,
  };

  const handleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      padding: 32,
    }}>
      <div
        style={{
          width: 350,
          maxWidth: '95vw',
          background: '#fff',
          borderRadius: '18px 18px 18px 0',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 540,
          maxHeight: '90vh',
          overflow: 'hidden',
          ...modalTransition,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Close button */}
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: 14,
          right: 16,
          background: 'none',
          border: 'none',
          fontSize: 22,
          color: '#fff',
          cursor: 'pointer',
          zIndex: 2,
        }} aria-label="Close">×</button>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1ec6d9 0%, #1da5fe 100%)',
          padding: '32px 24px 18px 24px',
          color: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 2 }}>
            Hi {userName} <span role="img" aria-label="wave">👋</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 400, marginBottom: 0 }}>
            How can we help?
          </div>
        </div>
        {/* Main Content Area */}
        <div style={{ padding: '18px 18px 0 18px', flex: 1, overflowY: 'auto', display: activeTab === 'messages' ? 'flex' : 'block', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {activeTab === 'messages' ? (
            <div style={{ width: '100%', textAlign: 'center', marginTop: 60 }}>
              <div style={{ fontSize: 48, color: '#222', marginBottom: 18 }}>
                <span className="material-icons" style={{ fontSize: 48 }}>chat_bubble_outline</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>No messages</div>
              <div style={{ color: '#555', fontSize: 15 }}>Messages from the team will be shown here</div>
            </div>
          ) : (
            <>
              {/* Help Center */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Smileie Help Center</div>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', borderRadius: 8, padding: '6px 10px', marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Search for help"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: 15,
                      flex: 1,
                    }}
                  />
                </div>
                {/* Topics */}
                <div>
                  {topicsData.map((topic, idx) => (
                    <div key={topic.title} style={{ marginBottom: 10, background: '#f8fafb', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 12px', fontWeight: 500, fontSize: 15 }}
                        onClick={() => handleExpand(idx)}
                      >
                        <span style={{ flex: 1 }}>{topic.title}</span>
                        <span style={{ fontSize: 18, color: '#1da5fe', marginLeft: 8 }} className="material-icons">
                          {expanded[idx] ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                      {expanded[idx] && (
                        <ul style={{ margin: 0, padding: '0 0 8px 18px', listStyle: 'disc', fontSize: 14, color: '#333' }}>
                          {topic.items.map((item, i) => (
                            <li key={item} style={{ marginBottom: 4 }}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Feedback */}
              <div style={{ margin: '18px 0 12px 0', padding: '12px 12px 10px 12px', background: '#f5f7fa', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Give us your feedback!</div>
                <button style={{ background: '#1da5fe', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Send Feedback</button>
              </div>
            </>
          )}
        </div>
        {/* Bottom Navigation */}
        <div style={{
          borderTop: '1px solid #e6e9ef',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 54,
        }}>
          <button style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#1da5fe' : '#607181', fontSize: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <span className="material-icons" style={iconStyle}>home</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>Home</span>
          </button>
          <button style={{ background: 'none', border: 'none', color: activeTab === 'messages' ? '#1da5fe' : '#607181', fontSize: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => setActiveTab('messages')}>
            <span className="material-icons" style={iconStyle}>chat_bubble_outline</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>Messages</span>
          </button>
          <button style={{ background: 'none', border: 'none', color: activeTab === 'help' ? '#1da5fe' : '#607181', fontSize: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => setActiveTab('help')}>
            <span className="material-icons" style={iconStyle}>help_outline</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpMobilePanel; 