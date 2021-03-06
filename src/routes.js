import React, { Component } from 'react';
import App from './views/app/app';
import Chess from './components/chess/chess';
import About from './views/about/about';
import HowToPlay from './views/how-to-play/how-to-play';
import PageNotFound from './views/page-not-found/page-not-found';
import Paths from './constants/paths';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Redirect from="/" to={Paths.base} />

        <Route path={Paths.base} component={App}>
          <IndexRoute component={Chess} />

          <Route path={Paths.about} component={About} />
          <Route path={Paths.howToPlay} component={HowToPlay} />
        </Route>

        <Route path="*" component={PageNotFound} />
      </Router>
    );
  }
}

export default Routes;
