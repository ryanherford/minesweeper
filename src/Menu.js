import React, {useState} from 'react';
import './App.scss';

function Menu({dispatch, state}) {
  const [menuState, setMenuState] = useState({
    hints: state.hints,
    difficulty: state.difficulty
  });

  const nextDifficulty = {
    'easy' : 'medium',
    'medium' : 'hard',
    'hard' : 'extreme',
    'extreme' : 'easy'
  }
  const nextTheme = {
    'default': 'lines',
    'lines': 'minimal',
    'minimal': 'literal',
    'literal': 'default',
  }
  const capitalise = (value) => `${value}`.charAt(0).toUpperCase() + `${value}`.slice(1);
  const sendState = () => {
    dispatch({type: 'UPDATE_STATE', payload: menuState});
    if (menuState.difficulty !== state.difficulty){
      dispatch({type: 'UPDATE_DIFFICULTY', payload: menuState.difficulty});
      dispatch({type: 'RESET_GAME'});
    }
    dispatch({type: 'DISPLAY_MENU', payload: false});
  }
  return ( 
    <div className='overlay' onClick={() => sendState()}>
      <div className='menu' onClick={(e) => e.stopPropagation()}>
        <div className='menuItem'>
          <div className='label'>Difficulty:</div>
          <div className='value' 
          onClick={() => setMenuState(state => ({...state, difficulty: nextDifficulty[menuState.difficulty]}))}>
              {capitalise(menuState.difficulty)}
          </div>
        </div>
        <div className='menuItem'>
          <div className='label'>Hints:</div>
          <div className='value'  onClick={() => setMenuState(state => ({...state, hints: menuState.hints ? false : true }))}>
            {capitalise(menuState.hints)}
          </div>
        </div>
        <div className='menuItem'>
          <div className='label'>Themes:</div>
          <div className='theme'  onClick={() => dispatch({type: 'UPDATE_STATE', payload: {theme: nextTheme[state.theme]}})}>
            {capitalise(state.theme)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu;
