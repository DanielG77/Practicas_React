import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload.user, token: action.payload.token };
        case 'LOGOUT':
            return { user: null, token: null };
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (state.token && !state.user) {
            const raw = localStorage.getItem('user');
            if (raw) dispatch({ type: 'SET_USER', payload: JSON.parse(raw) });
        }
    }, [state.token]);

    useEffect(() => {
        if (state.token) localStorage.setItem('token', state.token);
        else localStorage.removeItem('token');
    }, [state.token]);

    return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
