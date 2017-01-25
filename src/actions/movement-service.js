import _helperService from './helper-service';
import _checkService from './check-service';

class MovementService {
  calculatePossibleAttacks(files, squares) {
    return _checkService.discoverSquaresUnderThreat(this, files, squares);
  }
  hasFreePath(from, to, match, squares, files) {
    const hasDiagonalMovement = !(match.files || match.ranks);
    for(let i = 0, length = squares.length; i < length; i++) {
      const square = squares[i];
      if (square.contains === null) continue;
      if (_helperService.isFromSquare(from, square)) continue;
      
      if (hasDiagonalMovement) {
        const fileIndex = files.findIndex(x => x === square.file);
        if (_helperService.isOnDiagonal(fileIndex, from, to, square)) return false;
      } else if (match.files && square.file === to.file) {
        if (_helperService.isBetween(from.rank, to.rank, square.rank)) return false; 
      } else {    
        const fileIndex = files.findIndex(x => x === square.file);
        if (match.ranks && square.rank === to.rank) {
          if (_helperService.isBetween(from.fileIndex, to.fileIndex, fileIndex)) return false;
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
      case 'pawn':
        if (!match.files) return false;
        if (colour === 'white') {
          if (from.rank === 2 && [3,4].indexOf(to.rank) !== -1) return true;
          if (rankDiff === 1 && from.rank < to.rank) return true;
        } else if (colour === 'black') {
          if(from.rank === 7 && [6,5].indexOf(to.rank) !== -1) return true;
          if (rankDiff === 1 && from.rank > to.rank) return true;
        }
        return false;
      case 'rook':
        if (match.files || match.ranks) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case 'knight':
        if (match.files || match.ranks) return false;
        if (rankDiff === 1 && fileDiff === 2) return true; 
        if (rankDiff === 2 && fileDiff === 1) return true;
        return false;
      case 'bishop':
        if (fileDiff === rankDiff) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case 'queen':
        if (match.files || match.ranks) return this.hasFreePath(from, to, match, squares, files);
        if (fileDiff === rankDiff) return this.hasFreePath(from, to, match, squares, files);
        return false;
      case 'king':
        if (match.ranks && fileDiff === 1) return true;
        if (match.files && rankDiff === 1) return true;
        if (rankDiff === 1 && fileDiff === 1) return true;
        return false;
      default:
        return false;
    }
  }
  canTake({ name, colour }, from, to, files, squares) {
    switch(name) {
      case 'pawn':
        const fromIndex = files.findIndex(x => x === from.file);
        const toIndex = files.findIndex(x => x === to.file);
        if (Math.abs(toIndex - fromIndex) === 1 && Math.abs(to.rank - from.rank) === 1) return true;
        return false;
      case 'rook':
      case 'knight':
      case 'bishop':
      case 'queen':
      case 'king':
        return this.canMove({ name, colour }, from, to, files, squares);
      default:
        return false;
    }
  }
  moveToNewPosition(currentBoard, to) {
    const squares = currentBoard.squares.slice();
    const selected = currentBoard.selected;
    const newSquare = squares.find(x => x.rank === to.rank && x.file === to.file);
    const oldSquare = squares.find(x => x.rank === selected.rank && x.file === selected.file);
    newSquare.contains = selected.contains;
    oldSquare.contains = null;
    return squares;
  }
}

export default new MovementService();
