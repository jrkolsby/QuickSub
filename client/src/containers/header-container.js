import React, {Component} from 'react'

import Header from '../components/header.js'

import {connect} from 'react-redux';
import * as actionCreators from '../actions/player'

class HeaderContainer extends Component {
    constructor(props) {
        super(props)
        console.log('header container')
    }

    render() {
        return (
            <Header 
                handleExport={this.props.exportSRT}
                handleUpload={this.props.newUpload}
                isUploading={this.props.isUploading}
                error={this.props.error}
                errorText={this.props.errorText}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return state.player
}

export default connect(mapStateToProps, actionCreators)(HeaderContainer)
