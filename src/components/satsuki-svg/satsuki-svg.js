import React, { Component } from 'react';
import './satsuki-svg.css';

class SatsukiSvg extends Component {
  render() {
    return (
      <svg className="satsuki-svg" viewBox="-20 -60 80 80" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg">
        <text className="letter hideshow" x="-3" y="-0">
          S
        </text>
        <text className="letter hideshow" x="-3" y="-0">
          A
        </text>
        <text className="letter hideshow" x="-2" y="-0">
          T
        </text>
        <text className="letter hideshow" x="-4" y="-0">
          S
        </text>
        <text className="letter hideshow" x="-4" y="-0">
          U
        </text>
        <text className="letter hideshow" x="-6" y="-0">
          K
        </text>
        <text className="letter hideshow" x="10" y="-0">
          I
        </text>
        <text id="word" className="diagonal" x="-0" y="-0">
          SATSUKI
        </text>
      </svg>
    );
  }
}

export default SatsukiSvg;
