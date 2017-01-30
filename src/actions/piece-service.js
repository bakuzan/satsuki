import React from 'react';
import Constants from '../constants/values';
import Piece from '../components/piece/piece';
import movementService from './movement-service';

class PieceService {
  getStartingPiece(rank, file) {
    if ([1,2,7,8].indexOf(rank) === -1) return null;

    const colour = rank < 5 ? Constants.colours.white : Constants.colours.black;
    if ([2,7].indexOf(rank) > -1) return (<Piece name={Constants.pieces.pawn} colour={colour}  />);
    if (['a', 'h'].indexOf(file) > -1) return (<Piece name={Constants.pieces.rook} colour={colour} />);
    if (['b', 'g'].indexOf(file) > -1) return (<Piece name={Constants.pieces.knight} colour={colour} />);
    if (['c', 'f'].indexOf(file) > -1) return (<Piece name={Constants.pieces.bishop} colour={colour} />);
    return file === 'd' ? (<Piece name={Constants.pieces.queen} colour={colour} />) : (<Piece name={Constants.pieces.king} colour={colour} />);
  }
  canSelectPiece(isWhiteTurn, colour) {
    return (isWhiteTurn && colour === Constants.colours.white) || (!isWhiteTurn && colour === Constants.colours.black);
  }
  selectAnotherPiece(isWhiteTurn, currentPiece, newSquare) {
    const contains = newSquare.contains;
    return contains && this.canSelectPiece(isWhiteTurn, contains.props.colour);
  }
  canMovePiece({ squares, files, selected: { file, rank, contains: { props } } }, newSquare) {
    return movementService.canMove(props, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
  }
  canTakePiece({ squares, files, selected: { file, rank, contains: { props } } }, newSquare) {
    return movementService.canTake(props, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
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
