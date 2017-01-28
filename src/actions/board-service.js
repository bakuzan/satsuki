import { files } from '../constants/values';
import pieceService from './piece-service';
import helperService from './helper-service';

class BoardService {
  buildStartingBoard(array) {
    let letters = files.slice();
    let lastIndex = -1;
    return array.map((item, index) => {
      const number = 8 - Math.floor(index / 8);
      const letterIndex = (index + number) % 8;
      if (letterIndex === lastIndex) {
        letters.push(letters.shift());
        lastIndex = -1;
      }

      const letter = letters[letterIndex];
      lastIndex = letterIndex;
      return {
        id: index,
        rank: number,
        file: letter,
        contains: pieceService.getStartingPiece(number, letter)
      };
    });
  }
  hasCorrectBoardOrientation({ ranks, isWhiteTurn }) {
    if (isWhiteTurn && ranks[0] === 8) return true;
    if (!isWhiteTurn && ranks[0] === 1) return true;
    return false;
  }
  reverseBoard(oldHistory) {
    const history = oldHistory.slice();
    const current = history[history.length - 1];
    current.squares = helperService.reverseArray(current.squares);
    current.files = helperService.reverseArray(current.files);
    current.ranks = helperService.reverseArray(current.ranks);
    return history;
  }
}

export default new BoardService();
