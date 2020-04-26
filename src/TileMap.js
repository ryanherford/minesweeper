import React, { useState, useEffect} from 'react';
import Tile from './Tile';
import {generateMines, generateTileState, isCloseToMine} from './TileMapUtils';



const TileMap = (props) => {
  const [mines, setMines] = useState(generateMines(props.height, props.width, props.numOfMines));
  const [tileState, setTileState] = useState(generateTileState(mines, props.height, props.width));
  
  useEffect(() => {
    if (!props.lost && !props.won) {
      let mines = generateMines(props.height, props.width, props.numOfMines);
      setTileState(generateTileState(mines, props.height, props.width));
      setMines(mines);
    }
  }, [props.resetCounter, props.lost, props.won, props.height, props.width, props.numOfMines])

  // tile update use effect
  useEffect(() => {
    // flatten two dimensional array
    const activatedTiles = [].concat(...tileState);

    if (activatedTiles.filter(t => t.active).length === (props.height * props.width) - props.numOfMines 
    && activatedTiles.filter(t => t.active && t.mine).length === 0) {
      props.winGame();// 
    }
    props.setBombCount(props.numOfMines - [].concat(...tileState).filter(t => t.flag).length)
  }, [tileState, mines, props])

  
  const flagged = (tile) => {
    if (tile.active ) { return; }
    const tileStateCopy = [...tileState];
    tileStateCopy[tile.row][tile.col].flag = tileStateCopy[tile.row][tile.col].flag ? false : true;
    setTileState(tileStateCopy);
  }

  const activateTile = (tile) => {
    if (props.lost || props.won) {return};
    // never lose on first try
    let validMines = [...mines];
    let tileStateCopy = [...tileState];
    
    if (![].concat(...tileState).find(t => t.active)) {
      let {col, row} = tile;
      const neighbors = [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1],[row, col], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
      ];
      validMines = mines.filter(m => !neighbors.find(n => n[0] === m.row && n[1] === m.col));
      while (validMines.length < props.numOfMines) {
        let nRow = Math.floor(Math.random() * props.height);
        let nCol = Math.floor(Math.random() * props.width);
        if (!neighbors.find(n => n[0] === nRow && n[1] === nCol) && isCloseToMine(validMines, col, row) === 0) {
          validMines.push({col: nCol, row: nRow})
        }
      }
      setMines(validMines)
      tileStateCopy = generateTileState(validMines, props.height, props.width, tileStateCopy);
      tile.mine = false;
    }
    if (tile.flag || tile.active) { return true;}
    if (tile.mine && !tile.flag) { 
      props.loseGame();
      // blow em up
      validMines.forEach(m => {
        tileStateCopy[m.row][m.col].active = true;
      });
    }

    const poolTileActivation = (row, col) => {
      if (isCloseToMine(validMines, col, row) === 0) {
        const neighbors = [
          [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
          [row, col - 1],                     [row, col + 1],
          [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
        ];
        neighbors.forEach(n => {
          if (n[0] < 0 || n[0] >= props.height) { return; }
          if (n[1] < 0 || n[1] >= props.width) { return; }
          if (tileStateCopy[n[0]][n[1]].active || tileStateCopy[n[0]][n[1]].flag) { return; }
          tileStateCopy[n[0]][n[1]].active = true;
          poolTileActivation(n[0], n[1]);
        });
      }
    }

    poolTileActivation(tile.row, tile.col)
    if (!tile.flag) { tileStateCopy[tile.row][tile.col].active = true }
    setTileState(tileStateCopy);
    console.timeEnd('activate');
  }
  const rowTiles = (tileState, row) => {
    return [...tileState][row].map(tile => (
      <Tile 
        onClickHandler={() => activateTile(tile)} 
        onContextHandler={() => flagged(tile)}
        key={`${tile.row} ${tile.col}`} 
        state={tile}
        config={props.tileConfig}
        >
      </Tile>
    ))
  };

  return (
    <div onMouseDown={()=> props.mouseDown()} onMouseUp={() => props.mouseUp()} className="TileMap">
      { [...Array(props.height)].map((_, i) => {
          return (
            <div key={`row${i}`} className='TileRow'>
              {rowTiles(tileState, i)}
            </div>
          );
        })
      }
    </div>
  );
}

export default TileMap;
