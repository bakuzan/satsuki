import update from 'immutability-helper';
import Constants from '../constants/values';
import movementService from './movement-service';

class SpecialRuleService {
  hasPromotion(squares, colour) {
    const targetRank = colour === Constants.colours.white ? 8 : 1;
    const square = squares.find(x => x.contains && x.contains.props.name === Constants.pieces.pawn && x.rank === targetRank);
    if (!square) return null;
    return Object.assign({}, { name: Constants.rules.promotion, rank: square.rank, file: square.file });
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
    const { attacks, inCheck, isMate } = movementService.calculatePossibleAttacks(current.files, updatedHistory[index].squares);
    return update(updatedHistory, { 
      [index]: {
        attacks : { $set: attacks },
        inCheck : { $set: inCheck },
        winner  : { $set: inCheck && isMate }
      } 
    });
  }
  applyRule(rule, option, history) {
    console.log('apply rule!', rule, option);
    switch(rule.name) {
      case Constants.rules.promotion:
        return this.promote(rule, option, history);
      default:
        return history;
    }
  }
}

export default new SpecialRuleService();
