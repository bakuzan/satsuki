import React, { Component } from 'react';

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
