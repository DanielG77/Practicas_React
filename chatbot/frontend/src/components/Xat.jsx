import React, { useContext, useEffect, useReducer, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { messagesReducer } from '../reducers/messagesReducers';
import { apiFetch } from '../api/api';
import Users from './Users';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function Xat() {
    const { state } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, localDispatch] = useReducer(messagesReducer, []);

    useEffect(() => {
        // var item = useParams();
        // console.log(item);
        async function load() {
            if (!state.token) return;
            try {
                const query = selectedUser ? `?userId=${selectedUser._id}` : '';
                const data = await apiFetch(`/messages${query}`, 'GET', null, state.token);
                localDispatch({ type: 'SET', payload: data });
            } catch (err) {
                console.error('Error cargando mensajes:', err);
            }
        }
        load();
    }, [selectedUser, state.token]);

    function onMessageSent(msg) {
        localDispatch({ type: 'ADD', payload: msg });
    }

    return (
        <div className="app-main">
            <aside>
                <Users onSelectUser={setSelectedUser} selectedUser={selectedUser} />
            </aside>

            <section className="chat">
                <div className="chat-header">
                    <div style={{ fontWeight: 700 }}>
                        {selectedUser ? `${selectedUser.name}` : 'Canal general'}
                        {selectedUser && <span style={{ color: 'var(--green)', marginLeft: 8 }}></span>}
                    </div>
                </div>

                <div className="chat-body">
                    <MessageList messages={messages} selectedUser={selectedUser} />
                    <MessageInput
                        toUser={selectedUser}
                        token={state.token}
                        onMessageSent={onMessageSent}
                        className="message-input"
                    />
                </div>
            </section>
        </div>
    );
}
