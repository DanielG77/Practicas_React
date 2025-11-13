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
                        (msg.from && msg.from._id === socket?.userId) // opcional
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
        <div style={{ height: '60vh', overflowY: 'auto' }}>
            {liveMessages.map(m => (
                <div key={m._id} style={{ padding: '6px', borderBottom: '1px solid #eee' }}>
                    <strong>{m.from?.name || 'Jo'}</strong>: {m.content}
                    <div style={{ fontSize: '0.8em' }}>{new Date(m.createdAt).toLocaleString()}</div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
