import React, { useState } from 'react';
import './App.css';
import TileMap from './TileMap';

function App() {
  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [numOfMines, setNumOfMines] = useState(10);
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const startOfGame = new Date();
  return (
    <div className="App">
      {!lost && !won && <TileMap startOfGame={startOfGame} winGame={() => setWon(true)} loseGame={() => setLost(true)} height={height} width={width} numOfMines={numOfMines}></TileMap>}
      { lost && <div> You lost motherfucker </div>}
      { won && <div> Can't believe you won</div>}
    </div>
  );
}

export default App;
