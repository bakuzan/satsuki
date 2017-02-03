import React, { Component } from 'react';
import './graveyard.css';

class Graveyard extends Component {
  render() {
    return (
      <div className="graveyard">
        <h4>Graveyard</h4>
        { this.props.pieces }
      </div>
    );
  }
}

export default Graveyard;
