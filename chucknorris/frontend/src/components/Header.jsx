import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/api';

export default function Header() {
    const { state, dispatch } = useContext(AuthContext);
    const [otherUsers, setOtherUsers] = useState([]);
    const navigate = useNavigate();
    const logoutBtnRef = useRef();

    async function handleLogout() {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        navigate('/login');
        logoutBtnRef.current?.blur();
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
                    <strong>Mister Chucknorris</strong>
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
