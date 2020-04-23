import React from 'react';
import './App.css';

const Tile = (props) => {
  const content = props.state.active ? props.state.mine ? '💣' : props.state.content || '' : props.state.flag ? '🚩' : '' ;
  return (
    <div 
      onClick={() => props.onClickHandler()}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onContextHandler()}} 
      className={`Tile ${props.state.active ? 'active' : ''} proximity${props.state.content} ${props.state.flag ? 'flag' : ''}  ${props.state.mine ? 'mine' : ''}`}>
      <div className='content'>
      { content }
      </div>

    </div>
  );
}

export default Tile;
