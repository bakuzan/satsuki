import React, { Component } from 'react';
import Board from '../board/board';
import Graveyard from '../graveyard/graveyard';
import ToggleBox from '../toggle-box/toggle-box';
import Rule from '../rule/rule';
import MoveList from '../move-list/move-list';
import pieceService from '../../actions/piece-service';
import movementService from '../../actions/movement-service';
import boardService from '../../actions/board-service';
import checkService from '../../actions/check-service';
import specialRuleService from '../../actions/special-rule-service';
import Constants from '../../constants/values';
import './chess.css';

class Chess extends Component {
  constructor() {
    super();
    this.state = boardService.initalGameState();

    this.handlePieceMovement = this.handlePieceMovement.bind(this);
    this.handleAutoReverseBoard = this.handleAutoReverseBoard.bind(this);
    this.handleSpecialRule = this.handleSpecialRule.bind(this);
    this.handlePreviousMoveViewing = this.handlePreviousMoveViewing.bind(this);
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
  handlePreviousMoveViewing(index) {
    const newIndex = index === (this.state.history.length - 1) ? null : index;
    console.log('previous move: ', index, newIndex);
    this.setState({ moveIndex: newIndex });
  }
  handleSpecialRule(option) {
    const { history, moves } = specialRuleService.applyRule(this.state, option);
    this.setState({ history: history, specialRule: null, moves: moves });
  }
  handleSelectPiece(current, square, currentColour) {
    current.selected = square;
    return specialRuleService.canCastle(current, square, currentColour);
  }
  handlePieceMovement({ rank, file, contains }) {
    console.log('handle piece movement: ', rank, file, contains);
    let specialRule = null;
    let moves = this.state.moves.slice(0);
    let history = this.state.history.slice(0);
    const current = history[history.length - 1];
    const currentColour = Constants.getPlayerColour(current.isWhiteTurn);

    if (current.winner) return;
    if (this.state.specialRule && this.state.specialRule.name === Constants.rules.promotion) return;
    if (current.selected === null && !contains) return;
    if (current.selected === null && !pieceService.canSelectPiece(current.isWhiteTurn,  contains.colour)) return;

    const square = current.squares.find(x => x.rank === rank && x.file === file);
    if (current.selected === null) {
      specialRule = this.handleSelectPiece(current, square, currentColour);
    } else if (current.selected === square) {
      current.selected = null;
    } else if (pieceService.selectAnotherPiece(current.isWhiteTurn, current.selected, square)) {
      specialRule = this.handleSelectPiece(current, square, currentColour);
    } else {
      console.log('current', current);
      const canTake = square.contains && pieceService.canTakePiece(current, square);
      const canMove = !square.contains && pieceService.canMovePiece(current, square);
      if (canTake || canMove) {
        const { squares, graveyard } = movementService.moveToNewPosition(current, { rank, file });
        const { attacks, inCheck, isMate } = checkService.calculatePossibleAttacks(current.files, squares);

        if (inCheck && inCheck.target.colour === currentColour) return;
        specialRule = specialRuleService.hasPromotion(squares, currentColour);
        moves = movementService.updateMoveList(moves, current, { rank, file }, { inCheck, isMate }, specialRule);

        history.push({
          files: current.files.slice(0),
          ranks: current.ranks.slice(0),
          squares: squares,
          graveyard: graveyard,
          attacks: attacks,
          selected: null,
          isWhiteTurn: !current.isWhiteTurn,
          inCheck: inCheck,
          winner: inCheck && isMate,
        });

        if (this.state.autoReverseBoard && boardService.hasCorrectBoardOrientation(current)) {
          history = boardService.reverseBoard(history);
        }
        console.log('%c NEW HISTORY: ', 'color: red;', history);
      }
    }

    this.setState({ history: history, specialRule: specialRule, moves: moves });
  }
  render() {
    const boardIndex = this.state.moveIndex || this.state.history.length - 1;
    const currentBoard = this.state.history[boardIndex];
    const currentAutoReverse = `Auto reverse: ${Constants.getAutoReverseBoard(this.state.autoReverseBoard)}`;
    let status;
    if (currentBoard.winner) {
      status = `Winner: ${currentBoard.inCheck.attacker.colour}`
    } else {
       status = `Current turn: ${Constants.getPlayerColour(currentBoard.isWhiteTurn)}`;
    }
    console.log('render chess: ', this.state, this.state.history);
    return (
      <div id="chess-game" className="row">
        <Graveyard pieces={currentBoard.graveyard} />
        <MoveList moves={this.state.moves} goToMove={this.handlePreviousMoveViewing} />
        <Board currentBoard={currentBoard}
               isReadOnly={this.state.moveIndex !== null}
               handleSelectPiece={this.handlePieceMovement} />
        {
          !this.state.specialRule &&
          <div id="game-controls" className="column">
            {
              currentBoard.winner &&
              <button className="button primary ripple" onClick={() => this.handleNewGame()}>
                new game
              </button>
            }
            <p>{ status }</p>
            <button className="button ripple" onClick={() => this.handleReverseBoard()}>
              reverse board
            </button>
            <ToggleBox name="autoReverseBoard"
                       text={currentAutoReverse}
                       isChecked={this.state.autoReverseBoard}
                       handleChange={this.handleAutoReverseBoard} />
          </div>
        }
        {
          !!this.state.specialRule &&
          <Rule rule={this.state.specialRule} handleUserInput={this.handleSpecialRule} />
        }
      </div>
    );
  }
}

export default Chess;
