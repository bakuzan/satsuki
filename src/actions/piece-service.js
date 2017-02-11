import update from 'immutability-helper';
import Constants from '../constants/values';
import movementService from './movement-service';

class PieceService {
  getStartingPiece(rank, file) {
    if ([1,2,7,8].indexOf(rank) === -1) return null;

    const piece = {
      colour: rank < 5 ? Constants.colours.white : Constants.colours.black,
      hasMoved: false
    };
    if ([2,7].indexOf(rank) > -1) return update(piece, { name: { $set: Constants.pieces.pawn } });
    if (['a', 'h'].indexOf(file) > -1) return update(piece, { name: { $set: Constants.pieces.rook } });
    if (['b', 'g'].indexOf(file) > -1) return update(piece, { name: { $set: Constants.pieces.knight } });
    if (['c', 'f'].indexOf(file) > -1) return update(piece, { name: { $set: Constants.pieces.bishop } });
    return update(piece, { name: { $set: file === 'd' ? Constants.pieces.queen : Constants.pieces.king } });
  }
  canSelectPiece(isWhiteTurn, colour) {
    return (isWhiteTurn && colour === Constants.colours.white) || (!isWhiteTurn && colour === Constants.colours.black);
  }
  selectAnotherPiece(isWhiteTurn, currentPiece, newSquare) {
    const contains = newSquare.contains;
    return contains && this.canSelectPiece(isWhiteTurn, contains.colour);
  }
  canMovePiece({ squares, files, selected: { file, rank, contains } }, newSquare) {
    return movementService.canMove(contains, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
  }
  canTakePiece({ squares, files, selected: { file, rank, contains } }, newSquare) {
    return movementService.canTake(contains, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
  }
  getPieceAttackPattern(piece) {
    const rook = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const bishop = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    switch(piece) {
      case Constants.pieces.pawn:
        return [[1,-1],[1,1],[-1,-1],[-1,1]];
      case Constants.pieces.rook:
        return rook
      case Constants.pieces.knight:
        return [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
      case Constants.pieces.bishop:
        return bishop;
      case Constants.pieces.queen:
        return [...bishop, ...rook];
      case Constants.pieces.king:
        return [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];
      default:
        return null;
    }
  }
}

export default new PieceService();
