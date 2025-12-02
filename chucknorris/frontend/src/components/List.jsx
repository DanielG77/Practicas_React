import React, { useEffect, useState, useCallback } from 'react';

export default function List({ category: propCategory }) {
    const [category, setCategory] = useState(propCategory || 'animal');
    const [jokes, setJokes] = useState([]);
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingTranslations, setLoadingTranslations] = useState({});
    const [translatingAll, setTranslatingAll] = useState(false);
    const [error, setError] = useState(null);
    const [targetLang, setTargetLang] = useState('es');

    useEffect(() => {
        if (propCategory) setCategory(propCategory);
    }, [propCategory]);

    const translateJoke = useCallback(async (jokeId, text, lang = targetLang) => {
        if (!text) return;

        setLoadingTranslations(prev => ({ ...prev, [jokeId]: true }));

        try {
            const res = await fetch('http://localhost:5002/api/translate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    sourceLang: 'en',
                    targetLang: lang
                })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // Ajusta esto según la estructura de respuesta de tu API
            const translatedText = data.translation || data.translatedText || data.text || '';

            setTranslations(prev => ({
                ...prev,
                [jokeId]: { text: translatedText, lang: lang }
            }));
        } catch (err) {
            console.error(`Error traduciendo chiste ${jokeId}:`, err);
            setTranslations(prev => ({
                ...prev,
                [jokeId]: {
                    text: `Error en traducción: ${err.message}`,
                    lang: lang
                }
            }));
        } finally {
            setLoadingTranslations(prev => ({ ...prev, [jokeId]: false }));
        }
    }, [targetLang]);

    const translateAllJokes = useCallback(async (lang = targetLang) => {
        if (jokes.length === 0) return;

        setTranslatingAll(true);

        try {
            const translationPromises = jokes.map(joke =>
                translateJoke(joke.id, joke.value, lang)
            );

            await Promise.all(translationPromises);
        } catch (err) {
            console.error('Error traduciendo todos los chistes:', err);
            setError(`Error traduciendo chistes: ${err.message}`);
        } finally {
            setTranslatingAll(false);
        }
    }, [jokes, translateJoke, targetLang]);

    useEffect(() => {
        if (jokes.length > 0 && targetLang === 'es') {
            const hasTranslations = Object.keys(translations).length > 0;
            if (!hasTranslations) {
                translateAllJokes('es');
            }
        }
    }, [jokes, targetLang, translations, translateAllJokes]);

    const fetchJokes = useCallback(async () => {
        if (!category) return;
        setLoading(true);
        setError(null);
        setTranslations({});
        setLoadingTranslations({});

        try {
            const res = await fetch('http://localhost:5002/api/jokes/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            let arr = [];
            if (Array.isArray(data)) arr = data;
            else if (Array.isArray(data.jokes)) arr = data.jokes;
            else if (data) arr = [data];

            setJokes(arr);
        } catch (err) {
            setError(err.message || String(err));
            setJokes([]);
            setTranslations({});
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        if (!category) return;
        fetchJokes();
    }, [category, fetchJokes]);

    const handleLanguageChange = (lang) => {
        setTargetLang(lang);
    };

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Chistes — categoría: <span style={{ textTransform: 'capitalize' }}>{category}</span></h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={fetchJokes} style={{ padding: '6px 10px' }}>Refrescar</button>
                </div>
            </div>

            <div style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 16,
                border: '1px solid #dee2e6'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <div>
                        <strong style={{ marginRight: 8 }}>Traducciones:</strong>
                        <span style={{ fontSize: 14, color: '#666' }}>
                            Idioma destino:
                            <span style={{
                                fontWeight: 'bold',
                                marginLeft: 4,
                                color: targetLang === 'es' ? '#198754' :
                                    targetLang === 'fr' ? '#0d6efd' :
                                        targetLang === 'de' ? '#6f42c1' : '#000'
                            }}>
                                {targetLang === 'es' ? 'Español' :
                                    targetLang === 'fr' ? 'Francés' :
                                        targetLang === 'de' ? 'Alemán' : targetLang}
                            </span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select
                            value={targetLang}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: 4,
                                border: '1px solid #ced4da'
                            }}
                        >
                            <option value="es">Español</option>
                            <option value="fr">Francés</option>
                            <option value="de">Alemán</option>
                            <option value="it">Italiano</option>
                            <option value="pt">Portugués</option>
                        </select>

                        <button
                            onClick={() => translateAllJokes()}
                            disabled={translatingAll || jokes.length === 0}
                            style={{
                                padding: '6px 12px',
                                background: '#0d6efd',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: translatingAll ? 'not-allowed' : 'pointer',
                                opacity: translatingAll || jokes.length === 0 ? 0.6 : 1
                            }}
                        >
                            {translatingAll ? 'Traduciendo...' : 'Traducir todos'}
                        </button>

                        <button
                            onClick={() => {
                                setTargetLang('es');
                                translateAllJokes('es');
                            }}
                            disabled={translatingAll || jokes.length === 0}
                            style={{
                                padding: '6px 12px',
                                background: '#198754',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: translatingAll ? 'not-allowed' : 'pointer',
                                opacity: translatingAll || jokes.length === 0 ? 0.6 : 1
                            }}
                        >
                            Español
                        </button>
                    </div>
                </div>

                <div style={{ fontSize: 14, color: '#6c757d', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Selecciona un idioma y haz clic en "Traducir todos" para traducir todos los chistes.</span>
                    {translatingAll && (
                        <span style={{ color: '#0d6efd' }}>
                            Traduciendo {Object.values(loadingTranslations).filter(Boolean).length} de {jokes.length} chistes...
                        </span>
                    )}
                </div>
            </div>

            {loading && <div>Cargando chistes…</div>}
            {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {jokes.map(j => {
                    const translation = translations[j.id];
                    const isTranslating = loadingTranslations[j.id];

                    return (
                        <React.Fragment key={j.id}>
                            <article style={{
                                background: '#fff',
                                padding: 12,
                                borderRadius: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                borderLeft: '4px solid #3b82f6'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: 8
                                }}>
                                    <span style={{
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        color: '#3b82f6',
                                        textTransform: 'uppercase'
                                    }}>
                                        Original (EN)
                                    </span>
                                    <span style={{ fontSize: 11, color: '#6b7280' }}>
                                        {j.categories && j.categories.length > 0 ? j.categories.join(', ') : category}
                                    </span>
                                </div>
                                <p style={{ marginTop: 0, marginBottom: 10 }}>{j.value}</p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 12,
                                    color: '#888',
                                    borderTop: '1px solid #eee',
                                    paddingTop: 8
                                }}>
                                    <span>{j.created_at ? new Date(j.created_at.replace(' ', 'T')).toLocaleString() : ''}</span>
                                    <span>ID: {j.id}</span>
                                </div>
                            </article>

                            <article style={{
                                background: '#f8fafc',
                                padding: 12,
                                borderRadius: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                borderLeft: '4px solid #10b981',
                                position: 'relative'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: 8
                                }}>
                                    <div>
                                        <span style={{
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            color: '#10b981',
                                            textTransform: 'uppercase'
                                        }}>
                                            Traducción {translation?.lang && `(${translation.lang.toUpperCase()})`}
                                        </span>
                                        {translation?.lang && (
                                            <span style={{
                                                fontSize: 11,
                                                marginLeft: 8,
                                                padding: '1px 6px',
                                                background: translation.lang === 'es' ? '#d1fae5' :
                                                    translation.lang === 'fr' ? '#dbeafe' :
                                                        translation.lang === 'de' ? '#e9d5ff' : '#f3f4f6',
                                                borderRadius: 4
                                            }}>
                                                {translation.lang === 'es' ? 'ES' :
                                                    translation.lang === 'fr' ? 'FR' :
                                                        translation.lang === 'de' ? 'DE' : translation.lang}
                                            </span>
                                        )}
                                    </div>
                                    {isTranslating && (
                                        <span style={{ fontSize: 11, color: '#666' }}>Traduciendo...</span>
                                    )}
                                </div>
                                <p style={{ marginTop: 0, marginBottom: 10, fontStyle: 'italic' }}>
                                    {translation?.text ? (
                                        translation.text
                                    ) : isTranslating ? (
                                        <span style={{ color: '#666' }}>Cargando traducción...</span>
                                    ) : (
                                        <span style={{ color: '#999' }}>No traducido todavía</span>
                                    )}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: 12,
                                    color: '#888',
                                    borderTop: '1px solid #e5e7eb',
                                    paddingTop: 8
                                }}>
                                    <span>Traducción automática</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button
                                            onClick={() => translateJoke(j.id, j.value, targetLang)}
                                            style={{
                                                fontSize: 11,
                                                padding: '2px 6px',
                                                background: '#f3f4f6',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 4,
                                                cursor: 'pointer'
                                            }}
                                            disabled={isTranslating}
                                        >
                                            {isTranslating ? '...' : 'Traducir'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </React.Fragment>
                    );
                })}
            </div>

            {!loading && jokes.length === 0 && !error && (
                <div style={{ marginTop: 12, color: '#666' }}>
                    No hay chistes — pulsa <strong>Refrescar</strong>.
                </div>
            )}
        </div>
    );
}