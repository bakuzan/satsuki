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
}

export default new PieceService();
