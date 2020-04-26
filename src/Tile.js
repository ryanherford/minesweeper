import React from 'react';

const Tile = ({state, onContextHandler, onClickHandler, config}) => {
  // const content = state.active ? state.mine ? '💣' : state.content || '' : state.flag ? '🚩' : '' ;
  const content = state.active 
    ? state.mine ? config.mine : state.content || config.active 
    : state.flag ? config.flag : config.inactive;
  const context = (e) => {
    e.preventDefault();
    onContextHandler()
  };
  const className = `Tile ${state.active ? 'active' : state.flag? '' :'inactive'} proximity${state.content} ${state.flag ? 'flag' : ''}  ${state.mine ? 'mine' : ''}`
  return (
    <div 
      onClick={() => { console.time('activate');onClickHandler()}}
      onContextMenu={(e) => context(e)}
      className={className}>
      <div className='content'>
      { content }
      </div>

    </div>
  );
}

export default Tile;
