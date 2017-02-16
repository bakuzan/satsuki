import React, { Component } from 'react';
import './single-page-content-wrapper.css';

class SinglePageContentWrapper extends Component {
  render() {
    return (
      <section id="single-page-content">
        { this.props.children }
      </section>
    );
  }
}

export default SinglePageContentWrapper;
