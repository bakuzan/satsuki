const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const colours = {
  white: 'white',
  black: 'black'
};
const pieces = {
  pawn: 'pawn',
  rook: 'rook',
  knight: 'knight',
  bishop: 'bishop',
  queen: 'queen',
  king: 'king'
};
const controls = {
  autoReverse: {
    on: 'ON',
    off: 'OFF'
  }
};

const getPlayerColour = (isWhiteTurn) => {
  return isWhiteTurn ? colours.white : colours.black;
}

const getAutoReverseBoard = (autoReverseBoard) => {
  return autoReverseBoard ? controls.autoReverse.on : controls.autoReverse.off;
}

const Constants = { 
  files, 
  ranks, 
  colours, 
  pieces, 
  controls, 
  getPlayerColour, 
  getAutoReverseBoard 
};

export default Constants;
