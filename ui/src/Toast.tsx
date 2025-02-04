import React, { useEffect } from 'react';

export const ToastContext = React.createContext(null);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === null) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const Toast = ({ toast }) => {
    const { remove } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            remove(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        remove(toast.id);
    }

    const color = toast.level === 'info' ? 'primary' : toast.level === 'warning' ? 'warning' : 'danger';
    return <div className={`toast align-items-center text-bg-${color} border-0 show`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
            <div className="toast-body">
                {toast.message}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={hideToast}></button>
        </div>
    </div>
}