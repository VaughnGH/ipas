import React, { Component } from 'react';
import classNames from 'classnames'

import mydarktheme from './mydarktheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import logo from '../assets/logo.png';
import './App.css';

const styles = {
  margin: 6,
};

class App extends Component {

  state = {
    open: false,
    start_date: null,
    end_date: null,
    num_pax: null,
    num_pax_error:'',
    weather: null,
    avg_distance: null,
    avg_distance_error: '',
    num_vehicles: null,
    num_vehicles_error: '',
    mre_per_day: null,
    mre_per_day_error: '',
    ugr_per_day: null,
    ugr_per_day_error: '',
    dialog_error: ''
  }

  setStartDate = (data: undefined, date: object) => {
    this.setState({startDate: date.getTime()/1000})
  }
  setEndDate = (data:undefined, date: object) => {
    this.setState({endDate: date.getTime()/1000})
  }

  handleOpen = () => this.setState({open: true})
  handleClose = () => this.setState({open: false})

  setTemperature = (weather) => this.setState({weather: weather})

  submit = () => {
    let newState = {}

    if (this.state.num_pax === null || this.state.num_pax === '')
      newState['num_pax_error'] = 'Fill with positive Pax count'
    if (this.state.avg_distance === null || this.state.avg_distance === '')
      newState['avg_distance_error'] = 'Fill average distance traveled'
    if (this.state.num_vehicles === null || this.state.num_vehicles === '')
      newState['num_vehicles_error'] = 'Fill number of vehicles needed'
    if (this.state.mre_per_day === null || this.state.mre_per_day === '')
      newState['mre_per_day_error'] = 'Fill number of MRE needed'
    if (this.state.ugr_per_day === null || this.state.ugr_per_day === '')
      newState['ugr_per_day_error'] = 'Fill number of UGR needed'

    if (this.state.weather === null)
      newState['dialog_error'] = 'Pick the temperature of the location that will be planned for'


    if (this.state.startDate === null || this.state.endDate === null ||
        typeof this.state.startDate === 'undefined' || typeof this.state.endDate === 'undefined' )
      newState['dialog_error'] = 'Fill out out start date and end date information'
    else if (this.state.endDate < this.state.startDate)
      newState['dialog_error'] = 'The start date needs to be earlier than the end date'

    if (Object.keys(newState).length !== 0)
      this.setState(newState, () => {

        if (newState['dialog_error'] !== null) {
          window.scrollTo(0,0)
          this.handleOpen()
        }
      })

  }

  temperatureButtons = () => {
    return [
              {temp: 'Cold', color: '#61a8ff'},
              {temp: 'Mild', color: '#ffba0a'},
              {temp: 'Hot', color: '#ff6161'}
            ].map( temp_object => {

              let classes =
                this.state.weather !== null && this.state.weather === temp_object.temp ?
                ['temperature-button', 'active'] :
                ['temperature-button']

              return <RaisedButton
                        className={classNames(classes)}
                        style={styles}
                        label={temp_object.temp}
                        onClick={() => this.setTemperature(temp_object.temp)}
                        backgroundColor={temp_object.color}
                        labelColor="#fff"
                        />
            })

  }

  saveInfo = (key, value) => {
    let newState = {
      ugr_per_day_error: '',
      mre_per_day_error: '',
      num_pax_error: '',
      num_vehicles_error: '',
      avg_distance_error: '',
      [key]: value
    }

    this.setState(newState)
  }

  render() {
    const actions =
      <FlatButton
        label="Ok"
        primary={true}
        onClick={this.handleClose}
      />

      const muiTheme = getMuiTheme(mydarktheme);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">IPAS-135</h1>
        </header>
        <MuiThemeProvider muiTheme={muiTheme}>

        <List className='form'>
          <Subheader>Date</Subheader>
          <ListItem
            className='form-input date-input'
            children={
              <DatePicker onChange={this.setStartDate} hintText="Start date" />
            }
          />
          <ListItem
            className='form-input date-input'
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
                onChange={(event: object, newValue: string) => this.saveInfo('num_pax', newValue)}
                errorText={this.state.num_pax_error}
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
                onChange={(event: object, newValue: string) => this.saveInfo('avg_distance', newValue)}
                errorText={this.state.avg_distance_error}
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
                onChange={(event: object, newValue: string) => this.saveInfo('num_vehicles', newValue)}
                errorText={this.state.num_vehicles_error}
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
                onChange={(event: object, newValue: string) => this.saveInfo('mre_per_day', newValue)}
                errorText={this.state.mre_per_day_error}
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
                onChange={(event: object, newValue: string) => this.saveInfo('ugr_per_day', newValue)}
                errorText={this.state.ugr_per_day_error}
              />
            }
          />
        </List>
        </MuiThemeProvider>

        <div className='temperature-input'>
          {this.temperatureButtons()}
        </div>

        <div>
          <RaisedButton
            primary={true}
            className='submit'
            label="Submit Plan"
            onClick={this.submit}
          />
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.state.dialog_error}
        </Dialog>
      </div>
    );
  }
}

export default App;
