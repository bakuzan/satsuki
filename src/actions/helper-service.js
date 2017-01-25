class HelperService {
  hasCorrectBoardOrientation({ ranks, isWhiteTurn }) {
    if (isWhiteTurn && ranks[0] === 8) return true;
    if (!isWhiteTurn && ranks[0] === 1) return true;
    return false;
  }
  reverseArray(array) {
    return array.slice().reverse();
  }
  reverseBoard(oldHistory) {
    const history = oldHistory.slice();
    const current = history[history.length - 1];   
    current.squares = this.reverseArray(current.squares);
    current.files = this.reverseArray(current.files);
    current.ranks = this.reverseArray(current.ranks);
    return history;
  }
  isBetween(num1, num2, middleNumber) {
    if (num1 < middleNumber && middleNumber < num2) return true;
    if (num1 > middleNumber && middleNumber > num2) return true;
    return false;
  }
  isOnDiagonal(fileIndex, from, to, square) {
    const fileDiff = Math.abs(fileIndex - from.fileIndex);
    const rankDiff = Math.abs(square.rank - from.rank);
    if (!(fileDiff === rankDiff)) return false;
    if (!this.isBetween(from.rank, to.rank, square.rank)) return false;
    if (!this.isBetween(from.fileIndex, to.fileIndex, fileIndex)) return false;
    return true;
  }
  isFromSquare({ rank, file }, square) {
    return rank === square.rank && file === square.file;
  }
}

export default new HelperService();
