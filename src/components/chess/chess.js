import React, { Component } from 'react';
import Board from '../board/board';
import Graveyard from '../graveyard/graveyard';
import ToggleBox from '../toggle-box/toggle-box';
import Rule from '../rule/rule';
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
  handleSpecialRule(option) {
    let history = this.state.history.slice(0);
    history = specialRuleService.applyRule(this.state.specialRule, option, history);
    this.setState({ history: history, specialRule: null });
  }
  handlePieceMovement({ rank, file, contains }) {
    console.log('handle piece movement: ', rank, file, contains);
    let specialRule = null;
    let history = this.state.history.slice(0);
    const current = history[history.length - 1];

    if (current.winner) return;
    if (this.state.specialRule) return;
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
      console.log('current', current);
      const canTake = square.contains && pieceService.canTakePiece(current, square);
      const canMove = !square.contains && pieceService.canMovePiece(current, square);
      if (canTake || canMove) {
        const { squares, graveyard } = movementService.moveToNewPosition(current, { rank, file });
        const { attacks, inCheck, isMate } = checkService.calculatePossibleAttacks(current.files, squares);

        const currentColour = Constants.getPlayerColour(current.isWhiteTurn);
        if (inCheck && inCheck.target.colour === currentColour) return;
        specialRule = specialRuleService.hasPromotion(squares, currentColour);

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

    this.setState({ history: history, specialRule: specialRule });
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
