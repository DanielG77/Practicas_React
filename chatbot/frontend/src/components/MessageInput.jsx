import React, { useState, useRef } from 'react';
import { apiFetch } from '../api/api';

export default function MessageInput({ toUser, toGroup, token }) {
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const inputRef = useRef();

    async function handleSend(e) {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            setSending(true);
            const body = { content: text.trim() };

            if (toGroup) body.group = toGroup._id;
            else if (toUser) body.to = toUser._id;

            await apiFetch('/messages', 'POST', body, token);
            setText('');
            inputRef.current?.focus();
        } catch (err) {
            console.error('Error enviant:', err);
            alert('Error enviant: ' + (err?.message || ''));
        } finally {
            setSending(false);
        }
    }

    return (
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={
                    toGroup
                        ? `Missatge al grup ${toGroup.name}`
                        : toUser
                            ? `Missatge a ${toUser.name}`
                            : 'Missatge al canal general'
                }
                disabled={sending}
                style={{ flex: 1, padding: '8px' }}
            />
            <button type="submit" disabled={sending || !text.trim()}>
                {sending ? 'Enviant...' : 'Enviar'}
            </button>
        </form>
    );
}
