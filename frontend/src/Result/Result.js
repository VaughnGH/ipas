import React, {Component} from 'react';
import $ from 'jquery'

import mydarktheme from './mydarktheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './Result.css'

let key_to_text = {
  start_date: 'Start Date',
  end_date: 'End Date',
  num_pax: 'PAX Count',
  weather: 'Weather',
  avg_distance: 'Average Distance',
  num_vehicles: 'Number of vehicles',
  mre_per_day: 'MRE Per Day',
  ugr_per_day: 'UGR Per Day',
  total_water_req: 'Total Water Required',
  water_per_day: 'Water Per Day',
  total_ugr: "Total UGR Required",
  total_mre: "Total MRE Required",
  total_road_miles: "Total Road Miles",
  num_days: "Duration",
  total_fuel_req: "Total Fuel Required"
}

let units_map = {
  start_date: '',
  end_date: '',
  num_pax: '',
  weather: '',
  avg_distance: 'Mi',
  num_vehicles: '',
  mre_per_day: '',
  ugr_per_day: '',
  total_water_req: 'Gal',
  water_per_day: 'Gal',
  total_ugr: "",
  total_mre: "",
  total_road_miles: "Mi",
  num_days: "",
  total_fuel_req: "Mi"
}

let keys = [
  'start_date',
  'end_date',
  'num_days',
  'num_pax',
  // 'weather',
  // 'avg_distance',
  // 'num_vehicles',
  // 'mre_per_day',
  // 'ugr_per_day',
  'total_water_req',
  'water_per_day',
  'total_ugr',
  'total_mre',
  'total_road_miles',
  'total_fuel_req',
]

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class TableExampleComplex extends Component {
  state = {
    height: '80%',
    loaded: false
  };

  constructor (props) {
    super(props)

  }

  componentDidMount = () => {
    let form_id = this.props.match.params.form_id

    $.getJSON(`/api/v1/get/${form_id}` , (data) => {
      this.setState({
        loaded: true,
        data: data
      })
    })
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };

  constructEmailLink = () => {
    var emailData = "mailto:someone@example.com?Subject=Supply%20Report&Body="
    console.log()
    for (var i in keys){
      var key = keys[i];
      //var spac = 20 - tableData[i]['name'].length
      //emailData += tableData[i]['name'] + "%20".repeat(spac) + "%09" + tableData[i]['status'] + "%0D%0A";
      emailData += key_to_text[key] + "%3A" + "%20%09" + String(this.state.data[key]) + "%0D%0A";
    }
    emailData += "%0D%0A%0D%0A" + "http://ipas.site/#/result/" + this.props.match.params.form_id;
    return emailData
  }

  render() {
    const muiTheme = getMuiTheme(mydarktheme);



    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {this.state.loaded ?
          (
            <div>
            <div className='result-table-container'>

              <Table
                className='result-table'
                height={this.state.height}
              >
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow>
                    <TableHeaderColumn>Category</TableHeaderColumn>
                    <TableHeaderColumn>Value</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                >
                  {keys.map( (key, index) => (
                    <TableRow key={index}>
                      <TableRowColumn>{key_to_text[key]}</TableRowColumn>
                      <TableRowColumn>{this.state.data[key]} {units_map[key]}</TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <br></br>
            <div>
              <center>
                <RaisedButton
                  primary={true}
                  className='send'
                  label="Send Report"
                  href={this.constructEmailLink()}
                />
              </center>
            </div>
          </div>
        )
        :
        (
          <div className='loading'>
            <CircularProgress className='loading-item' size={80} thickness={5} />
            <h1 className='loading-item'>Building table</h1>
          </div>
        )
      }
      </MuiThemeProvider>

    );
  }
}
