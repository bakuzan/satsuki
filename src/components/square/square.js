import React, { Component } from 'react';

class Square extends Component {
  handleClick() {
    const squareDetails = this.props;
    this.props.handleSelectPiece(squareDetails);
  }
  render() {
    const selected = this.props.selected ? ' selected' : '';
    return (
      <div className={`square file-${this.props.file} rank-${this.props.rank}${selected}`}
           onClick={ () => this.handleClick() }>
        { this.props.contains }
      </div>
    );
  }
}

export default Square;
