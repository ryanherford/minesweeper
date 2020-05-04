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
  return mines.filter(mine => (distance(mine.col, col) <= 1) && (distance(mine.row, row) <= 1)).length;
}

const generateTileState = (mines, height, width, original = []) => {
  const state = [];
  [...Array(width)].forEach((_, col) => {
    [...Array(height)].forEach((_, row) => {
      state[row] = state[row] || [];
      const flag = ((original[row]|| [])[col] || {}).flag || false;
      state[row][col] = {row, col, mine: isMine(mines, col, row, ), active: false, flag, content: isCloseToMine(mines, col, row)}
    })
  });
  return state;
};
const neighborActive = (tileState, tile ) => {
  const {row, col} = tile;
  return [
    [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
    [row, col - 1], [row, col + 1],[row + 1, col - 1], 
    [row + 1, col], [row + 1, col + 1]]
    .filter(t => tileState[t[0]] && tileState[t[0]][t[1]])  
    .filter(t => tileState[t[0]][t[1]].active).length;
}

const findHelper = (tileState) => {
  const tiles = [].concat(...tileState);
  let index = Math.floor(Math.random() * tiles.length);
  while (tiles[index].active || tiles[index].mine || !neighborActive(tileState, tiles[index])) {
    index = Math.floor(Math.random() * tiles.length);
  }
  return tiles[index];  
}

export {
  generateMines,
  isCloseToMine,
  generateTileState,
  findHelper,
}