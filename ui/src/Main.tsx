import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWithRoutes from './App';
import { Toast, ToastContext } from './Toast';
import styled from 'styled-components';

const ToastsContainer = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 9999;

    .toast {
        margin: 16px;
    }
`;

interface ToastDetail {
    id: number;
    level: 'info' | 'warning' | 'error';
    message: string;
}

const Main: React.FC<{}> = () => {
    const [toasts, setToasts] = React.useState<ToastDetail[]>([]);

    const contextValue = React.useMemo(() => ({
        info: (message: string) => {
            toasts.push({
                id: Date.now(),
                level: 'info',
                message: message,
            });
            setToasts([...toasts]);
        },
        warn: (message: string) => {
            toasts.push({
                id: Date.now(),
                level: 'warning',
                message: message,
            });
            setToasts([...toasts]);
        },
        error: (message: string) => {
            toasts.push({
                id: Date.now(),
                level: 'error',
                message: message,
            });
            setToasts([...toasts]);
        },
        remove: (id: number) => {
            const index = toasts.findIndex((toast) => toast.id === id);
            if (index !== -1) {
                toasts.splice(index, 1);
                setToasts([...toasts]);
            }
        }
    }), []);

    const hideToast = (id: number) => {
    }

    return <Router>
        <ToastContext.Provider value={contextValue}>
            <AppWithRoutes />
            {toasts && <ToastsContainer>
                {toasts.map((toast) => {
                    return <Toast key={toast.id} toast={toast} />
                })}
            </ToastsContainer>}
        </ToastContext.Provider>
    </Router>
}

// render the demo page
const element: HTMLElement = document.getElementById('root');
const root = ReactDOM.createRoot(element);
root.render(<Main />);
