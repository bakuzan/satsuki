import _helperService from './helper-service';

class CheckService {
  discoverSquaresUnderThreat(movementService, files, squares) {
    const attacks = [];
    for(let i = 0, length = squares.length; i < length; i++) {
      const square = squares[i];
      if (!square.contains) continue;

      const fileIndex = files.findIndex(x => x === square.file);
      const piece = square.contains.props;
      const attackPattern = _helperService.getPieceAttackPattern(piece.name);
      for(let j = 0, count = attackPattern.length; j < count; j++) {
        const move = attackPattern[j];
        const toSquare = { rank: square.rank + move[0], file: files[fileIndex + move[1]] };
        if (movementService.canTake(square.contains.props, square, toSquare, files, squares)) {
          attacks.push({ 
            name: piece.name,
            colour: piece.colour,
            square: toSquare
          });
        }
      }
    }
    return attacks;
  }
}

export default new CheckService();