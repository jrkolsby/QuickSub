import React, {Component} from 'react'

import {Player, ControlBar, CurrentTimeDisplay} from 'video-react'
import Dropzone from 'react-dropzone'
import ChunkEditor from '../components/chunkEditor.js'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

class EditorContainer extends Component {

    handleStateChange(state, prevState) {
        if (state.currentTime != prevState.currentTime) {
            console.log('new player state', state.currentTime)
            this.props.playerUpdate(state)
        }
    }

    componentDidMount() {
        this.refs.player.subscribeToStateChange(
            this.handleStateChange.bind(this)
        );
    }

    render() {
        return (
            <div id="editor">
                <Player 
                    ref="player"
                    fluid={false}
                    height={-1}
                    width={-1}
                >
                    <source src="http://localhost:3005/grizzly.m4v" />
                </Player>
                <ChunkEditor
                    chunks={this.props.chunks}
                    currentTime={this.props.currentTime}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.editor
}

export default connect(mapStateToProps, actionCreators)(EditorContainer)
