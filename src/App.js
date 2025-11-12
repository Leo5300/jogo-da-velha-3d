import "./App.css";
import { useState } from "react";

// 🟦 Componente do quadrado individual
function Square({ valor, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {valor}
    </button>
  );
}

// 🟩 Tabuleiro de 3x3 (um nível do jogo 3D)
function Tabuleiro3D({ nivel, squares, xIsNext, onPlay }) {
  function handleClick(i) {
    const index = nivel * 9 + i;
    if (squares[index] || haVencedor3D(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="tabuleiro">
      {[0, 1, 2].map((row) => (
        <div key={row} className="linha">
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={col}
                valor={squares[nivel * 9 + index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// 🧠 Jogo principal
export default function Game() {
  const [history, setHistory] = useState([Array(27).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const vencedor = haVencedor3D(currentSquares);
  let status = vencedor
    ? `🏆 Vencedor: ${vencedor}`
    : `Próximo a jogar: ${xIsNext ? "X" : "O"}`;

  const moves = history.map((squares, move) => {
    const description = move
      ? "Ir para movimento #" + move
      : "Voltar ao início do jogo";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <h2>{status}</h2>
        <div className="levels">
          {[0, 1, 2].map((nivel) => (
            <div key={nivel} className="nivel">
              <h3>Plano {nivel === 0 ? "Superior" : nivel === 1 ? "Médio" : "Inferior"}</h3>
              <Tabuleiro3D
                nivel={nivel}
                squares={currentSquares}
                xIsNext={xIsNext}
                onPlay={handlePlay}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="game-info">
        <h3>Histórico de Jogadas</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 🧩 Função que verifica vencedor em 3D
function haVencedor3D(squares) {
  const lines = [];

  // --- Linhas, colunas e diagonais de cada plano (2D)
  for (let n = 0; n < 3; n++) {
    const offset = n * 9;
    // Linhas
    lines.push([offset + 0, offset + 1, offset + 2]);
    lines.push([offset + 3, offset + 4, offset + 5]);
    lines.push([offset + 6, offset + 7, offset + 8]);
    // Colunas
    lines.push([offset + 0, offset + 3, offset + 6]);
    lines.push([offset + 1, offset + 4, offset + 7]);
    lines.push([offset + 2, offset + 5, offset + 8]);
    // Diagonais
    lines.push([offset + 0, offset + 4, offset + 8]);
    lines.push([offset + 2, offset + 4, offset + 6]);
  }

  // --- Colunas verticais (entre planos)
  for (let i = 0; i < 9; i++) {
    lines.push([i, i + 9, i + 18]);
  }

  // --- Diagonais principais atravessando todo o cubo
  lines.push([0, 13, 26]);
  lines.push([2, 13, 24]);
  lines.push([6, 13, 20]);
  lines.push([8, 13, 18]);

  // --- Verificação de vitória
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
