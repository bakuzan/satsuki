import React, { Component } from 'react';
import Constants from '../../constants/values';
import './move-list.css';

class MoveList extends Component {
  renderMoveList(moves) {
    return moves.map((item, index) => {
      return (<li key={index}>{ item.png }</li>);
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
