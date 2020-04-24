import React, { useState, useEffect} from 'react';
import './App.scss';
import TileMap from './TileMap';
import SmileyFace from './SmileyFace';
import Navbar from './Navbar.js';

const config = {
  easy: {height: 9, width: 9, mines: 10},
  medium: {height: 16, width: 16, mines: 40},
  hard: {height: 30, width: 16, mines: 99},
  extreme: {height: 30, width: 24, mines: 180},
}
const difficulty = 'extreme';
function App() {
  const [height, setHeight] = useState(config[difficulty].height);
  const [width, setWidth] = useState(config[difficulty].width);
  const [numOfMines, setNumOfMines] = useState(config[difficulty].mines);
  const [resetCounter, setResetCounter] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [bombCount, setBombCount] = useState(numOfMines);
  const [smileyState, setSmileyState] = useState('c');
  const [startOfGame] = useState(new Date());
  const [time, setTime] = useState(Math.floor((new Date().getTime() - new Date(startOfGame).getTime())/ 1000));
  const reset = () => {
    setWon(false);
    setLost(false);
    setResetCounter(resetCounter => resetCounter + 1);
    setTime(0);
    console.log('🤩🤩🤩');
  }
  useEffect(() => {
    if (won) { setSmileyState('w');}
    if (lost) {setSmileyState('x');}
    if (!won && !lost) {setSmileyState('c')}
  }, [won, lost])
  // time use effect
  useEffect(() => {
    if (lost) { return };
    if (time >= 999) { return };
    const timeout = setTimeout(() => {
      setTime( Math.floor((new Date().getTime() - new Date(startOfGame).getTime())/ 1000))
    }, 1000)
    return () => {
      clearTimeout(timeout);
    }
  }, [time, startOfGame, lost]);

  return (
    <div className="App" theme="shapes">
      <Navbar></Navbar>
      <div className="GameContainer">
        <div className='GameInfo'>
          <div className='timer'>
            {time}s
          </div>
          <SmileyFace reset={()=> reset()} state={smileyState}></SmileyFace>
          <div className='bombCount'>
            {bombCount}
          </div>
        </div>
        <TileMap 
          mouseDown={() => { if (!lost && !won) setSmileyState('o')}} 
          mouseUp={() => { if (!lost && !won)setSmileyState('c')}}
          setBombCount={setBombCount} 
          winGame={() => setWon(true)} 
          loseGame={() => {setLost(true)}} 
          resetCounter={resetCounter}
          lost={lost}
          won={won}
          height={height} width={width} 
          numOfMines={numOfMines}></TileMap>
      </div>
    </div>
  );
}

export default App;
