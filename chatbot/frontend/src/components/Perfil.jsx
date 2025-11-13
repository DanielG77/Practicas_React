import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Perfil() {
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
