import React, { Component } from 'react';
import NavMenuItem from '../nav-menu-item/nav-menu-item';
import navigationWorm from '../../actions/navigation-worm';
import './single-page-nav.css';

class SinglePageNav extends Component {
  constructor() {
    super();

    this.handleWormUpdate = this.handleWormUpdate.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleWormUpdate, false);
    window.addEventListener('scroll', this.handleWormUpdate, false);
    this.handleWormUpdate();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.handleWormUpdate, false);
    window.removeEventListener('scroll', () => this.handleWormUpdate, false);
  }
  handleWormUpdate() {
    navigationWorm.drawPath(this.nav, this.wormPath);
  }
  renderMenu() {
    const items = this.props.items.map((item, index) => {
      return <NavMenuItem key={index} {...item} />
    });
    return (
      <ul id="nav-list">
        { items }
      </ul>
    );
  }
  render() {
    const menu = this.renderMenu();
    return (
      <nav id="single-page-nav" ref={ (ref) => this.nav = ref }>
        { menu }
        <svg className="worm-marker" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <path ref={ (ref) => this.wormPath = ref }
                stroke="#444"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="0, 0, 0, 1000"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-0.5, -0.5)" />
        </svg>
      </nav>
    );
  }
}

export default SinglePageNav;
