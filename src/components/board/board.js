import React, { Component } from 'react';
import Square from '../square/square';
import Scales from '../scales/scales';
import './board.css';

class Board extends Component {
  renderSquares({ squares, selected, inCheck }) {
    return squares.map((item, index) => {
      item.selected = selected && selected.rank === item.rank && selected.file === item.file;
      item.inCheck = inCheck && inCheck.square.rank === item.rank && inCheck.square.file === item.file;

      return (<Square key={item.id} {...item} handleSelectPiece={this.props.handleSelectPiece} />);
    });
  }
  render() {
    const currentBoard = this.props.currentBoard;
    
    return (
      <div className="chess-board">
        <Scales files={currentBoard.files}
                ranks={currentBoard.ranks} />
        { this.renderSquares(currentBoard) }
      </div>
    );
  }
}

export default Board;
