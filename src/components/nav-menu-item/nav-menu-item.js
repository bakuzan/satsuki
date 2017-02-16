import React, { Component } from 'react';

class NavMenuItem extends Component {
  nestedMenuItem(children) {
    return (
      <ul>
        {
          children.map((item, index) => {
            return (<NavMenuItem key={index} {...item} />)
          })
        }
      </ul>
    );
  }
  render() {
    const { id, title, children } = this.props;
    const hasChildren = !!children && !!children.length;

    return (
      <li>
        <a href={`#${id}`}>
          { title }
        </a>
        {
          hasChildren &&
            this.nestedMenuItem(children)
        }
      </li>
    );
  }
}

export default NavMenuItem;
