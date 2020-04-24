import React from 'react';

const Tile = (props) => {
  // const content = props.state.active ? props.state.mine ? '💣' : props.state.content || '' : props.state.flag ? '🚩' : '' ;
  const content = props.state.active ? props.state.mine ? '' : props.state.content || '' : props.state.flag ? '' : '' ;
  return (
    <div 
      onClick={() => { console.time('activate');props.onClickHandler()}}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onContextHandler()}} 
      className={`Tile ${props.state.active ? 'active' : props.state.flag? '' :'inactive'} proximity${props.state.content} ${props.state.flag ? 'flag' : ''}  ${props.state.mine ? 'mine' : ''}`}>
      <div className='content'>
      { content }
      </div>

    </div>
  );
}

export default Tile;
