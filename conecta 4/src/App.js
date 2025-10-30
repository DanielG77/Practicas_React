import React from "react";


export const MAP_8x8 = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => 0)
);


export default function BoardMap({ map = MAP_8x8 }) {
  const rows = map.length;
  const cols = map[0]?.length ?? 0;

  return (
    <div
      style={{
        display: "inline-block",
        padding: 8,
        background: "#0b63a4",
        borderRadius: 8,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 48px)`, gap: 6, marginBottom: 6 }}>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={`hdr-${c}`} style={{ height: 18, textAlign: "center", color: "white", fontSize: 14 }}>
            ↓
          </div>
        ))}
      </div>


      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 48px)`, gap: 6 }}>
        {map.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              role="gridcell"
              aria-label={`${r + 1}-${c + 1}`}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: cell === 0 ? "transparent" : cell === 1 ? "#e53e3e" : "#f6e05e",
                boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.2)",
                border: "4px solid rgba(255,255,255,0.08)",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
