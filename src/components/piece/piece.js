import React, { Component } from 'react';
import './piece.css';

class Piece extends React.Component {
  render() {
    return (<div className={`piece ${this.props.colour}-${this.props.name}`}></div>);
  }
}

export default Piece;
