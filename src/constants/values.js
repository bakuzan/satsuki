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
const rules = {
  promotion: 'PROMOTION',
  castle: 'CASTLE',
  enPassant: 'EN_PASSANT'
};
const pgn = {
  piece: {
    king: 'K',
    queen: 'Q',
    bishop: 'B',
    knight: 'N',
    rook: 'R',
    pawn: ''
  },
  capture: 'x',
  promotion: '=',
  castle: { king: 'O-O', queen: 'O-O-O' },
  check: '+',
  checkmate: '#'
};

const getPlayerColour = (isWhiteTurn) => {
  return isWhiteTurn ? colours.white : colours.black;
}

const getAutoReverseBoard = (autoReverseBoard) => {
  return autoReverseBoard ? controls.autoReverse.on : controls.autoReverse.off;
}

const worm = {
  topMargin: 0.1,
  bottomMargin: 0.2
}

const Constants = {
  files,
  ranks,
  colours,
  pieces,
  controls,
  rules,
  getPlayerColour,
  getAutoReverseBoard,
  pgn,
  worm
};

export default Constants;
