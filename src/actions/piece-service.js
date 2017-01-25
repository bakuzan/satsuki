import React from 'react';
import Piece from '../components/piece/piece';
import _movementService from './movement-service';

class PieceService {
  getStartingPiece(rank, file) {
    if ([1,2,7,8].indexOf(rank) === -1) return null;

    const colour = rank < 5 ? 'white' : 'black';
    if ([2,7].indexOf(rank) > -1) return (<Piece name="pawn" colour={colour}  />);
    if (['a', 'h'].indexOf(file) > -1) return (<Piece name="rook" colour={colour} />);
    if (['b', 'g'].indexOf(file) > -1) return (<Piece name="knight" colour={colour} />);
    if (['c', 'f'].indexOf(file) > -1) return (<Piece name="bishop" colour={colour} />);
    return file === 'd' ? (<Piece name="queen" colour={colour} />) : (<Piece name="king" colour={colour} />);
  }
  canSelectPiece(isWhiteTurn, colour) {
    return (isWhiteTurn && colour === 'white') || (!isWhiteTurn && colour === 'black');
  }
  selectAnotherPiece(isWhiteTurn, currentPiece, newSquare) {
    const contains = newSquare.contains;
    return contains && this.canSelectPiece(isWhiteTurn, contains.props.colour);
  }
  canMovePiece({ squares, files, selected: { file, rank, contains: { props } } }, newSquare) {
    return _movementService.canMove(props, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
  }
  canTakePiece({ squares, files, selected: { file, rank, contains: { props } } }, newSquare) {
    return _movementService.canTake(props, { file, rank }, { file: newSquare.file, rank: newSquare.rank }, files, squares);
  }
  getPieceAttackPattern(piece) {
    const rook = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const bishop = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    switch(piece) {
      case 'pawn':
        return [[1,-1],[1,1],[-1,-1],[-1,1]];
      case 'rook':
        return rook
      case 'knight':
        return [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
      case 'bishop':
        return bishop;
      case 'queen':
        return [...bishop, ...rook];
      case 'king':
        return [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];
      default:
        return null;
    }
  }
}

export default new PieceService();
