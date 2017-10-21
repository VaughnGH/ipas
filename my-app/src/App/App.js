import React, { Component } from 'react';

import DatePicker from 'material-ui/DatePicker';

import logo from '../assets/logo.png';
import './App.css';

class App extends Component {



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">IPAS-135</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DatePicker hintText="Start date" />
        <DatePicker hintText="End date" />
      </div>
    );
  }
}

export default App;
