import _helperService from './helper-service';

class BoardService {
  hasCorrectBoardOrientation({ ranks, isWhiteTurn }) {
    if (isWhiteTurn && ranks[0] === 8) return true;
    if (!isWhiteTurn && ranks[0] === 1) return true;
    return false;
  }
  reverseBoard(oldHistory) {
    const history = oldHistory.slice();
    const current = history[history.length - 1];   
    current.squares = _helperService.reverseArray(current.squares);
    current.files = _helperService.reverseArray(current.files);
    current.ranks = _helperService.reverseArray(current.ranks);
    return history;
  }
}

export default new BoardService();
