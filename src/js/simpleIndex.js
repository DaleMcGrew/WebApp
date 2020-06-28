// import { hot } from "react-hot-loader";
// import React from "react";
// import { render } from 'react-dom';
// import App from "./routes/App";
//
// // import "./index.css";
//
// const modifiedRender = (Component) =>
//   render(Component, document.getElementById("root"));
//
// modifiedRender(hot(module)(App));
// render(App);

import React from 'react';
// import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import App from './routes/App';

console.log('simpleIndex');

render(<App />, document.getElementById('root'));
