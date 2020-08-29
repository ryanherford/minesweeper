import React, { useState, useEffect, useReducer} from 'react';
import './App.scss';
import TileMap from './TileMap';
import SmileyFace from './SmileyFace';
import Navbar from './Navbar.js';
import Menu from './Menu.js';
import {generateMines, generateTileState, findHelper} from './TileMapUtils';

const Config = require ('./config').default;

const mines = generateMines.apply(Array.from(Config.difficultyMapping['medium']));
const initialState = {
  hints: false,
  displayMenu: true,
  helper: undefined,
  smileyState: 'c',
  difficulty: 'medium',
  theme: 'lines',
  game_state: 'idle',
  startGame: new Date(),
  height: Config.difficultyMapping['medium'].height,
  width: Config.difficultyMapping['medium'].width,
  numOfMines: Config.difficultyMapping['medium'].mines,
  mines: mines,
  tileState: generateTileState(
    mines, 
    Config.difficultyMapping['medium'].height, 
    Config.difficultyMapping['medium'].width
  ),
  flags: [],
  time: 0,
}

const appStateReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SMILEY':
      return {...state, smileyState: action.payload }
    case 'UPDATE_DIFFICULTY':
      return {
        ...state, 
        difficulty: action.payload, 
        height: Config.difficultyMapping[action.payload].height,
        width: Config.difficultyMapping[action.payload].width,
        numOfMines: Config.difficultyMapping[action.payload].mines,
      }
    case 'UPDATE_GAME_STATE':
      return {...state, game_state: action.payload }
    case 'UPDATE_START_GAME':
      return {...state, startGame: action.payload }
    case 'UPDATE_TIME':
      return {...state, time: action.payload }
    case 'UPDATE_HELPER':
      if (!state.hints) return state;
      return {
        ...state,
        helper: (!state.helper || (state.helper && state.tileState[state.helper.row][state.helper.col].active)) ? findHelper(state.tileState) : state.helper ,
      }
    case 'UPDATE_TILE_STATE':
      return {
        ...state, 
        game_state: 'playing', 
        tileState: action.payload, 
        startGame: state.game_state === 'idle' ? new Date() : state.startGame,
        lastMoveTime: state.game_state === 'playing' ? new Date(): undefined
      }
    case 'UPDATE_STATE':
      return {...state, ...action.payload}
    case 'DISPLAY_MENU':
      return {...state, displayMenu: action.payload}
    case 'RESET_GAME':
      const mines = generateMines(...Array.from(Config.difficultyMapping[state.difficulty]));
      return {
        ...state,
        game_state: 'idle', 
        startGame: new Date(), 
        smileyState: 'c', 
        time: 0,
        mines: mines,
        tileState: generateTileState(mines, state.height, state.width),
        flags: [],
      }
    case 'LOSE_GAME':
      state.mines.forEach(m => { state.tileState[m.row][m.col].active = true;})
      return {
        ...state, 
        game_state: 'lost', 
        smileyState: 'x',
        tileState: state.tileState, 
      }
    case 'WIN_GAME':
      state.mines.forEach(m => { state.tileState[m.row][m.col].flag = true;});
      return {...state, game_state: 'won', smileyState: 'w', tileState: state.tileState}
    default:
      return state;
  }
}


function App() {
  const [appState, dispatch] = useReducer(appStateReducer, initialState);
  const [resetCounter] = useState(0);
  // time use effect
  useEffect(() => {
    if (appState.game_state !== 'playing') { return };
    if (appState.time >= 999) { return };
    const timeout = setTimeout(() => {
      dispatch({type: 'UPDATE_TIME', payload: Math.floor((new Date().getTime() - new Date(appState.startGame).getTime())/ 1000)})
      const threshold =  Math.floor((new Date().getTime() - new Date(appState.lastMoveTime).getTime())/ 1000) > 4;
      if (appState.lastMoveTime && threshold) {
        dispatch({ type: 'UPDATE_HELPER'});
      }
    }, 1000)
    return () => {
      clearTimeout(timeout);
    }
  }, [appState.time, appState.startGame, appState.game_state, appState.lastMoveTime, appState.tileState ]);

  return (
    <div className="App" theme={appState.theme}>
      <Navbar></Navbar>
      <div className="GameContainer">
        <div className='GameInfo'>
          <div className='timer'>
            {appState.time}s
          </div>
          <SmileyFace dispatch={dispatch} state={appState}></SmileyFace>
          <div className='bombCount'>
            {appState.numOfMines - [].concat(...appState.tileState).filter(t => t.flag).length}
          </div>
        </div>
        <TileMap 
          dispatch={dispatch}
          state={appState}
          resetCounter={resetCounter}
        ></TileMap>
      </div>
      {appState.displayMenu && <Menu dispatch={dispatch} state={appState}></Menu>}
    </div>
  );
}

export default App;
