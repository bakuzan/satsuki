import movementService from './movement-service';
import Constants from '../constants/values';

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
    let kingMovements = [];
    const fileArray = files.slice(0);
    const piecesUnderAttack = attacks.filter(x => x.target !== null);
    const kingAttackers = piecesUnderAttack.filter(x => x.target.name === inCheck.target.name);
    const counterAttackers = this.alliesForCounterAttack(kingAttackers, piecesUnderAttack);
    const kingMoves = this.potentialMovesForKing(inCheck, attacks, fileArray, squares);
    
    console.log('checkmate: ', kingAttackers, counterAttackers, kingMovements);
    
    if (kingMoves.length) return false;
    if (counterAttackers.length) return false;
    return true;
  }
  alliesForCounterAttack(kingAttackers, piecesUnderAttack) {
    const counterAttackers = [];
    for (let i = 0, length = kingAttackers.length; i < length; i++) {
      const enemy = kingAttackers[i];
      const allies = piecesUnderAttack.filter(x => x.target.name === enemy.name && x.target.colour === enemy.colour);
      counterAttackers.concat(allies);
    }
    return counterAttackers;
  }
  potentialMovesForKing(inCheck, attacks, files, squares) {
    const kingMovements = [];
    const kingPotentialMoves = attacks.filter(x => {
      return x.attacker.name === inCheck.target.name && x.attacker.colour === inCheck.target.colour;
    });
    const goodKingMoves = kingPotentialMoves.filter(x => {
      const badSpot = attacks.filter(y => y.square.rank === x.square.rank && y.square.file === x.square.file && y.attacker.colour !== x.attacker.colour);
      return badSpot.length === 0;
    });
    console.log('all', kingPotentialMoves);
    console.log('good', goodKingMoves);
    for (let i = 0, length = goodKingMoves.length; i < length; i++) {
      const potentialMove = goodKingMoves[i];
      const to = { rank: potentialMove.square.rank, file: potentialMove.square.file };
      if (movementService.canMove(inCheck.target, inCheck.square, to, files, squares)) {
        kingMovements.push(potentialMove.square);
      }
    }
    return kingMovements;
  }
}

export default new CheckService();
