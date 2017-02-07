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
            Chess. No AI. Reversable view of the table.
            Optional move suggestion mode, turn timer and anything else that enters my head to be developed.
          </p>
          <p>
            Partial support:
            <ul>
              <li>promotion</li>
            </ul>
          </p>
          <p>
            Currently unsupported features:
            <ul>
              <li>castling</li>
              <li>en passant</li>
              <li>stalemate checking</li>
            </ul>
          </p>
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
