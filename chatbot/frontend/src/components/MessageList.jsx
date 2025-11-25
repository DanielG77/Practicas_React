import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function MessageList({ messages, selectedUser }) {
    const [liveMessages, setLiveMessages] = useState(messages);
    const socket = useSocket();
    const bottomRef = useRef();

    useEffect(() => {
        setLiveMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            setLiveMessages(prev => {
                if (prev.some(m => m._id === msg._id)) return prev;

                if (selectedUser) {
                    const otherId = selectedUser._id;
                    const isRelevant = (
                        (msg.from && msg.from._id === otherId) ||
                        (msg.to && msg.to === otherId) ||
                        (msg.from && msg.from._id === socket?.userId)
                    );
                    if (!isRelevant) return prev;
                } else {
                    if (msg.to !== null) return prev;
                }

                return [...prev, msg];
            });
        };

        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [socket, selectedUser]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [liveMessages]);

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            {liveMessages.map(m => (
                <div
                    key={m._id}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px', borderBottom: '1px solid #eee' }}
                >
                    {/* Imagen del usuario */}
                    <img
                        src={m.from?.image || 'https://robohash.org/default.png'}
                        alt={m.from?.name || 'Jo'}
                        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                        <strong>{m.from?.name || 'Jo'}</strong>: {m.content}
                        <div style={{ fontSize: '0.8em', color: '#555' }}>
                            {new Date(m.createdAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
