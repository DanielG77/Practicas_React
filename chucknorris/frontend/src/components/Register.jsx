import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/register', 'POST', { username, email, password });
            dispatch({ type: 'LOGIN', payload: data });
            navigate('/');
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <h2>Registrar</h2>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={e => setName(e.target.value)} placeholder="Nom" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button>Registrar</button>
            </form>
        </div>
    );
}
