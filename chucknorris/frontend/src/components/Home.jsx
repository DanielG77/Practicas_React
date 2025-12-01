import React, { useState, useEffect } from 'react';
import List from './List';
import Filters from './Filters';

export default function Home() {
    // Inicializa desde localStorage (misma lógica que tenías)
    const [category, setCategory] = useState(() => {
        const raw = localStorage.getItem('category') || localStorage.getItem('chuck_category') || localStorage.getItem('chucknorris_category') || localStorage.getItem('selectedCategory');
        if (!raw) return 'animal';
        try {
            const parsed = JSON.parse(raw);
            return parsed && parsed.category ? parsed.category : String(raw);
        } catch {
            return raw;
        }
    });

    // Opcional: mantener localStorage en sync si quieres (Filters ya escribe)
    useEffect(() => {
        try { localStorage.setItem('category', JSON.stringify({ category })); } catch (e) { /* noop */ }
    }, [category]);

    return (
        <div style={{ padding: 20 }}>
            {/* pasa el setter a Filters */}
            <Filters onCategoryChange={setCategory} />
            {/* pasa la categoría seleccionada a List */}
            <List category={category} />
        </div>
    );
}
