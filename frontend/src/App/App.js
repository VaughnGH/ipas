import React, { Component } from 'react';
import classNames from 'classnames'
import $ from 'jquery'

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
import Divider from 'material-ui/Divider';

import logo from '../assets/logo.png';
import './App.css';

const styles = {
  margin: 6,
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


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

  setstart_date = (data: undefined, date: object) => {
    this.setState({start_date: formatDate(date)})
  }
  setend_date = (data:undefined, date: object) => {
    this.setState({end_date: formatDate(date)})
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


    if (this.state.start_date === null || this.state.end_date === null ||
        typeof this.state.start_date === 'undefined' || typeof this.state.end_date === 'undefined' )
      newState['dialog_error'] = 'Fill out out start date and end date information'
    else if (this.state.end_date < this.state.start_date)
      newState['dialog_error'] = 'The start date needs to be earlier than the end date'

    if (Object.keys(newState).length !== 0)
      this.setState(newState, () => {

        if (newState['dialog_error'] !== null) {
          window.scrollTo(0,0)
          this.handleOpen()
        }
      })
    else {
      let data = {
        start_date: parseInt(this.state.start_date, 10),
        end_date: parseInt(this.state.end_date, 10),
        num_pax: parseInt(this.state.num_pax, 10),
        weather: this.state.weather,
        avg_distance: parseFloat(this.state.avg_distance, 10),
        num_vehicles: parseInt(this.state.num_vehicles, 10),
        mre_per_day: parseInt(this.state.mre_per_day, 10),
        ugr_per_day: parseInt(this.state.ugr_per_day, 10)
      }

      data = JSON.stringify(data)

      let http = window.location.protocol
      let host = window.location.hostname
      let endpoint = `${http}//${host}:80/api/v1/form` 

      $.ajax({
        type: "POST",
        url: '/api/v1/form',
        data: data,
        success: () => { console.log('sexy as fuck') },
        dataType: 'json',
        settings: {
          contentType: 'application/json; charset=UTF-8'
        }
      });
    }

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
              <DatePicker onChange={this.setstart_date} hintText="Start date" />
            }
          />
          <ListItem
            className='form-input date-input'
            children={
              <DatePicker onChange={this.setend_date} hintText="End date" />
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
        <Divider style={{marginBottom: '30px', marginTop: '30px', width: '80%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}/>
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
        <br></br>
        <center>
        <p> &copy; 2017 </p>
        </center>
        <br></br>
      </div>

    );
  }
}

export default App;
