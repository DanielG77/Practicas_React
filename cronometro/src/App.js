import React, { useState, useRef, useEffect } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [marks, setMarks] = useState([]);

  const start = () => {
    if (intervalRef.current) return;
    const baseStart = startTime && now ? Date.now() - (now - startTime) : Date.now();
    setStartTime(baseStart);
    setNow(Date.now());

    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 50);
  };

  const stop = () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (!startTime || !now) return;
    const elapsed = now - startTime;
    setMarks((m) => [elapsed, ...m]);
  };

  const reset = () => {
    stop();
    setStartTime(null);
    setNow(null);
    setMarks([]);
  };

  const formatTime = (ms) => {
    if (ms == null) return '00:00.00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    const pad = (n, size = 2) => String(n).padStart(size, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds, 2)}`;
  };

  const elapsed = startTime && now ? now - startTime : 0;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, Arial', maxWidth: 420 }}>

      <div style={{ fontSize: 32, marginBottom: 12 }}>{formatTime(elapsed)}</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={start} aria-pressed={!!intervalRef.current}>Començar</button>
        <button onClick={stop}>Parar</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div>
        <h3>Marques ({marks.length})</h3>
        <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
          {marks.length === 0 ? (
            <div style={{ color: '#666' }}>No hi ha marques encara.</div>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 16 }}>
              {marks.map((m, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{formatTime(m)}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
