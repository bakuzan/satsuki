import React, { Component } from 'react';
import SinglePageNav from '../single-page-nav/single-page-nav';
import './single-page-content-wrapper.css';

class SinglePageContentWrapper extends Component {
  render() {
    return (
      <section>
        <SinglePageNav items={this.props.navItems} />
        <div id="single-page-content">
          {
            !!this.props.title &&
            <header>
              <h1>{ this.props.title }</h1>
            </header>
          }
          { this.props.children }
        </div>
      </section>
    );
  }
}

export default SinglePageContentWrapper;
