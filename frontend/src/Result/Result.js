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

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];

let key_to_text = {
  start_date: 'Start Date',
  end_date: 'End Date',
  num_pax: 'PAX Count',
  weather: 'Weather',
  avg_distance: 'Average Distance',
  num_vehicles: 'Number of vehicles',
  mre_per_day: 'MRE Per Day',
  ugr_per_day: 'UGR Per Day'
}

let keys = [
  'start_date',
  'end_date',
  'num_pax',
  'weather',
  'avg_distance',
  'num_vehicles',
  'mre_per_day',
  'ugr_per_day'
]

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class TableExampleComplex extends Component {
  state = {
    height: '300px',
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

  render() {
    const muiTheme = getMuiTheme(mydarktheme);

    var emailData = "mailto:someone@example.com?Subject=Supply%20Report&Body="
    for (var i in tableData){
      //var spac = 20 - tableData[i]['name'].length
      //emailData += tableData[i]['name'] + "%20".repeat(spac) + "%09" + tableData[i]['status'] + "%0D%0A";
      emailData += tableData[i]['name'] + "%3A" + "%20%09" + tableData[i]['status'] + "%0D%0A";
    }

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
                    <TableHeaderColumn>Key</TableHeaderColumn>
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
                      <TableRowColumn>{this.state.data[key]}</TableRowColumn>
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
                  href={emailData}
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
