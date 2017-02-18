import React, { Component } from 'react';
import Constants from '../../constants/values';
import './move-list.css';

class MoveList extends Component {
  generatePortableGameNotation(item) {
    let pgn = '';
    if (item.specialRule && item.specialRule.name === Constants.rules.castle) {
      return item.isKingSide ? Constants.pgn.castle.king : Constants.pgn.castle.queen;
    }
    pgn += Constants.pgn.piece[item.piece.name];
    if (item.took) pgn += `${Constants.pgn.capture}`;
    pgn += `${item.to.file}${item.to.rank}`;
    if (item.specialRule && item.specialRule.name === Constants.rules.promotion) {
      pgn += `${Constants.pgn.promotion}${Constants.pgn.piece[item.promoteTo] || ''}`;
    }
    if (item.check.inCheck && !item.check.winner) pgn += Constants.pgn.check;
    if (item.check.inCheck && item.check.winner) pgn += Constants.pgn.checkmate;
    return pgn;
  }
  renderMoveList(moves) {
    const currentMove = this.props.currentMove === null ? moves.length - 1 : this.props.currentMove;
    const viewingPast = !(this.props.currentMove === null);
    return moves.map((item, index) => {
      const moveIndex = viewingPast ? (index + 1) : index;
      const classes = `${currentMove === moveIndex ? 'selected' : ''}${viewingPast ? ' read-only' : ''}`;
      return (
        <li key={index} className={classes}>
          <button type="button" className="button-link" onClick={() => this.props.goToMove(index + 1)}>
            { this.generatePortableGameNotation(item) }
          </button>
        </li>
      );
    });
  }
  render() {
    const moves = this.renderMoveList(this.props.moves);
    return (
      <div id="move-list" className="column">
        <h4>Moves</h4>
        <ul>
          <li className="title">{ Constants.colours.white }</li>
          <li className="title">{ Constants.colours.black }</li>
          { moves }
        </ul>
      </div>
    );
  }
}

export default MoveList;
