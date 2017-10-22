import React, { Component } from 'react';
import classNames from 'classnames'
import $ from 'jquery'

import './Result.css'

export default class Result extends Component {
	constructor(props) {
		super(props)
		console.log(props)
	}

	render = () => {

		return (
			<div className='result-container'>
				<h1>TODO</h1>
				<img src="http://s2.quickmeme.com/img/74/7437eae4c91e47394e9058598de8a206e50c342ebba84bdab8754034e4e9c89a.jpg"/>
			</div>
		)
	}
}