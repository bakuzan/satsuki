import React, { Component } from 'react';
import { Link } from 'react-router';
import { paths } from '../../constants/paths';
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
            Currently unsupported features:
            <ul>
              <li>check</li>
              <li>check-mate</li>
              <li>castling</li>
              <li>en passant</li>
              <li>promotion</li>
              <li>stalemate checking</li>
            </ul>
          </p>
          <div id="about-links">
            <h4>Pages to visit:</h4>
            <ul>
              <li>
                <Link to={paths.base}>Home</Link>
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
