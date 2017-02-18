import React, { Component } from 'react';
import SinglePageNav from '../single-page-nav/single-page-nav';
import './single-page-content-wrapper.css';

class SinglePageContentWrapper extends Component {
  render() {
    return (
      <section id="single-page-content">
        {
          !!this.props.title &&
          <header>
            <h1>{ this.props.title }</h1>
          </header>
        }
        <SinglePageNav items={this.props.navItems} />
        { this.props.children }
      </section>
    );
  }
}

export default SinglePageContentWrapper;
