import React, { Component } from 'react';
import Board from '../board/board';
import ToggleBox from '../toggle-box/toggle-box';
import _pieceService from '../../actions/piece-service';
import _movementService from '../../actions/movement-service';
import _helperService from '../../actions/helper-service';
import _boardService from '../../actions/board-service';
import * as Values from '../../constants/values';
import './chess.css';

class Chess extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        attacks: [],
        files: Values.files,
        ranks: Values.ranks,
        squares: _boardService.buildStartingBoard(Array(64).fill(null)),
        selected: null,
        isWhiteTurn: true,
      }],
      autoReverseBoard: false,
    };

    this.handlePieceMovement = this.handlePieceMovement.bind(this);
    this.handleAutoReverseBoard = this.handleAutoReverseBoard.bind(this);
  }
  handleAutoReverseBoard(name, value) {
    this.setState({ [name]: value });
  }
  handleReverseBoard() {
    this.setState({ history: _boardService.reverseBoard(this.state.history) });
  }
  handlePieceMovement({ rank, file, contains }) {
    console.log('handle piece movement: ', rank, file, contains);
    let history = this.state.history.slice();
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
        const attacks = _movementService.calculatePossibleAttacks(current.files, squares);
        history.push(...[{
          files: current.files,
          ranks: current.ranks,
          squares: squares,
          attacks: attacks,
          selected: null,
          isWhiteTurn: !current.isWhiteTurn,
        }]);
        if (this.state.autoReverseBoard && _boardService.hasCorrectBoardOrientation(current)) {
          history = _boardService.reverseBoard(history);
        }
        console.log('%c NEW HISTORY: ', 'color: red;', history);
      }
    }

    this.setState({ history: history });
  }
  render() {
    const currentBoard = this.state.history[this.state.history.length - 1];
    const currentPlayer = `Current turn: ${currentBoard.isWhiteTurn ? 'white' : 'black'}`;
    const currentAutoReverse = `Auto reverse: ${this.state.autoReverseBoard ? 'ON' : 'OFF' }`;
    return (
      <div id="chess-game" className="row">
        <Board currentBoard={currentBoard}
               handleSelectPiece={this.handlePieceMovement} />
        <div id="game-controls" className="column">
          <p>{ currentPlayer }</p>
          <button onClick={() => this.handleReverseBoard()}>
            reverse board
          </button>
          <ToggleBox name="autoReverseBoard"
                     text={currentAutoReverse}
                     isChecked={this.state.autoReverseBoard}
                     handleChange={this.handleAutoReverseBoard} />
        </div>
      </div>
    );
  }
}

export default Chess;
