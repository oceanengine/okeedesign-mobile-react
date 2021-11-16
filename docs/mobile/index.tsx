import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { HashRouter } from 'react-router-dom'

import App from './App'
import routes, { RouteType } from './routes'

import { LocaleContext } from '../../src/index'
import local from '../../src/locale/zh-CN'

import Stats from 'stats.js';

ReactDOM.render(
  <HashRouter>
    <LocaleContext.Provider value={local}>
      <App>
        {
          routes.map((route: RouteType, index: number) => (
            <Route
              key={index}
              path={route.path}
              component={route.component}
            />
          ))
        }
      </App>
    </LocaleContext.Provider>
  </HashRouter>,
  document.getElementById('root')
)



// const stats = new Stats();
// stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

// function animate() {

//   stats.begin();

//   // monitored code goes here

//   stats.end();

//   requestAnimationFrame( animate );

// }

// requestAnimationFrame( animate );