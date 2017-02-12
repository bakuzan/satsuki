import update from 'immutability-helper';
import Constants from '../constants/values';
import helperService from './helper-service';

class MovementService {
  hasFreePath(from, to, match, squares, files) {
    const hasDiagonalMovement = !(match.files || match.ranks);
    for(let i = 0, length = squares.length; i < length; i++) {
      const square = squares[i];
      if (square.contains === null) continue;
      if (helperService.isFromSquare(from, square)) continue;

      if (hasDiagonalMovement) {
        const fileIndex = files.findIndex(x => x === square.file);
        if (helperService.isOnDiagonal(fileIndex, from, to, square)) return false;
      } else if (match.files && square.file === to.file) {
        if (helperService.isBetween(from.rank, to.rank, square.rank)) return false;
      } else {
        const fileIndex = files.findIndex(x => x === square.file);
        if (match.ranks && square.rank === to.rank) {
          if (helperService.isBetween(from.fileIndex, to.fileIndex, fileIndex)) return false;
        }
      }
    }
    return true;
  }
  canMove({ name, colour }, from, to, files, squares) {
    const match = {
      files: from.file === to.file,
      ranks: from.rank === to.rank
    };
    from.fileIndex = files.findIndex(x => x === from.file);
    to.fileIndex = files.findIndex(x => x === to.file);
    const fileDiff = Math.abs(to.fileIndex - from.fileIndex);
    const rankDiff = Math.abs(to.rank - from.rank);

    switch (name) {
      case Constants.pieces.pawn:
        if (!match.files) return false;
        if (colour === Constants.colours.white) {
          if (from.rank === 2 && [3,4].indexOf(to.rank) !== -1) return true;
          if (rankDiff === 1 && from.rank < to.rank) return true;
        } else if (colour === Constants.colours.black) {
          if(from.rank === 7 && [6,5].indexOf(to.rank) !== -1) return true;
          if (rankDiff === 1 && from.rank > to.rank) return true;
        }
        return false;
      case Constants.pieces.rook:
        if (match.files || match.ranks) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case Constants.pieces.knight:
        if (match.files || match.ranks) return false;
        if (rankDiff === 1 && fileDiff === 2) return true;
        if (rankDiff === 2 && fileDiff === 1) return true;
        return false;
      case Constants.pieces.bishop:
        if (fileDiff === rankDiff) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case Constants.pieces.queen:
        if (match.files || match.ranks) return this.hasFreePath(from, to, match, squares, files);
        if (fileDiff === rankDiff) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case Constants.pieces.king:
        if (match.ranks && fileDiff === 1) return true;
        if (match.files && rankDiff === 1) return true;
        if (rankDiff === 1 && fileDiff === 1) return true;
        return false;
      default:
        return false;
    }
  }
  canTake({ name, colour }, from, to, files, squares) {
    const toSquare = squares.find(x => x.file === to.file && x.rank === to.rank);
    if (!toSquare) return false;
    if (toSquare.contains && toSquare.contains.colour === colour) return false;

    switch(name) {
      case Constants.pieces.pawn:
        const fromIndex = files.findIndex(x => x === from.file);
        const toIndex = files.findIndex(x => x === to.file);
        if (Math.abs(toIndex - fromIndex) === 1 && Math.abs(to.rank - from.rank) === 1) return true;
        return false;
      case Constants.pieces.rook:
      case Constants.pieces.knight:
      case Constants.pieces.bishop:
      case Constants.pieces.queen:
      case Constants.pieces.king:
        return this.canMove({ name, colour }, from, to, files, squares);
      default:
        return false;
    }
  }
  moveToNewPosition(currentBoard, to) {
    let squares = currentBoard.squares.slice(0);
    let graveyard = currentBoard.graveyard.slice(0);
    const selected = update(currentBoard.selected, {
      contains: { hasMoved: { $set: true } }
    });
    const newSquareIndex = squares.findIndex(x => x.rank === to.rank && x.file === to.file);
    const newSquare = squares[newSquareIndex];
    const oldSquareIndex = squares.findIndex(x => x.rank === selected.rank && x.file === selected.file);

    if (newSquare.contains) {
      graveyard = update(currentBoard.graveyard, { $push: [newSquare.contains] });
    }
    console.log(newSquareIndex, oldSquareIndex, newSquare, squares[oldSquareIndex]);
    squares = update(squares, { [newSquareIndex]: { contains: { $set: selected.contains } } });
    console.log('squares', squares);
    squares = update(squares, { [oldSquareIndex]: { contains: { $set: null } } });
    return { squares, graveyard };
  }
  updateMoveList(moves, currentBoard, to, check) {
    const squares = currentBoard.squares;
    const selected = currentBoard.selected;
    const newSquare = squares.find(x => x.rank === to.rank && x.file === to.file);
    const oldSquare = squares.find(x => x.rank === selected.rank && x.file === selected.file);
    const latestMove = Object.assign({}, {
      from: { file: oldSquare.file, rank: oldSquare.rank },
      to: { file: newSquare.file, rank: newSquare.rank },
      piece: oldSquare.contains,
      took: newSquare.contains || null,
      check: check
    });
    return update(moves, { $push: [latestMove] });
  }
}

export default new MovementService();
