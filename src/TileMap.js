import React, {useEffect} from 'react';
import Tile from './Tile';
import { generateTileState, isCloseToMine} from './TileMapUtils';
const Config = require('./config').default;



const TileMap = ({state, dispatch}) => {
  // tile update use effect
  useEffect(() => {
    // flatten two dimensional array
    const activatedTiles = [].concat(...state.tileState);
    if (activatedTiles.filter(t => t.active).length === (state.height * state.width) - state.numOfMines 
    && activatedTiles.filter(t => t.active && t.mine).length === 0 && state.game_state !== 'won') {
      dispatch({type: 'WIN_GAME'});
    }
  }, [state.tileState, state.mines, state, dispatch, state.game_state])

  const flagged = (tile) => {
    if (tile.active || !['playing', 'idle'].includes(state.game_state)) { return; }
    const tileStateCopy = [...state.tileState];
    tileStateCopy[tile.row][tile.col].flag = tileStateCopy[tile.row][tile.col].flag ? false : true;
    dispatch({ type: 'UPDATE_TILE_STATE', payload: tileStateCopy});
  }

  const activateTile = (tile) => {
    if (!['idle', 'playing'].includes(state.game_state)) {return};
    // never lose on first try
    let validMines = [...state.mines];
    let tileStateCopy = [...state.tileState];
    if (![].concat(...state.tileState).find(t => t.active)) {
      let {col, row} = tile;
      const neighbors = [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1],[row, col], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
      ];
      validMines = state.mines.filter(m => !neighbors.find(n => n[0] === m.row && n[1] === m.col));
      while (validMines.length < state.numOfMines) {
        let nRow = Math.floor(Math.random() * state.height);
        let nCol = Math.floor(Math.random() * state.width);
        if (!neighbors.find(n => n[0] === nRow && n[1] === nCol) && isCloseToMine(validMines, col, row) === 0) {
          validMines.push({col: nCol, row: nRow})
        }
      }
      dispatch({type: 'UPDATE_STATE', payload: { game_state:'what', mines: validMines}})
      tileStateCopy = generateTileState(validMines, state.height, state.width, tileStateCopy);
      dispatch({ type: 'UPDATE_TILE_STATE', payload: tileStateCopy});
      tile.mine = false;
    }
    if (tile.flag || tile.active) { return true;}
    if (tile.mine && !tile.flag) { 
      // blow em up
      dispatch({type: 'LOSE_GAME'});
      return;
    }

    const poolTileActivation = (row, col) => {
      if (isCloseToMine(validMines, col, row) === 0) {
        const neighbors = [
          [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
          [row, col - 1],                     [row, col + 1],
          [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
        ];
        neighbors.forEach(n => {
          if (n[0] < 0 || n[0] >= state.height) { return; }
          if (n[1] < 0 || n[1] >= state.width) { return; }
          if (tileStateCopy[n[0]][n[1]].active || tileStateCopy[n[0]][n[1]].flag) { return; }
          tileStateCopy[n[0]][n[1]].active = true;
          poolTileActivation(n[0], n[1]);
        });
      }
    }

    poolTileActivation(tile.row, tile.col)
    if (!tile.flag) { tileStateCopy[tile.row][tile.col].active = true }
    dispatch({ type: 'UPDATE_TILE_STATE', payload: tileStateCopy});
  }
  const rowTiles = (tileState, row) => {
    return [...tileState][row].map(tile => (
      <Tile 
        onClickHandler={() => activateTile(tile)} 
        onContextHandler={() => flagged(tile)}
        key={`${tile.row} ${tile.col}`} 
        state={{...tile, helper: state.helper && state.helper.col === tile.col && state.helper.row === tile.row }}
        config={ Config['tile'][state.theme]}
        >
      </Tile>
    ))
  };

  return (
    <div 
      onMouseDown={() => { if (['playing', 'idle'].includes(state.game_state)) dispatch({type: 'UPDATE_SMILEY', payload: 'o'})}} 
      onMouseUp={() => { if (['playing', 'idle'].includes(state.game_state)) dispatch({type: 'UPDATE_SMILEY', payload: 'c'})}}
      className="TileMap">
      { [...Array(state.height)].map((_, i) => {
          return (
            <div key={`row${i}`} className='TileRow'>
              {rowTiles(state.tileState, i)}
            </div>
          );
        })
      }
    </div>
  );
}

export default TileMap;
