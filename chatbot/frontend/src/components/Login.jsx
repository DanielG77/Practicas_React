import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const inputRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/login', 'POST', { email, password });
            dispatch({ type: 'LOGIN', payload: data });
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            alert(err.message);
            inputRef.current?.focus();
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button>Entrar</button>
            </form>
            <Link to="/register">Registrar-se</Link>
        </div>
    );
}
