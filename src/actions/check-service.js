import helperService from './helper-service';
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
    const files = Constants.files.slice();
    if (this.potentialMovesForKing(inCheck, attacks, files, squares)) return false;
    
    const piecesUnderAttack = attacks.filter(x => x.target !== null);
    const kingAttackers = piecesUnderAttack.filter(x => x.target.name === inCheck.target.name);
    if (kingAttackers.length > 1) return true;
    if (this.alliesForCounterAttack(kingAttackers, piecesUnderAttack)) return false;
    
    const allies = attacks.filter(x => {
      return x.target === null && x.attacker.name !== 'king' && x.attacker.colour === inCheck.target.colour;
    });
    if (this.alliesForIntercept(inCheck, allies, squares, files)) return false;
    
    console.log('checkmate: ', kingAttackers, allies);
    return true;
  }
  alliesForCounterAttack(kingAttackers, piecesUnderAttack) {
    const counterAttackers = [];
    console.log('finding counter attackers: ', kingAttackers, piecesUnderAttack);
    for (let i = 0, length = kingAttackers.length; i < length; i++) {
      const enemy = kingAttackers[i];
      const allies = piecesUnderAttack.filter(x => x.target.name === enemy.attacker.name && x.target.colour === enemy.attacker.colour);
      console.log('enemy: ', enemy, 'countered by: ', allies);
      counterAttackers.push(...allies);
    }
    return counterAttackers.length > 0;
  }
  potentialMovesForKing(inCheck, attacks, files, squares) {
    const kingMovements = [];
    const kingPotentialMoves = attacks.filter(x => {
      return x.attacker.name === inCheck.target.name && x.attacker.colour === inCheck.target.colour;
    });
    const goodKingMoves = kingPotentialMoves.filter(x => {
      const badSpot = attacks.filter(y => y.to.rank === x.to.rank && y.to.file === x.to.file && y.attacker.colour !== x.attacker.colour);
      return badSpot.length === 0;
    });
    for (let i = 0, length = goodKingMoves.length; i < length; i++) {
      const potentialMove = goodKingMoves[i];
      const escapeMove = { rank: potentialMove.to.rank, file: potentialMove.to.file };
      if (movementService.canMove(inCheck.target, inCheck.to, escapeMove, files, squares)) {
        kingMovements.push(potentialMove.square);
      }
    }
    return kingMovements.length > 0;
  }
  alliesForIntercept(inCheck, allies, squares, files) {
    console.log('incept attackers :', allies);
    for(let i = 0, length = allies.length; i < length; i++) {
      const intercept = allies[i];
      const interceptSquare = intercept.to;
      console.log('intercept: ', intercept);
      
      if (inCheck.from.rank === inCheck.to.Rank && inCheck.to.rank === interceptSquare.rank) {
        console.log('on same rank: ');
        if (helperService.isBetween(inCheck.from.rank, inCheck.to.rank, interceptSquare.rank)) return true;
      }
      
      const fromFileIndex = files.findIndex(x => x === inCheck.from.file);
      const toFileIndex = files.findIndex(x => x === inCheck.to.file);
      const middleFileIndex = files.findIndex(x => x === interceptSquare.file);
      if (fromFileIndex === toFileIndex && toFileIndex === middleFileIndex) {
        console.log('on same file: ');
        if (helperService.isBetween(fromFileIndex, toFileIndex, middleFileIndex)) return true;
      }
      
      const start = { fileIndex: fromFileIndex, ...inCheck.from };
      const end = { fileIndex: toFileIndex, ...inCheck.to };
      console.log('on diagonal: ', start, end);
      if (helperService.isOnDiagonal(middleFileIndex, start, end, interceptSquare)) return true;

      // Piece attacks are handled...BUT pawn movements need to be accounted for.
      if (intercept.attacker.name === 'pawn') {
        const original = helperService.deepCopy(intercept);
        const firstMove = [2,7].indexOf(original.from.rank) > -1;
        const rankChange = original.attacker.colour === 'white' ? 1 : -1;
        
        original.to.rank += rankChange;
        allies.push(original);
        if (firstMove) {
          const extraSquare = helperService.deepCopy(original);
          extraSquare.to.rank += rankChange;
          allies.push(extraSquare);
        }
      }
      console.log(intercept.attacker, ' cannot intercept');
    }
    return false;
  }
}

export default new CheckService();
