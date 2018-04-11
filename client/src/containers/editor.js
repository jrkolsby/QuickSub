import React, {Component} from 'react'

import Player from '../components/player'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

class EditorContainer extends Component {
    render() {
        return (
            <Player
                src={this.props.url}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return state.editor
}

export default connect(mapStateToProps, actionCreators)(EditorContainer)
