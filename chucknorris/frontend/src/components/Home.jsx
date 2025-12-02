import React, { useState, useEffect } from 'react';
import List from './List';
import Filters from './Filters';

export default function Home() {
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

    useEffect(() => {
        try { localStorage.setItem('category', JSON.stringify({ category })); } catch (e) { /* noop */ }
    }, [category]);

    return (
        <div style={{ padding: 20 }}>
            <Filters onCategoryChange={setCategory} />
            <List category={category} />
        </div>
    );
}
