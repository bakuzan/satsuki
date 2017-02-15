import React, { Component } from 'react';
import { Link } from 'react-router';
import Paths from '../../constants/paths';
import './about.css';

class About extends Component {
  render() {
    return (
      <article className="about">
        <header>
          <h2>Project SATSUKI</h2>
          <p className="subtitle">Satsuki is a chess application.</p>
        </header>
        <div className="content">
          <p>
            <strong>Chess. No AI.</strong>
            <br />
            If you're new to chess or want to refresh yourself on the rules visit our how to play pages!
            <Link to={`${Paths.base}${Paths.howToPlay}`}>How to play</Link>
          </p>
          <div>
            Currently unsupported features:
            <ul>
              <li>stalemate checking</li>
              <li>resignation</li>
              <li>timer</li>
              <li>move suggestion</li>
            </ul>
          </div>
          <div id="about-links">
            <h4>Pages to visit:</h4>
            <ul>
              <li>
                <Link to={Paths.base}>Home</Link>
                Start a game!
              </li>
            </ul>
          </div>
        </div>
      </article>
    );
  }
}

export default About;
