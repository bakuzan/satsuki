export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

export const colours = {
  white: 'white',
  black: 'black'
};

export const pieces = {
  pawn: 'pawn',
  rook: 'rook',
  knight: 'knight',
  bishop: 'bishop',
  queen: 'queen',
  king: 'king'
};

export const controls = {
  autoReverse: {
    on: 'ON',
    off: 'OFF'
  }
};

export const getPlayerColour = (isWhiteTurn) => {
  return isWhiteTurn ? colours.white : colours.black;
}

export const getAutoReverseBoard = (autoReverseBoard) => {
  return autoReverseBoard ? controls.autoReverse.on : controls.autoReverse.off;
}
