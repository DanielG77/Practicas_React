import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api/api';

export default function Filters({ onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState('animal');
    const stripRef = useRef(null);

    useEffect(() => {
        const raw =
            localStorage.getItem('category')

        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.category) setSelected(parsed.category);
            else if (typeof raw === 'string') setSelected(raw);
        } catch {
            setSelected(raw);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch('/jokes/categories', 'GET');
                if (!mounted) return;

                const cats = Array.isArray(data) ? data : (Array.isArray(data.categories) ? data.categories : []);
                setCategories(cats);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || String(err));
                setCategories([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    function handleSelect(cat) {
        setSelected(cat);
        try { localStorage.setItem('category', JSON.stringify({ category: cat })); } catch (e) { }
        if (typeof onCategoryChange === 'function') onCategoryChange(cat);
        ensureVisible(cat);
    }

    function ensureVisible(cat) {
        const container = stripRef.current;
        if (!container) return;
        const el = container.querySelector(`[data-cat="${cat}"]`);
        if (!el) return;
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (eRect.left < cRect.left) {
            container.scrollBy({ left: eRect.left - cRect.left - 12, behavior: 'smooth' });
        } else if (eRect.right > cRect.right) {
            container.scrollBy({ left: eRect.right - cRect.right + 12, behavior: 'smooth' });
        }
    }

    function scrollBy(amount) {
        if (!stripRef.current) return;
        stripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }

    return (
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ margin: 0, fontSize: 18 }}>Categorías</h1>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                        onClick={() => scrollBy(-200)}
                        aria-label="scroll left"
                        style={{
                            border: 'none', background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                    >
                        ◀
                    </button>

                    <div
                        ref={stripRef}
                        style={{
                            display: 'flex',
                            gap: 8,
                            overflowX: 'auto',
                            padding: '8px 6px',
                            scrollbarWidth: 'thin',
                            WebkitOverflowScrolling: 'touch',
                            msOverflowStyle: 'auto',
                        }}
                    >
                        {loading && <div style={{ padding: '8px 12px' }}>Cargando...</div>}
                        {error && <div style={{ color: 'crimson', padding: '8px 12px' }}>Error: {error}</div>}
                        {!loading && !error && categories.length === 0 && (
                            <div style={{ padding: '8px 12px', color: '#666' }}>Sin categorías</div>
                        )}

                        {!loading && categories.map(cat => {
                            const active = cat === selected;
                            return (
                                <button
                                    key={cat}
                                    data-cat={cat}
                                    onClick={() => handleSelect(cat)}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        padding: '8px 12px',
                                        borderRadius: 999,
                                        border: active ? '1px solid #2563eb' : '1px solid rgba(0,0,0,0.06)',
                                        background: active ? 'linear-gradient(180deg,#3b82f6,#2563eb)' : '#fff',
                                        color: active ? '#fff' : '#111',
                                        cursor: 'pointer',
                                        boxShadow: active ? '0 4px 10px rgba(37,99,235,0.12)' : 'none',
                                        fontWeight: active ? 600 : 500
                                    }}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => scrollBy(200)}
                        aria-label="scroll right"
                        style={{
                            border: 'none', background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </header>
    );
}
