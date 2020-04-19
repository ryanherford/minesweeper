import React from 'react';
import './App.css';

const Tile = (props) => {
  const content = props.state.active ? props.state.mine ? 'M' : props.state.content || '' : props.state.flag ? 'X' : '' ;
  return (
    <div 
      onClick={() => props.onClickHandler()}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onContextHandler()}} 
      className={`Tile ${props.state.active ? 'active' : ''} proximity${props.state.content} ${props.state.flag ? 'flag' : ''}`}>
      { content }

    </div>
  );
}

export default Tile;
