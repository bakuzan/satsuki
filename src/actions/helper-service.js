class HelperService {
  reverseArray(array) {
    return array.slice().reverse();
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
