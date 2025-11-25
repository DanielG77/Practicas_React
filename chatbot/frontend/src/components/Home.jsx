import React, { useEffect, useState, useContext } from 'react';
import { apiFetch } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
    const { state } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (!state.token) return;
        async function load() {
            try {
                const data = await apiFetch('/groups', 'GET', null, state.token);
                setGroups(data);
            } catch (err) {
                console.error('Error cargando grupos:', err);
            }
        }
        load();
    }, [state.token]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Grups disponibles</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {groups.map(g => (
                    <li key={g._id} style={{ marginBottom: '12px' }}>
                        <Link to={`http://localhost:5173/?group=${g._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                transition: 'background 0.2s'
                            }}>
                                {g.name} ({g.members.length} membres)
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
