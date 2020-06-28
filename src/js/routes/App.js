import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';

import Home from './Home';
import Loading from './Loading';

const AsyncDynamicPAge = importedComponent(
  () => import(/* webpackChunkName: "DynamicPage" */ './DynamicPage'),
  {
    LoadingComponent: Loading
  }
);
const AsyncNoMatch = importedComponent(
  () => import(/* webpackChunkName: "NoMatch" */ './NoMatch'),
  {
    LoadingComponent: Loading
  }
);
// const AsyncReadyNoApi = importedComponent(
//   () => import(/* webpackPrefetch: true, webpackChunkName: "ReadyNoApi" */ './ReadyNoApi'),
//   {
//     LoadingComponent: Loading
//   }
// );

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dynamic" component={AsyncDynamicPAge} />
          {/*<Route exact path="/getready" component={AsyncReadyNoApi} />*/}
          <Route component={AsyncNoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
