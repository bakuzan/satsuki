import update from 'immutability-helper';
import helperService from './helper-service';
import movementService from './movement-service';
import Constants from '../constants/values';

class CheckService {
  calculatePossibleAttacks(files, squares) {
    const attacks = this.discoverSquaresUnderThreat(files, squares);
    const inCheck = this.isKingInCheck(attacks);
    const isMate = inCheck && this.checkIsCheckmate(inCheck, attacks, squares);
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
            from: square,
            to: toSquare,
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
      if (attack.target.name !== Constants.pieces.king) continue;

      return attack;
    }
    return null;
  }
  mapPawnSquareToAttack(square) {
    const pawnMoves = [];
    const pawnMovement = {
      attacker: square.contains.props,
      from: { rank: square.rank, file: square.file },
      to: { rank: square.rank, file: square.file }
    };
    const firstMove = [2,7].indexOf(square.rank) > -1;
    const rankChange = pawnMovement.attacker.colour === Constants.colours.white ? 1 : -1;
    pawnMovement.to.rank += rankChange;
    pawnMoves.push(pawnMovement);

    if (firstMove) {
      const extraSquare = update(pawnMovement, { to: { rank: { $apply: function(x) { return x + rankChange; } } } });
      pawnMoves.push(extraSquare);
    }
    return pawnMoves;
  }
  checkIsCheckmate(inCheck, attacks, squares) {
    const files = Constants.files.slice();
    if (this.potentialMovesForKing(inCheck, attacks, files, squares)) return false;

    const piecesUnderAttack = attacks.filter(x => x.target !== null);
    const kingAttackers = piecesUnderAttack.filter(x => x.target.name === inCheck.target.name);
    if (kingAttackers.length > 1) return true;
    if (this.alliesForCounterAttack(kingAttackers, piecesUnderAttack)) return false;

    const allies = attacks.filter(x => {
      return x.target === null && [Constants.pieces.king, Constants.pieces.pawn].indexOf(x.attacker.name) === -1 && x.attacker.colour === inCheck.target.colour;
    });
    squares.forEach(item => {
      const pieceInstance = item.contains;
      if (pieceInstance && pieceInstance.props.name === Constants.pieces.pawn && pieceInstance.props.colour === inCheck.target.colour) {
        allies.push(...this.mapPawnSquareToAttack(item));
      }
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
    const fromFileIndex = files.findIndex(x => x === inCheck.from.file);
    const toFileIndex = files.findIndex(x => x === inCheck.to.file);
    const match = { ranks: inCheck.from.rank === inCheck.to.Rank, files: fromFileIndex === toFileIndex };

    for(let i = 0; i < allies.length; i++) {
      const intercept = allies[i];
      const interceptSquare = intercept.to;
      const temp = intercept.from
      console.log(`intercept > ${intercept.attacker.name} : ${temp.file}${temp.rank} => ${interceptSquare.file}${interceptSquare.rank}`);

      if (match.ranks && inCheck.to.rank === interceptSquare.rank) {
        console.log('on same rank: ');
        if (helperService.isBetween(inCheck.from.rank, inCheck.to.rank, interceptSquare.rank)) return true;
      }

      const middleFileIndex = files.findIndex(x => x === interceptSquare.file);
      if (match.files && toFileIndex === middleFileIndex) {
        console.log('on same file: ');
        if (helperService.isBetween(fromFileIndex, toFileIndex, middleFileIndex)) return true;
      }

      const start = { fileIndex: fromFileIndex, ...inCheck.from };
      const end = { fileIndex: toFileIndex, ...inCheck.to };
      console.log('on diagonal: ');
      if (helperService.isOnDiagonal(middleFileIndex, start, end, interceptSquare)) return true;

      console.log(intercept.attacker, ' cannot intercept');
    }
    return false;
  }
}

export default new CheckService();
