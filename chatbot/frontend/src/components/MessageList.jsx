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

    // ---- Nuevo: suscripción a 'message_updated' para marcar mensajes como leídos ----
    useEffect(() => {
        if (!socket) return;

        const handleMessageUpdated = (payload) => {
            // payload puede ser: { messageIds: [...] } o directamente [...ids] o un objeto con updatedCount
            let ids = [];

            if (!payload) return;

            if (Array.isArray(payload)) {
                ids = payload;
            } else if (payload.messageIds && Array.isArray(payload.messageIds)) {
                ids = payload.messageIds;
            } else if (payload.updatedIds && Array.isArray(payload.updatedIds)) {
                ids = payload.updatedIds;
            } else {
                // si el servidor solo manda un número, no hay ids para actualizar
                return;
            }

            // Normaliza a strings (por si vienen ObjectId)
            const idsSet = new Set(ids.map(String));

            setLiveMessages(prev => {
                let changed = false;
                const updated = prev.map(m => {
                    if (idsSet.has(String(m._id)) && !m.read) {
                        changed = true;
                        return { ...m, read: true };
                    }
                    return m;
                });
                return changed ? updated : prev;
            });
        };

        socket.on('message_updated', handleMessageUpdated);
        return () => socket.off('message_updated', handleMessageUpdated);
    }, [socket]);

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
                    <span
                        title={m.read ? 'Leído' : 'No leído'}
                        style={{
                            marginLeft: 'auto',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            display: 'inline-block',
                            boxShadow: '0 0 0 2px transparent',
                            background: m.read ? '#007bff' : '#cccccc',
                        }}
                    />
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
