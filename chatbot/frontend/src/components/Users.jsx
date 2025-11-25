import React, { useState, useEffect, useContext } from 'react';
import { apiFetch } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getCurrentUser } from '../api/auth';

export default function Users({ onSelectUser, selectedUser }) {
    const [users, setUsers] = useState([]);
    const { state } = useContext(AuthContext);
    const socket = useSocket();

    useEffect(() => {
        if (!state.token) return;
        console.log(state.token);
        let mounted = true;
        async function load() {
            try {
                const data = await apiFetch('/users', 'GET', null, state.token);
                if (mounted) {
                    // console.log("Data: ", data);
                    setUsers(data);
                }
            } catch (err) {
                console.error('Error cargando usuarios:', err);
            }
        }
        load();
        return () => { mounted = false; };
    }, [state.token]);

    useEffect(() => {
        if (!socket) return;
        const handler = (updatedUsers) => {

            getCurrentUser(state.token).then((user) => {
                var usuariosActives = [];
                for (var i = 0; i < updatedUsers.length; i++) {
                    if (updatedUsers[i].email !== user.email) {
                        usuariosActives.push(updatedUsers[i]);
                    }
                }
                setUsers(usuariosActives);
            });
        };
        socket.on('users_updated', handler);
        return () => {
            socket.off('users_updated', handler);
        };
    }, [socket]);

    return (
        <div>
            <h3>Usuaris</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map((u) => {
                    const isSelected = selectedUser && selectedUser._id === u._id;
                    return (
                        <li key={u._id} style={{ marginBottom: '8px' }}>
                            <button
                                onClick={() => onSelectUser(u)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: isSelected ? '#e0f7e9' : 'none',
                                    border: isSelected ? '1px solid #7ed957' : 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    padding: '6px 8px',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'background 0.2s ease, border 0.2s ease'
                                }}
                            >
                                <span
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: u.online ? '#00cc44' : '#999',
                                        boxShadow: u.online ? '0 0 6px #00ff66' : 'none',
                                        display: 'inline-block'
                                    }}
                                />
                                <span style={{ marginLeft: '6px' }}>
                                    {u.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
