import React, { Component } from 'react';
import Constants from '../../constants/values';
import './rule.css';

class Rule extends Component {
  selectRuleToRender(rule) {
    switch(rule.name) {
      case Constants.rules.promotion:
        return this.renderPromotion();
      default:
        return (<p>Unhandled rule!</p>);
    }
  }
  handleUserInput(option) {
    this.props.handleUserInput(option);
  }
  renderPromotion() {
    const options = [Constants.pieces.rook, Constants.pieces.knight, Constants.pieces.bishop, Constants.pieces.queen].map((item, index) => {
      return (<li key={index} onClick={() => this.handleUserInput(item)}>{ item }</li>);
    });
    return (
      <div id="promotion-dialog" className="column">
        <h4>Promote your pawn!</h4>
        <ul>
          { options }
        </ul>
      </div>
    );
  }
  render() {
    const rule = this.selectRuleToRender(this.props.rule);
    return (
      <div id="special-rule" className="column">
        { rule }
      </div>
    );
  }
}

export default Rule;
