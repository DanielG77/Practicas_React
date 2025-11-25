import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/api';

export default function Header() {
    const { state, dispatch } = useContext(AuthContext);
    const [otherUsers, setOtherUsers] = useState([]);
    const navigate = useNavigate();
    const logoutBtnRef = useRef();

    useEffect(() => {
        let mounted = true;
        async function setOnline() {
            if (!state.token) return;
            try {
                const users = await apiFetch('/users/online', 'PUT', { online: true }, state.token);
                if (mounted) setOtherUsers(users);
            } catch (err) {
                console.error('Error posant online', err);
            }
        }
        setOnline();

        const handleBeforeUnload = async () => {
            try {
                if (state.token) {
                    navigator.sendBeacon && sendOfflineBeacon();
                    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000/api') + '/users/online', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${state.token}`
                        },
                        body: JSON.stringify({ online: false })
                    });
                }
            } catch (e) {
            }
        };

        function sendOfflineBeacon() {
            try {
                const url = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api') + '/users/online';
                const data = JSON.stringify({ online: false });
                navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
            } catch (e) { }
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            mounted = false;
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state.token]);

    async function handleLogout() {
        try {
            if (state.token) {
                try {
                    await apiFetch('/users/online', 'PUT', { online: false }, state.token);
                } catch (err) {
                    console.warn('No s\'ha pogut marcar offline abans de logout', err);
                }
            }
        } finally {
            dispatch({ type: 'LOGOUT' });
            localStorage.removeItem('token');
            navigate('/login');
            logoutBtnRef.current?.blur();
        }
    }

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid #eee',
            marginBottom: '12px'
        }}>
            <div>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>Intranet Chat</strong>
                </Link>
            </div>

            <nav>
                {!state.token ? (
                    <>
                        <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: 12 }}>
                            {(() => {
                                const raw = localStorage.getItem('user');
                                if (raw) {
                                    try {
                                        const u = JSON.parse(raw);
                                        return u?.name || 'Tu';
                                    } catch (e) {
                                        return 'Tu';
                                    }
                                }
                                return 'Tu';
                            })()}
                        </span>
                        <button ref={logoutBtnRef} onClick={handleLogout}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
}
