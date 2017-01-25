import React, { Component } from 'react';
import Board from '../board/board';
import _pieceService from '../../actions/piece-service';
import _movementService from '../../actions/movement-service';
import _helperService from '../../actions/helper-service';
import './chess.css';

class Chess extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        ranks: [8, 7, 6, 5, 4, 3, 2, 1],
        squares: this.buildStartingBoard(Array(64).fill(null)),
        selected: null,
        isWhiteTurn: true,
      }],
      autoReverseBoard: false,
    };

    this.handlePieceMovement = this.handlePieceMovement.bind(this);
  }
  buildStartingBoard(array) {
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
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
        contains: _pieceService.getStartingPiece(number, letter)
      };
    });
  }
  handleAutoReverseBoard(event) {
    const value = event.target.checked;
    console.log(value);
    this.setState({ autoReverseBoard: value });
  }
  handleReverseBoard() {
    this.setState({ history: _helperService.reverseBoard(this.state.history) });
  }
  handlePieceMovement({ rank, file, contains }) {
    console.log('handle piece movement: ', rank, file, contains);
    const history = this.state.history.slice();
    const current = history[history.length - 1];

    if (current.selected === null && !contains) return;
    if (current.selected === null && !_pieceService.canSelectPiece(current.isWhiteTurn,  contains.props.colour)) return;

    const square = current.squares.find(x => x.rank === rank && x.file === file);
    if (current.selected === null) {
      current.selected = square;
    } else if (current.selected === square) {
      current.selected = null;
    } else if (_pieceService.selectAnotherPiece(current.isWhiteTurn, current.selected, square)) {
      current.selected = square;
    } else {
      console.log('current', current)
      const canTake = square.contains && _pieceService.canTakePiece(current, square);
      const canMove = !square.contains && _pieceService.canMovePiece(current, square);
      if (canTake || canMove) {
        const squares = _movementService.moveToNewPosition(current, { rank, file });
        const attacks = _movementService.calculatePossibleAttacks(squares);
        history.push(...[{
          files: current.files,
          ranks: current.ranks,
          squares: squares,
          attacks: attacks,
          selected: null,
          isWhiteTurn: !current.isWhiteTurn,
        }]);
        if (this.state.autoReverseBoard && _helperService.hasCorrectBoardOrientation(current)) {
          history = _helperService.reverseBoard(history);
        }
        console.log('%c NEW HISTORY: ', 'color: red;', history);
      }
    }

    this.setState({ history: history });
  }
  render() {
    const currentBoard = this.state.history[this.state.history.length - 1];
    const currentPlayer = `Current turn: ${currentBoard.isWhiteTurn ? 'white' : 'black'}`;
    return (
      <div id="chess-game" className="row">
        <Board currentBoard={currentBoard}
               handleSelectPiece={this.handlePieceMovement} />
        <div id="game-controls" className="column">
          <p>{ currentPlayer }</p>
          <button onClick={() => this.handleReverseBoard()}>
            reverse board
          </button>
          <label>
            <input type="checkbox" onChange={(e) => this.handleAutoReverseBoard(e)} />
            auto reverse board
          </label>
        </div>
      </div>
    );
  }
}

export default Chess;
