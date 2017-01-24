import React, { Component } from 'react';
import SatsukiSvg from '../satsuki-svg/satsuki-svg.js';
import { Link } from 'react-router';
import { paths } from '../../constants/paths';
import './header.css';
import '../../styles/ripple.css';
import '../../styles/box-model.css';

class Header extends Component {
  render() {
    return (
      <div className="satsuki-header center-contents">
        <Link className="ripple" id="satsuki-svg" to={paths.base}>
          <SatsukiSvg />
        </Link>
        <h1>SATSUKI</h1>
        <div id="navigation-links">
          <div className="flex-right center-vertically">
            <Link className="ripple" to={`${paths.base}${paths.about}`}>
              About
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
