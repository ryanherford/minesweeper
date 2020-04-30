import React from 'react';
const Config = require('./config').default;

const SmileyFace = ({dispatch, state}) => {
  
  const smileyConfig = Config.smiley[state.theme] || Config.smiley['default'];
  const mouseDown = () => { dispatch({type: 'UPDATE_SMILEY', payload: 'a'})}
  const mouseUp = () => {  dispatch({ type: 'RESET_GAME'})
  }
  return (
    <div className={`smiley`} onMouseDown={() => mouseDown()} onMouseUp={() => mouseUp()}>
        {smileyConfig[state.smileyState] || ''}
    </div>
  );
}

export default SmileyFace;
