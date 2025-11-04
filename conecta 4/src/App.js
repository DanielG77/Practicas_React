// Connect48x8.jsx
import React, { useState } from "react";

const ROWS = 8;
const COLS = 8;

export default function Connect4Simple() {
  const [board, setBoard] = useState(() =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null))
  );
  const [turn, setTurn] = useState("R");

  function dropToken(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        const newBoard = board.map(row => row.slice());
        newBoard[r][col] = turn;
        setBoard(newBoard);
        setTurn(prev => (prev === "R" ? "Y" : "R"));
        return { row: r, col };
      }
    }
    return null;
  }

  function handleCellClick(row, col) {
    dropToken(col);
  }

  return (
    <div>
      <h3>Conecta4 8x8 — Turno: {turn}</h3>
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          {board.map((rowArr, r) => (
            <tr key={r}>
              {rowArr.map((cell, c) => (
                <td
                  key={c}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    width: 40,
                    height: 40,
                    border: "1px solid #333",
                    textAlign: "center",
                    verticalAlign: "middle",
                    cursor: "pointer",
                  }}
                >
                  { }
                  {cell === "R" ? "R" : cell === "Y" ? "Y" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
