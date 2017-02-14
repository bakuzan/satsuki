import React, { Component } from 'react';
import RuleOption from '../rule-option/rule-option';
import Constants from '../../constants/values';
import './rule.css';

class Rule extends Component {
  constructor() {
    super();

    this.handleUserInput = this.handleUserInput.bind(this);
  }
  selectRuleToRender(rule) {
    switch(rule.name) {
      case Constants.rules.promotion:
        return this.renderPromotion();
      case Constants.rules.castle:
        return this.renderCastle(rule);
      case Constants.rules.enPassant:
        return this.renderEnPassant(rule);
      default:
        return (<p>Unhandled rule!</p>);
    }
  }
  handleUserInput(option) {
    this.props.handleUserInput(option);
  }
  renderEnPassant(rule) {
    const options = [<RuleOption {...item} text="Yes, en passant!" handleUserInput={this.handleUserInput} />];
    return { title: 'Did you want to en passant?', options };
  }
  renderCastle(rule) {
    const options = [
      { text: `${Constants.pieces.king} side`, disabled: !rule.king },
      { text: `${Constants.pieces.queen} side`, disabled: !rule.queen }
    ].map((item, index) => {
      return (
        <RuleOption key={index} {...item} handleUserInput={this.handleUserInput} />
      );
    });
    return { title: 'Did you want to castle:', options };
  }
  renderPromotion() {
    const options = [Constants.pieces.rook, Constants.pieces.knight, Constants.pieces.bishop, Constants.pieces.queen].map((item, index) => {
      return (<RuleOption key={index} text={item} handleUserInput={this.handleUserInput} />);
    });
    return { title: 'Promote your pawn!', options };
  }
  render() {
    const rule = this.selectRuleToRender(this.props.rule);
    return (
      <div id="special-rule" className="column">
        <h4>{ rule.title }</h4>
        <ul>
          { rule.options }
        </ul>
      </div>
    );
  }
}

export default Rule;
