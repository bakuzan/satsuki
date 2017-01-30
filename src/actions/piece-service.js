import React from 'react';
import { COLOURS, PIECES } from '../constants/values';
import Piece from '../components/piece/piece';
import movementService from './movement-service';

class PieceService {
  getStartingPiece(rank, file) {
    if ([1,2,7,8].indexOf(rank) === -1) return null;

    const colour = rank < 5 ? COLOURS.WHITE : COLOURS.BLACK;
    if ([2,7].indexOf(rank) > -1) return (<Piece name={PIECES.PAWN} colour={colour}  />);
    if (['a', 'h'].indexOf(file) > -1) return (<Piece name={PIECES.ROOK} colour={colour} />);
    if (['b', 'g'].indexOf(file) > -1) return (<Piece name={PIECES.KNIGHT} colour={colour} />);
    if (['c', 'f'].indexOf(file) > -1) return (<Piece name={PIECES.BISHOP} colour={colour} />);
    return file === 'd' ? (<Piece name={PIECES.QUEEN} colour={colour} />) : (<Piece name={PIECES.KING} colour={colour} />);
  }
  canSelectPiece(isWhiteTurn, colour) {
    return (isWhiteTurn && colour === COLOURS.WHITE) || (!isWhiteTurn && colour === COLOURS.BLACK);
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
      case PIECES.PAWN:
        return [[1,-1],[1,1],[-1,-1],[-1,1]];
      case PIECES.ROOK:
        return rook
      case PIECES.KNIGHT:
        return [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
      case PIECES.BISHOP:
        return bishop;
      case PIECES.QUEEN:
        return [...bishop, ...rook];
      case PIECES.KING:
        return [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];
      default:
        return null;
    }
  }
}

export default new PieceService();
