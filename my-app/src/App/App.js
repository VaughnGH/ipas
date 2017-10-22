import React, { Component } from 'react';

import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import logo from '../assets/logo.png';
import './App.css';

const styles = {
  margin: 6,
};

class App extends Component {

  state = {}

  setStartDate = (data: undefined, date: object) => {
    this.setState({startDate: date.getTime()/1000})
  }
  setEndDate = (data:undefined, date: object) => {
    this.setState({endDate: date.getTime()/1000})
  }

  setTemperature = (temperature) => this.setState({temperature: temperature})

  submit = () => {
    console.log(this.state)
  }

  temperatureButtons = () => {
    return [
              {temp: 'Cold', color: 'blue'},
              {temp: 'Mild', color: 'grey'},
              {temp: 'Hot', color: 'red'}
            ].map( temp_object => {
              return <RaisedButton
                        label={temp_object.temp}
                        onClick={() => this.setTemperature(temp_object.temp)}
                        />
            })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">IPAS-135</h1>
        </header>

        <div className='form'>
        <List>
          <Subheader>Date</Subheader>
          <ListItem
            className='form-input'
            children={
              <DatePicker onChange={this.setStartDate} hintText="Start date" />
            }
          />
          <ListItem
            className='form-input'
            children={
              <DatePicker onChange={this.setEndDate} hintText="End date" />
            }
          />
          <Subheader>Logistics</Subheader>
          <ListItem
            className='form-input'
            children={
              <TextField
                floatingLabelText='Total PAX Estimate'
                hintText="Amount of personnel attending"
                type="number"
                min="0"
              />
            }
          />
          <ListItem
            className='form-input'
            children={
              <TextField
                floatingLabelText="Average distance traveled per day"
                hintText="Miles traveled per day"
                type="number"
                min="0"
              />
            }
          />
          <ListItem
            className='form-input'
            children={
              <TextField
                floatingLabelText="Total number of vehicles"
                type="number"
                min="0"
              />
            }
          />
          <ListItem
            className='form-input'
            children={
              <TextField
                floatingLabelText="Daily MRE count"
                hintText="MREs needed per person per day"
                type="number"
                min="0"
              />
            }
          />
          <ListItem
            className='form-input'
            children={
              <TextField
                floatingLabelText="UGR count"
                hintText="UGRs needed per person per day"
                type="number"
                min="0"
              />
            }
          />
        </List>
        </div>

        <div>
          <RaisedButton
            primary={true}
            className='submit'
            label="Submit Plan"
            onClick={this.submit}
          />
        </div>

      </div>
    );
  }
}

export default App;
