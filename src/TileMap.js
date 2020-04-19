import React, { useState, useEffect} from 'react';
import './App.css';
import Tile from './Tile';

const generateMines = (height, width, numOfMines) => {
  const mines = [];
  while (mines.length < numOfMines) { 
    mines.push({ col: Math.floor(Math.random() * width), row: Math.floor(Math.random() * height)});
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
    setTimeout(() => {
      setTime( Math.floor((new Date().getTime() - new Date(props.startOfGame).getTime())/ 1000))
    }, 1000)
  }, [time, props]);

  useEffect(() => {
    const tiles = [].concat(...tileState);
    
    tiles.forEach(a => {
      if (!a.active) return;
      const col = a.col;
      const row = a.row;
      if (isCloseToMine(mines, col, row) === 0) {
        const grid = [-1, 0, 1];
        const neighbors = [];
        grid.forEach(i => {
          grid.forEach(j => {
            const nCol = col + i;
            const nRow = row + j;
            if ((nCol >= 0 && nCol < props.width) &&
            (nRow >= 0 && nRow < props.height) &&
            !(nCol === col && nRow === row)
            && !(tileState[nRow][nCol].active)) {
              neighbors.push([nRow, nCol])
            }
          });
        });
        neighbors.forEach(n => {
          setTileState(tileState => {
            const updatedTile = {...tileState[n[0]][n[1]], active: true, flag: false};
            delete tileState[n[0]][n[1]];
            tileState[n[0]][n[1]] = updatedTile;
            return [...tileState];
          })
        });
      }
      if (tiles.filter(t => t.active).length === (props.height * props.width) - props.numOfMines 
      && tiles.filter(t => t.active && t.mine).length === 0) {
        props.winGame();// 
      }
    });
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
      const updatedTile = {...tile, active: tile.flag ? false : true,};
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
