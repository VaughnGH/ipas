import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App/App';
import Result from './Result/Result'

import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  HashRouter as Router,
  Route
} from 'react-router-dom'

import createMemoryHistory from 'history/createMemoryHistory'
const history = createMemoryHistory()


ReactDOM.render(
  <Router history={history}>
		<MuiThemeProvider>
			<div>
	      <Route exact path="/" component={App}/>
	      <Route path="/result/:form_id" component={Result}/>
      </div>
		</MuiThemeProvider>
	</Router>, 
	document.getElementById('root'));

registerServiceWorker();
injectTapEventPlugin();
