import React, { useState, useEffect} from 'react';
import './App.scss';
import TileMap from './TileMap';
import SmileyFace from './SmileyFace';
import Navbar from './Navbar.js';
const Config = require ('./config').default;

const config = {
  easy: {height: 9, width: 9, mines: 10},
  medium: {height: 16, width: 16, mines: 40},
  hard: {height: 16, width: 30, mines: 99},
  extreme: {height: 24, width: 30, mines: 180},
}
const difficulty = 'medium';
function App() {
  const theme = 'lines';
  const [state, setState] = useState({
    height: config[difficulty].height,
    width: config[difficulty].width,
    numOfMines: config[difficulty].mines,
    won: false,
    lost: false,
    startOfGame: new Date(),
  })

  const [resetCounter, setResetCounter] = useState(0);
  const [bombCount, setBombCount] = useState(state.numOfMines);
  const [smileyState, setSmileyState] = useState('c');
  const [time, setTime] = useState(Math.floor((new Date().getTime() - new Date(state.startOfGame).getTime())/ 1000));
  
  const reset = () => {
    setState(state => {
      return {...state, won: false, lost: false, startOfGame: new Date()}
    })
    setResetCounter(resetCounter => resetCounter + 1);
    setTime(0);
  }
  
  const tileConfig = Config.tile[theme] || Config.tile['default'];
  const smileyConfig = Config.smiley[theme] || Config.smiley['default'];

  useEffect(() => {
    if (state.won) { setSmileyState('w');}
    if (state.lost) {setSmileyState('x');}
    if (!state.won && !state.lost) {setSmileyState('c')}
  }, [state.won, state.lost])
  // time use effect
  useEffect(() => {
    if (state.lost) { return };
    if (time >= 999) { return };
    const timeout = setTimeout(() => {
      setTime( Math.floor((new Date().getTime() - new Date(state.startOfGame).getTime())/ 1000))
    }, 1000)
    return () => {
      clearTimeout(timeout);
    }
  }, [time, state.startOfGame, state.lost]);

  return (
    <div className="App" theme={theme}>
      <Navbar></Navbar>
      <div className="GameContainer">
        <div className='GameInfo'>
          <div className='timer'>
            {time}s
          </div>
          <SmileyFace config={smileyConfig} reset={()=> reset()} state={smileyState}></SmileyFace>
          <div className='bombCount'>
            {bombCount}
          </div>
        </div>
        <TileMap 
          tileConfig={tileConfig}
          mouseDown={() => { if (!state.lost && !state.won) setSmileyState('o')}} 
          mouseUp={() => { if (!state.lost && !state.won)setSmileyState('c')}}
          setBombCount={setBombCount} 
          winGame={() => setState(state => ({...state, won: true}))} 
          loseGame={() =>  setState(state => ({...state, lost: true}))} 
          resetCounter={resetCounter}
          lost={state.lost}
          won={state.won}
          height={state.height} width={state.width} 
          numOfMines={state.numOfMines}></TileMap>
      </div>
    </div>
  );
}

export default App;
