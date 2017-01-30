const Constants = {
  files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ranks: [8, 7, 6, 5, 4, 3, 2, 1],
  colours: {
    white: 'white',
    black: 'black'
  },
  pieces: {
    pawn: 'pawn',
    rook: 'rook',
    knight: 'knight',
    bishop: 'bishop',
    queen: 'queen',
    king: 'king'
  },
  controls: {
    autoReverse: {
      on: 'ON',
      off: 'OFF'
    }
  },
  getPlayerColour(isWhiteTurn) {
    return isWhiteTurn ? this.colours.white : this.colours.black;
  }
  getAutoReverseBoard(autoReverseBoard) {
    return autoReverseBoard ? this.controls.autoReverse.on : this.controls.autoReverse.off;
  }
}

export default Constants;
