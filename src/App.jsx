import { useState } from "react";

import Player from "./Component/PlayerInfo";
import GameBroad from "./Component/GameBroad";
import Log from "./Component/Log";
import { WINNING_COMBINATIONS } from "./WINNING-COMBINATION";
import GameOver from "./Component/GameOver";

const PLAYER = {
  X: "player 1",
  O: "player 2",
};
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currTurn = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currTurn = "O";
  }
  return currTurn;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, player) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = player[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  const [gameTurns, setGameTurn] = useState([]);
  const [player, setPlayer] = useState(PLAYER);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, player);

  const hasDraw = gameTurns.length === 9;

  function handleSelectedSquare(rowIndex, colIndex) {
    setGameTurn((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updateTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updateTurns;
    });
  }
  function handleRestart() {
    setGameTurn([]);
  }
  function handleNameChange(symbol, newName) {
    setPlayer((prevPlayers) => {
      return { ...prevPlayers, [symbol]: newName };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYER.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChange={handleNameChange}
          />
          <Player
            initialName={PLAYER.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChange={handleNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBroad onSelectSquare={handleSelectedSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
