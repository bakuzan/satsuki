import React, { Component } from 'react';
import Piece from '../piece/piece';
import './graveyard.css';

class Graveyard extends Component {
  renderTheDead(pieces) {
    return pieces.map(item => {
      return (<Piece {...item} />);
    });
  }
  render() {
    const pieces = this.renderTheDead(this.props.pieces);
    return (
      <div className="graveyard">
        <h4>Graveyard</h4>
        { pieces }
      </div>
    );
  }
}

export default Graveyard;
