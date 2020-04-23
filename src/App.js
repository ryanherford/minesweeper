import React, { useState, useEffect} from 'react';
import './App.css';
import TileMap from './TileMap';

const config = {
  easy: {height: 9, width: 9, mines: 10},
  medium: {height: 16, width: 16, mines: 40},
  hard: {height: 30, width: 16, mines: 99},
  extreme: {height: 30, width: 24, mines: 180},
}
const difficulty = 'medium';
function App() {
  const [height, setHeight] = useState(config[difficulty].height);
  const [width, setWidth] = useState(config[difficulty].width);
  const [numOfMines, setNumOfMines] = useState(config[difficulty].mines);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [bombCount, setBombCount] = useState(numOfMines);
  const [startOfGame] = useState(new Date());
  const [time, setTime] = useState(Math.floor((new Date().getTime() - new Date(startOfGame).getTime())/ 1000));

  // time use effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime( Math.floor((new Date().getTime() - new Date(startOfGame).getTime())/ 1000))
    }, 1000)
    return () => {
      clearTimeout(timeout);
    }
  }, [time, startOfGame]);

  return (
    <div className="App">
      <div className='GameInfo'>
        <div className='timer'>
          {time}s
        </div>
        <div className='bombCount'>
          {bombCount}
        </div>
      </div>
      {!lost && !won &&
        <TileMap setBombCount={setBombCount} winGame={() => setWon(true)} loseGame={() => setLost(true)} height={height} width={width} numOfMines={numOfMines}></TileMap>}
      { lost && <div> You lost :( </div>}
      { won && <div> Can't believe you won</div>}
    </div>
  );
}

export default App;
