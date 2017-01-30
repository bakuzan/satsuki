import movementService from './movement-service';

class CheckService {
  calculatePossibleAttacks(files, squares) {
    const attacks = this.discoverSquaresUnderThreat(files, squares);
    const inCheck = this.isKingInCheck(attacks);
    const isMate = this.checkIsCheckmate(inCheck, attacks, squares);
    return { attacks, inCheck, isMate };
  }
  discoverSquaresUnderThreat(files, squares) {
    const attacks = [];
    for(let i = 0, length = squares.length; i < length; i++) {
      const square = squares[i];
      if (!square.contains) continue;

      const piece = square.contains.props;
      for(let j = 0, count = squares.length; j < count; j++) {
        const toSquare = squares[j];
        const to = { rank: toSquare.rank, file: toSquare.file };
        if (movementService.canTake(piece, square, to, files, squares)) {
          attacks.push({
            attacker: piece,
            square: toSquare,
            target: toSquare.contains ? toSquare.contains.props : null
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
  checkIsCheckmate(inCheck, attacks, squares) {
    // implement checkmate logic here...
    /*
      1) how many pieces attacking the king
      2) can king move out of check
          - if he cant and (1) answer is more the 1 checkmate (?)
      3) can another piece block check
      4) can another piece take the attacker.
    */
  }
}

export default new CheckService();
