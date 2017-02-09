import update from 'immutability-helper';
import Constants from '../constants/values';
import checkService from './check-service';

class SpecialRuleService {
  hasPromotion(squares, colour) {
    const targetRank = colour === Constants.colours.white ? 8 : 1;
    const square = squares.find(x => x.contains && x.contains.props.name === Constants.pieces.pawn && x.rank === targetRank);
    if (!square) return null;
    return Object.assign({}, { name: Constants.rules.promotion, rank: square.rank, file: square.file });
  }
  checkSquaresForSafePassage(array, attr, side) {
    array.forEach(x => {
        if (['f','g'].indexOf(x[attr]) > 0) side.king = false;
        if (['b','c','d'].indexOf(x[attr]) > 0) side.queen = false;
    });
  }
  canCastle({ squares, attacks, inCheck }, square, colour) {
    const targetRank = colour === Constants.colours.white ? 1 : 8;
    const rule = { name: Constants.rules.castle, king: true, queen: true, rank: targetRank };
    console.log('can castle: ', square, targetRank);
    if (square.contains.props.name !== Constants.pieces.king) return null;
    if (inCheck) return null;
    if (square.rank !== targetRank || square.file !== 'e') return null;
    // TODO Neither the king nor the chosen rook has previously moved.
    const rankSquares = squares.filter(x => x.rank === targetRank && x.contains);
    this.checkSquaresForSafePassage(rankSquares, 'file', rule);
    console.log('castling check squares: ', rankSquares, rule);
    if (!(rule.king || rule.queen)) return null;

    const rankAttacks = attacks.filter(x => x.attacker.colour !== colour && x.to.rank === targetRank);
    this.checkSquaresForSafePassage(rankAttacks, 'to.file', rule);
    console.log('castling check attacks: ', rankAttacks, rule);
    return (rule.king || rule.queen) ? rule : null;
  }
  promote(rule, option, history) {
    const index = history.length - 1;
    const current = history[index];
    const squareIndex = current.squares.findIndex(x => x.rank === rule.rank && x.file === rule.file);
    const updatedHistory = update(history, { [index]: {
      squares: { [squareIndex]: {
        contains: {
          props: {
            name: { $set: option }
          }
        }
      } }
    } });
    return this.runAttackChecks(updatedHistory, current, index);
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
  castle(rule, option, history) {
    const index = history.length;
    const current = history[history.length - 1];
    let updatedHistory = update(history, { $push: [current] });
    const isKingSide = option === `${Constants.pieces.king} side`;
    const castling = [{ from: 'e', to: isKingSide ? 'g' : 'c' }];
    const direction = isKingSide ? { from: 'h', to: 'f' } : { from: 'a', to: 'd' };
    castling.push(direction);
    updatedHistory = this.performCastling(updatedHistory, index, rule, castling);
    updatedHistory = this.runAttackChecks(updatedHistory, current, index);
    return update(updatedHistory, {
      [index]: {
        selected: { $set: null },
        isWhiteTurn : { $set: !current.isWhiteTurn }
      }
    });
  }
  applyRule(rule, option, history) {
    console.log('apply rule!', rule, option);
    switch(rule.name) {
      case Constants.rules.promotion:
        return this.promote(rule, option, history);
      case Constants.rules.castle:
        return this.castle(rule, option, history);
      default:
        return history;
    }
  }
}

export default new SpecialRuleService();
