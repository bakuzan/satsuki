import React, { Component } from 'react';
import Piece from '../piece/piece';

class Square extends Component {
  handleClick() {
    if (this.props.isReadOnly) return;
    const squareDetails = this.props;
    this.props.handleSelectPiece(squareDetails);
  }
  render() {
    const selected = this.props.selected ? ' selected' : '';
    const inCheck = this.props.inCheck ? ' in-check' : '';

    return (
      <div className={`square file-${this.props.file} rank-${this.props.rank}${selected}${inCheck}`}
           onClick={ () => this.handleClick() }>
           {
             !!this.props.contains &&
             <Piece {...this.props.contains} />
           }
      </div>
    );
  }
}

export default Square;
