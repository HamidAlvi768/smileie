import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';
import logo from '../../assets/images/logo-sm.png';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({
    message,
    title = 'Smileie',
    type = 'info', // 'success', 'error', 'warning', 'info'
    duration = 4000,
  }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toasts Portal */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
        {toasts.map((toast) => (
          <Toast key={toast.id} isOpen>
            <ToastHeader 
              icon={getToastIcon(toast.type)} 
              toggle={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className={`bg-${getToastColor(toast.type)} text-white`}
            >
              <img src={logo} alt="" className="me-2" height="18" />
              {toast.title}
            </ToastHeader>
            <ToastBody>{toast.message}</ToastBody>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context.showToast;
}; 