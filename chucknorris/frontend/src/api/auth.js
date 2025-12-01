import { apiFetch } from './api';

export async function getCurrentUser(token) {
    if (!token) return null;
    try {
        const user = await apiFetch('/users/me', 'GET', null, token);
        return user;
    } catch (err) {
        console.error('No se pudo obtener el usuario actual:', err);
        return null;
    }
}
