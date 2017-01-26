import movementService from './movement-service';
import pieceService from './piece-service';

class CheckService {
  calculatePossibleAttacks(files, squares) {
    const attacks = this.discoverSquaresUnderThreat(files, squares);
    const inCheck = this.isKingInCheck(attacks);
    return { attacks, inCheck };
  }
  discoverSquaresUnderThreat(files, squares) {
    const attacks = [];
    for(let i = 0, length = squares.length; i < length; i++) {
      const square = squares[i];
      if (!square.contains) continue;

      const fileIndex = files.findIndex(x => x === square.file);
      const piece = square.contains.props;
      const attackPattern = pieceService.getPieceAttackPattern(piece.name);
      for(let j = 0, count = attackPattern.length; j < count; j++) {
        const move = attackPattern[j];
        const toSquare = { rank: square.rank + move[0], file: files[fileIndex + move[1]] };
        if (movementService.canTake(square.contains.props, square, toSquare, files, squares)) {
          const target = squares.find(x => x.rank === toSquare.rank && x.file === toSquare.file);
          attacks.push({
            attacker: piece,
            square: target,
            target: target.contains ? target.contains.props : null
          });
        }
      }
    }
    return attacks;
  }
  isKingInCheck(attacks) {
    for(let i = 0, length = attacks.length; i < length; i++) {
      const attack = attacks[i];
      if (!attack.target) continue;
      if (attack.target.name !== 'king') continue;
      return attack;
    }
    return null;
  }
}

export default new CheckService();
