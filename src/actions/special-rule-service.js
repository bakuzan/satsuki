import update from 'immutability-helper';
import Constants from '../constants/values';
import movementService from './movement-service';
import checkService from './check-service';
import helperService from './helper-service';

class SpecialRuleService {
  hasPromotion(squares, colour) {
    const targetRank = colour === Constants.colours.white ? 8 : 1;
    const square = squares.find(x => x.contains && x.contains.name === Constants.pieces.pawn && x.rank === targetRank);
    if (!square) return null;
    return Object.assign({}, { name: Constants.rules.promotion, rank: square.rank, file: square.file });
  }
  checkSquaresForSafePassage(array, attr, side) {
    array.forEach(x => {
      const value = helperService.accessProperty(x, attr);
      if (['f','g'].indexOf(value) > -1) side.king = false;
      if (['b','c','d'].indexOf(value) > -1) side.queen = false;
    });
  }
  checkRooks(array, side) {
    if (!array.find(x => x.contains.name === Constants.pieces.rook && !x.contains.hasMoved && x.file === 'h')) side.king = false;
    if (!array.find(x => x.contains.name === Constants.pieces.rook && !x.contains.hasMoved && x.file === 'a')) side.queen = false;
  }
  canCastle({ squares, attacks, inCheck }, square, colour) {
    const targetRank = colour === Constants.colours.white ? 1 : 8;
    const rule = { name: Constants.rules.castle, king: true, queen: true, rank: targetRank };
    console.log('can castle: ', square, targetRank);
    if (square.contains.name !== Constants.pieces.king || square.contains.hasMoved) return null;
    if (inCheck) return null;
    if (square.rank !== targetRank || square.file !== 'e') return null;
    // TODO Neither the king nor the chosen rook has previously moved.
    const rankSquares = squares.filter(x => x.rank === targetRank && x.contains);
    this.checkSquaresForSafePassage(rankSquares, 'file', rule);
    this.checkRooks(rankSquares, rule);
    console.log('castling check squares: ', rankSquares, rule);
    if (!(rule.king || rule.queen)) return null;

    const rankAttacks = attacks.filter(x => x.attacker.colour !== colour && x.to.rank === targetRank);
    this.checkSquaresForSafePassage(rankAttacks, 'to.file', rule);
    console.log('castling check attacks: ', rankAttacks, rule);
    return (rule.king || rule.queen) ? rule : null;
  }
  canEnPassant({ squares, attacks, inCheck, files }, square, colour, moves) {
    const targetRank = colour === Constants.colours.white ? 5 : 4;
    const rankChange = colour === Constants.colours.white ? 1 : -1;
    const rule = {
      name: Constants.rules.enPassant,
      to: { rank: null, file: null },
      pass: { rank: null, file: null }
    };
    if (square.contains.name !== 'pawn') return null;
    if (square.rank !== targetRank) return null;
    // add check here to see if last move was a pawn advancing 2 squares to targetRank
    // if a pawn moves double to avoid a challenge, you can take the pawn as though it moved only 1 square.
    const squareFileIndex = files.findIndex(x => x === square.file);
    const lastMove = moves.slice(-1)[0];
    if (!lastMove) return null;
    if (lastMove.piece.name !== Constants.pieces.pawn) return null;
    if (lastMove.to.rank !== targetRank) return null;

    const lastMoveFileIndex = files.findIndex(x => x === lastMove.to.file);
    if (Math.abs(squareFileIndex - lastMoveFileIndex) !== 1) return null;
    console.log('can en passant: ', lastMove);
    return Object.assign(rule, { 
      to: { rank: lastMove.to.rank + rankChange, file: lastMove.to.file },
      pass: { rank: lastMove.to.rank, file: lastMove.to.file, contains: lastMove.piece }
    });
  }
  promote(rule, option, history, moves) {
    const index = history.length - 1;
    const current = history[index];
    const squareIndex = current.squares.findIndex(x => x.rank === rule.rank && x.file === rule.file);
    let updatedHistory = update(history, { [index]: {
      squares: { [squareIndex]: {
        contains: { name: { $set: option } }
      } }
    } });
    updatedHistory = this.runAttackChecks(updatedHistory, current, index);
    const newCurrent = updatedHistory[updatedHistory.length - 1];
    const updatedMoves = update(moves, { [moves.length - 1]: {
      promoteTo: { $set: option },
      check: { $set: Object.assign({}, { inCheck: newCurrent.inCheck, winner: newCurrent.winner }) }
    } });
    return { history: updatedHistory, moves: updatedMoves };
  }
  runAttackChecks(history, current, index) {
    const { attacks, inCheck, isMate } = checkService.calculatePossibleAttacks(current.files, history[index].squares);
    return update(history, {
      [index]: {
        attacks : { $set: attacks },
        inCheck : { $set: inCheck },
        winner  : { $set: inCheck && isMate }
      }
    });
  }
  updatePieceOnSquare(history, historyIndex, squareIndex, piece) {
    return update(history, { [historyIndex]: {
      squares: { [squareIndex]: {
        contains: { $set: piece }
      } }
    } });
  }
  setToNextTurn(history, current, index) {
    return update(history, {
      [index]: {
        selected: { $set: null },
        isWhiteTurn : { $set: !current.isWhiteTurn }
      }
    });
  }
  performCastling(history, index, rule, targetFiles) {
    const current = history[index];
    for(let i = 0; i < 2; i++) {
      const fromIndex = current.squares.findIndex(x => x.rank === rule.rank && x.file === targetFiles[i].from);
      const piece = current.squares[fromIndex].contains;
      const toIndex = current.squares.findIndex(x => x.rank === rule.rank && x.file === targetFiles[i].to);
      history = this.updatePieceOnSquare(history, index, toIndex, piece);
      history = this.updatePieceOnSquare(history, index, fromIndex, null);
    }
    return history;
  }
  castle(rule, option, history, moves) {
    const index = history.length;
    const current = history[history.length - 1];
    let updatedHistory = update(history, { $push: [current] });
    const isKingSide = option === `${Constants.pieces.king} side`;
    const castling = [{ from: 'e', to: isKingSide ? 'g' : 'c' }];
    const direction = isKingSide ? { from: 'h', to: 'f' } : { from: 'a', to: 'd' };
    castling.push(direction);
    updatedHistory = this.performCastling(updatedHistory, index, rule, castling);
    updatedHistory = this.runAttackChecks(updatedHistory, current, index);
    updatedHistory = this.setToNextTurn(updatedHistory, current, index);
    const castlingMove = Object.assign({}, { specialRule: rule, isKingSide });
    const updatedMoves = update(moves, { $push: [castlingMove] });
    return { history: updatedHistory, moves: updatedMoves };
  }
  performPassing(history, index, rule) {
    const current = history[index];
    let { squares, graveyard } = movementService.moveToNewPosition(current, rule.to);
    const passingIndex = squares.findIndex(x => x.rank === rule.pass.rank && x.file === rule.pass.file);
    graveyard = update(graveyard, { $push: [squares[passingIndex].contains] });
    squares = update(squares, { [passingIndex]: {
      contains: { $set: null }
    } });
    return update(history, { [index]: {
      graveyard: { $set: graveyard },
      squares: { $set: squares }
    } });
  }
  enPassant(rule, option, history, moves) {
    const index = history.length;
    const current = history[history.length - 1];
    let updatedHistory = update(history, { $push: [current] });
    updatedHistory = this.performPassing(updatedHistory, index, rule);
    updatedHistory = this.runAttackChecks(updatedHistory, current, index);
    updatedHistory = this.setToNextTurn(updatedHistory, current, index);
    const lastestBoard = updatedHistory[index];
    const passingMove = Object.assign({}, {
      from: { rank: current.selected.rank, file: current.selected.file },
      to: rule.to,
      piece: current.selected.contains,
      took: rule.pass.contains,
      check: { inCheck: lastestBoard.inCheck, isMate: lastestBoard.winner }
    });
    const updatedMoves = update(moves, { $push: [passingMove] });
    return { history: updatedHistory, moves: updatedMoves };
  }
  applyRule({ specialRule, history, moves }, option) {
    console.log('apply rule!', specialRule, option);
    switch(specialRule.name) {
      case Constants.rules.promotion:
        return this.promote(specialRule, option, history, moves);
      case Constants.rules.castle:
        return this.castle(specialRule, option, history, moves);
      case Constants.rules.enPassant:
        return this.enPassant(specialRule, option, history, moves);
      default:
        return { history, moves };
    }
  }
}

export default new SpecialRuleService();
