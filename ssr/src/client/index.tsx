/**
 * client index 
 */
import React from 'react';
import ReactDom from 'react-dom'
import App from './App'

import '../../../src/index.less';

ReactDom.hydrate(
  <App />,
  document.getElementById('root')
)