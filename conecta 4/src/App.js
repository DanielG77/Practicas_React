import React, { useState } from "react";

const ROWS = 8;
const COLS = 8;
const WIN_LENGTH = 4;

export default function Connect4Simple() {
  const [board, setBoard] = useState(
    () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null))
  );
  const [turn, setTurn] = useState("R");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  function checkWin(bd, row, col, token) {
    if (!token) return false;
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let [dr, dc] of dirs) {
      let count = 1;
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && bd[r][c] === token) {
        count++;
        r += dr; c += dc;
      }
      r = row - dr; c = col - dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && bd[r][c] === token) {
        count++;
        r -= dr; c -= dc;
      }
      if (count >= WIN_LENGTH) return true;
    }
    return false;
  }

  function dropToken(col) {
    if (gameOver) return null;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        const placedToken = turn;
        const newBoard = board.map(row => row.slice());
        newBoard[r][col] = placedToken;
        setBoard(newBoard);

        if (checkWin(newBoard, r, col, placedToken)) {
          setGameOver(true);
          const text = placedToken === "R" ? "¡Ganan las rojas (R)!" : "¡Ganan las amarillas (Y)!";
          setMessage(text);
          alert(text);
          return { row: r, col, winner: placedToken };
        }

        const hasEmpty = newBoard.some(rowArr => rowArr.some(cell => cell === null));
        if (!hasEmpty) {
          setGameOver(true);
          setMessage("Empate: tablero lleno.");
          alert("Empate: tablero lleno.");
          return { row: r, col, winner: null, draw: true };
        }

        setTurn(prev => (prev === "R" ? "Y" : "R"));
        setMessage("");
        return { row: r, col };
      }
    }
    setMessage("Columna llena.");
    return null;
  }

  function handleCellClick(row, col) {
    if (gameOver) return;
    dropToken(col);
  }

  function resetGame() {
    setBoard(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null)));
    setTurn("R");
    setGameOver(false);
    setMessage("");
  }

  return (
    <div>
      <h3>Conecta4 8x8 — Turno: {gameOver ? "—" : turn}</h3>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
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
                    cursor: gameOver ? "default" : "pointer",
                    userSelect: "none",
                  }}
                >
                  {cell === "R" ? "R" : cell === "Y" ? "Y" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button onClick={resetGame} style={{ marginRight: 8 }}>Reiniciar</button>
        {gameOver && <span>Partida finalizada.</span>}
      </div>
    </div>
  );
}
