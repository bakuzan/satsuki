import React, { Component } from 'react';

class RuleOption extends Component {
  render() {
    const disabled = this.props.disabled || false;
    
    return (
      <li>
        <button type="button" className="button ripple" disabled={ disabled } 
                onClick={() => this.props.handleUserInput(this.props.text)}>
          { this.props.text }
        </button>
      </li>
    );
  }
}

export default RuleOption;
