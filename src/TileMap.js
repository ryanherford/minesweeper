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
  const [time, setTime] = useState(Math.floor((new Date().getTime() - new Date(props.startOfGame).getTime())/ 1000));
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
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime( Math.floor((new Date().getTime() - new Date(props.startOfGame).getTime())/ 1000))
    }, 1000)
    return () => {
      clearTimeout(timeout);
    }
  }, [time, props]);

  useEffect(() => {
    const tiles = [].concat(...tileState);
    const tileStateCopy = [...tileState];
    const a = tiles.filter(t => t.new)[0] || {};
    if (!a.active) return;
    const activateTiles = (row, col) => {
      if (isCloseToMine(mines, col, row) === 0) {
        const neighbors = [
          [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
          [row, col - 1],                     [row + 1, col + 1],
          [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
        ];
        neighbors.forEach(n => {
          if (n[0] < 0 || n[0] >= props.height) { return; }
          if (n[1] < 0 || n[1] >= props.width) { return; }
          if (tileStateCopy[n[0]][n[1]].active) { return; }
          const updatedTile = {...tileState[n[0]][n[1]], active: true, flag: false};
          tileStateCopy[n[0]][n[1]] = updatedTile;
          activateTiles(n[0], n[1]);
        });
      }
    }
    const col = a.col;
    const row = a.row;
    activateTiles(row, col);
    const activatedTiles = [].concat(...tileStateCopy);
    if (activatedTiles.filter(t => t.active).length === (props.height * props.width) - props.numOfMines 
    && activatedTiles.filter(t => t.active && t.mine).length === 0) {
      props.winGame();// 
    }
    delete tileStateCopy[row][col].new
    setTileState(tileStateCopy);
  }, [tileState, mines, props])

  
  const flagged = (tile) => {
    setTileState(tileState => {
      const updatedTile = {...tile, flag: tile.active ? false : tile.flag ? false : true};
      delete tileState[tile.row][tile.col];
      tileState[tile.row][tile.col] = updatedTile;
      return [...tileState];
    })
  }
  const activated = (tile) => {
    setTileState(tileState => {
      const updatedTile = {...tile, active: tile.flag ? false : true, new: true};
      delete tileState[tile.row][tile.col];
      tileState[tile.row][tile.col] = updatedTile;
      return [...tileState];
    });
    if (tile.mine && !tile.flag) {
      props.loseGame();
    }
  }
  
  const rowTiles = (tileState, row) => {
    return [...tileState][row].map(tile => (
      <Tile 
      onClickHandler={() => activated(tile)} 
      onContextHandler={() => flagged(tile)}
      key={`${tile.row} ${tile.col}`} 
      state={tile}>
    </Tile>
    ))
  };
  return (
    <div className="TileMap">
      <div className='GameInfo'>
        <div className='timer'>
          {time}s
        </div>
        <div className='bombCount'>
          {props.numOfMines - [].concat(...tileState).filter(t => t.flag).length}
        </div>
      </div>
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
