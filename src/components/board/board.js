import React, { Component } from 'react';
import Square from '../square/square';
import Scales from '../scales/scales';
import './board.css';

class Board extends Component {
  renderSquares(currentBoard, selected) {
    return currentBoard.map((item, index) => {
      item.selected = (
        selected && selected.rank === item.rank && selected.file === item.file
      );
      return (<Square {...item} handleSelectPiece={this.props.handleSelectPiece} />);
    });
  }
  render() {
    const currentBoard = this.props.currentBoard;
    return (
      <div className="chess-board">
        <Scales files={currentBoard.files}
                ranks={currentBoard.ranks} />
        { this.renderSquares(currentBoard.squares, currentBoard.selected) }
      </div>
    );
  }
}

export default Board;
