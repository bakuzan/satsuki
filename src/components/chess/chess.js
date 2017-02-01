import React, { Component } from 'react';
import Board from '../board/board';
import Graveyard from '../graveyard/graveyard';
import ToggleBox from '../toggle-box/toggle-box';
import helperService from '../../actions/helper-service';
import pieceService from '../../actions/piece-service';
import movementService from '../../actions/movement-service';
import boardService from '../../actions/board-service';
import checkService from '../../actions/check-service';
import Constants from '../../constants/values';
import './chess.css';

class Chess extends Component {
  constructor() {
    super();
    this.state = boardService.initalGameState();

    this.handlePieceMovement = this.handlePieceMovement.bind(this);
    this.handleAutoReverseBoard = this.handleAutoReverseBoard.bind(this);
  }
  handleNewGame() {
    this.setState(boardService.initalGameState());
  }
  handleAutoReverseBoard(name, value) {
    this.setState({ [name]: value });
  }
  handleReverseBoard() {
    this.setState({ history: boardService.reverseBoard(this.state.history) });
  }
  handlePieceMovement({ rank, file, contains }) {
    console.log('handle piece movement: ', rank, file, contains);
    let history = this.state.history.slice();
    const current = history[history.length - 1];

    if (current.selected === null && !contains) return;
    if (current.selected === null && !pieceService.canSelectPiece(current.isWhiteTurn,  contains.props.colour)) return;

    const square = current.squares.find(x => x.rank === rank && x.file === file);
    if (current.selected === null) {
      current.selected = square;
    } else if (current.selected === square) {
      current.selected = null;
    } else if (pieceService.selectAnotherPiece(current.isWhiteTurn, current.selected, square)) {
      current.selected = square;
    } else {
      const nextStep = helperService.deepCopy(current);
      console.log('current', nextStep);
      const canTake = square.contains && pieceService.canTakePiece(nextStep, square);
      const canMove = !square.contains && pieceService.canMovePiece(nextStep, square);
      if (canTake || canMove) {
        let squares = movementService.moveToNewPosition(current, { rank, file });
        const { attacks, inCheck, isMate } = checkService.calculatePossibleAttacks(nextStep.files, squares);

        if (inCheck && inCheck.target.colour === Constants.getPlayerColour(nextStep.isWhiteTurn)) return;

        history.push(...[{
          files: nextStep.files,
          ranks: nextStep.ranks,
          squares: squares,
          attacks: attacks,
          selected: null,
          isWhiteTurn: !nextStep.isWhiteTurn,
          inCheck: inCheck,
          winner: inCheck && isMate,
        }]);

        if (this.state.autoReverseBoard && boardService.hasCorrectBoardOrientation(nextStep)) {
          history = boardService.reverseBoard(history);
        }
        console.log('%c NEW HISTORY: ', 'color: red;', history);
      }
    }

    this.setState({ history: history });
  }
  render() {
    const currentBoard = this.state.history[this.state.history.length - 1];
    const currentAutoReverse = `Auto reverse: ${Constants.getAutoReverseBoard(this.state.autoReverseBoard)}`;
    let status;
    if (currentBoard.winner) {
      status = `Winner: ${currentBoard.inCheck.attacker.colour}`
    } else {
       status = `Current turn: ${Constants.getPlayerColour(currentBoard.isWhiteTurn)}`;
    }
    
    return (
      <div id="chess-game" className="row">
        <Graveyard pieces={currentBoard.graveyard} />
        <Board currentBoard={currentBoard}
               handleSelectPiece={this.handlePieceMovement} />
        <div id="game-controls" className="column">
          {
            currentBoard.winner &&
            <button onClick={() => this.handleNewGame()}>
              new game
            </button>
          }
          <p>{ status }</p>
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
