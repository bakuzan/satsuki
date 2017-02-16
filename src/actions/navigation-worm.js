import Constants from '../constants/values';

class NavigationWorm {
  constructor() {
    this.pathLength = null;
  }
  drawPath(nav, wormPath) {
    let navItems = [].slice.call(nav.querySelectorAll('li'));

    // Cache element references and measurements
    navItems = navItems.map(item => {
      const anchor = item.querySelector('a');
      const target = document.getElementById(anchor.getAttribute('href').slice(1));
      return {
        listItem: item,
        anchor: anchor,
        target: target
      };
    });

    // Remove missing targets
    navItems = navItems.filter(item => !!item.target);
    const path = [];
    let pathIndent;

    navItems.forEach((item, i) => {
      const x = item.anchor.offsetLeft - 5;
      const y = item.anchor.offsetTop;
      const height = item.anchor.offsetHeight;

      if (i === 0) {
        path.push('M', x, y, 'L', x, y + height);
        item.pathStart = 0;
      } else {
        // Draw an additional line when there's a change in
        // indent levels
        if(pathIndent !== x) path.push('L', pathIndent, y);
        path.push('L', x, y);

        // Set the current path so that we can measure it
        wormPath.setAttribute('d', path.join(' '));
        item.pathStart = wormPath.getTotalLength() || 0;
        path.push('L', x, y + height);
      }

      pathIndent = x;
      wormPath.setAttribute('d', path.join(' '));
      item.pathEnd = wormPath.getTotalLength();
    });

    this.pathLength = wormPath.getTotalLength();
    return this.sync(navItems, wormPath);
  }
  sync(navItems, wormPath) {
    const windowHeight = window.innerHeight;
    let pathStart = this.pathLength;
    let pathEnd = 0;
    let visibleItems = 0;
    console.log(navItems);
    navItems.forEach(item => {
      const targetBounds = item.target.getBoundingClientRect();

      if(targetBounds.bottom > windowHeight * Constants.worm.topMargin && targetBounds.top < windowHeight * (1 - Constants.worm.bottomMargin)) {
        pathStart = Math.min(item.pathStart, pathStart);
        pathEnd = Math.max(item.pathEnd, pathEnd);
        visibleItems += 1;
        item.listItem.classList.add('visible');
      } else {
        item.listItem.classList.remove('visible');
      }
    });

    // Specify the visible path or hide the path altogether
    // if there are no visible items
    if(visibleItems > 0 && pathStart < pathEnd) {
      wormPath.setAttribute('stroke-dashoffset', '1');
      wormPath.setAttribute('stroke-dasharray', '1, '+ pathStart +', '+ (pathEnd - pathStart) +', ' + this.pathLength);
      wormPath.setAttribute('opacity', 1);
    } else {
      wormPath.setAttribute('opacity', 0);
    }
  }
}

export default new NavigationWorm();
