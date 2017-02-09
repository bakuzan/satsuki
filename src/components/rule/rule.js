import React, { Component } from 'react';
import RuleOption from '../rule-option/rule-option';
import Constants from '../../constants/values';
import './rule.css';

class Rule extends React.Component {
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
      default:
        return (<p>Unhandled rule!</p>);
    }
  }
  handleUserInput(option) {
    this.props.handleUserInput(option);
  }
  renderCastle(rule) {
    const options = [
      { text: `${Constants.pieces.king} side`, disabled: !rule.king }, 
      { text: `${Constants.pieces.queen} side`, disabled: !rule.queen }
    ].map((item, index) => {
      return (
        <RuleOption {...item} handleUserInput={this.handleUserInput} />
      );  
    });
    return { title: 'Did you want to castle:', options };
  }
  renderPromotion() {
    const options = [Constants.pieces.rook, Constants.pieces.knight, Constants.pieces.bishop, Constants.pieces.queen].map((item, index) => {
      return (<RuleOption text={item} handleUserInput={this.handleUserInput} />);  
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
