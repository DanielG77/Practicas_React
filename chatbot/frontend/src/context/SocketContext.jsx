// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const { state } = React.useContext(AuthContext); // { token, ... }
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!state?.token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        if (socket && socket.connected) return;

        const s = io(BACKEND_URL, {
            transports: ['websocket'],
            auth: {
                token: state.token,
            },
            autoConnect: true,
        });

        const onConnect = () => {
            console.log('Socket conectado', s.id);
        };
        const onDisconnect = (reason) => {
            console.log('Socket desconectado', reason);
        };
        const onConnectError = (err) => {
            console.error('Socket connect_error:', err?.message || err);
        };

        s.on('connect', onConnect);
        s.on('disconnect', onDisconnect);
        s.on('connect_error', onConnectError);

        setSocket(s);

        return () => {
            s.off('connect', onConnect);
            s.off('disconnect', onDisconnect);
            s.off('connect_error', onConnectError);
            s.disconnect();
            setSocket(null);
        };
    }, [state?.token]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketContext;
