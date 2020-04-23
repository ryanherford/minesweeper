import React, { useState, useEffect} from 'react';
import './App.css';
import Tile from './Tile';

const generateMines = (height, width, numOfMines) => {
  const mines = [];
  while (mines.length < numOfMines) { 
    const mine = { col: Math.floor(Math.random() * width), row: Math.floor(Math.random() * height)}
    if (!mines.find(m => mine.col === m.col && mine.row === m.row)) {
      mines.push(mine);
    }
  }
  return mines;
}

const isMine = (mines, col, row, lose) => {
  return mines.filter(mine => mine.col === col && mine.row === row).length > 0 ? 'M' : '';
}

const isCloseToMine = (mines, col, row) => {
  const distance = (numA, numB) => Math.abs(numA - numB);
  return mines.filter(mine => distance(mine.col, col)  <= 1 && distance(mine.row, row) <= 1).length;
}

const TileMap = (props) => {
  const [mines] = useState(generateMines(props.height, props.width, props.numOfMines));
  const generateTileState = (mines) => {
    const state = [];
    [...Array(props.width)].forEach((_, col) => {
      [...Array(props.height)].forEach((_, row) => {
        state[row] = state[row] || [];
        state[row][col] = {row, col, mine: isMine(mines, col, row, ), active: false, flag: false, content: isCloseToMine(mines, col, row)}
      })
    });
    return state;
  };
  const [tileState, setTileState] = useState(generateTileState(mines));
  

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
    setTileState(tileState => {
      const updatedTile = {...tile, flag: tile.active ? false : tile.flag ? false : true};
      delete tileState[tile.row][tile.col];
      tileState[tile.row][tile.col] = updatedTile;
      return [...tileState];
    })
  }

  const activateTile = (tile) => {
    // never lose on first try
    if ([].concat(...tileState).filter(t => t.active).length === 0 && tile.mine) {
      tile.mine = false;
      let {col, row} = tile;
      while (col === tile.col || row === tile.row || isMine(mines, row, col)) {
        col = Math.floor(Math.random() * props.width)
        row = Math.floor(Math.random() * props.height)
      }
    }
    if (tile.flag || tile.active) { return true;}
    if (tile.mine && !tile.flag) { props.loseGame();}

    const tileStateCopy = [...tileState];

    const poolTileActivation = (row, col) => {
      if (isCloseToMine(mines, col, row) === 0) {
        const neighbors = [
          [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
          [row, col - 1],                     [row, col + 1],
          [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
        ];
        neighbors.forEach(n => {
          if (n[0] < 0 || n[0] >= props.height) { return; }
          if (n[1] < 0 || n[1] >= props.width) { return; }
          if (tileStateCopy[n[0]][n[1]].active || tileStateCopy[n[0]][n[1]].flag) { return; }
          const updatedTile = {...tileState[n[0]][n[1]], active: true, flag: false};
          tileStateCopy[n[0]][n[1]] = updatedTile;
          poolTileActivation(n[0], n[1]);
        });
      }
    }

    poolTileActivation(tile.row, tile.col)
    const updatedTile = {...tile, active: tile.flag ? false : true, new: true};
    tileStateCopy[tile.row][tile.col] = updatedTile;
    setTileState(tileStateCopy);
  }
  const rowTiles = (tileState, row) => {
    return [...tileState][row].map(tile => (
      <Tile 
        onClickHandler={() => activateTile(tile)} 
        onContextHandler={() => flagged(tile)}
        key={`${tile.row} ${tile.col}`} 
        state={tile}>
      </Tile>
    ))
  };

  return (
    <div className="TileMap">
      
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
