import React, {Component} from 'react';

import mydarktheme from './mydarktheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';


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

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class TableExampleComplex extends Component {
  state = {
    height: '300px',
  };

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
      var spac = 30 - tableData[i]['name'].length
      emailData += tableData[i]['name'] + " ".repeat(spac) + tableData[i]['status'] + "%0D%0A";
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
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
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
          >
            {tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
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
      </MuiThemeProvider>

    );
  }
}
