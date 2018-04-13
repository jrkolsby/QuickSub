import React, {Component} from 'react'

import {Player} from 'video-react'
import Dropzone from 'react-dropzone'
import ChunkEditor from '../components/chunkEditor.js'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

const SERVER_URL = "http://localhost:3008/"

class EditorContainer extends Component {
    constructor(props) {
        super(props)

        this.videoTypes = "video/x-flv, " +
            "video/application/x-mpegURL, " +
            "video/quicktime, " +
            "video/x-msvideo, " +
            "video/x-ms-wmw, " +
            "video/x-m4v, " +
            "video/mp4, " +
            "video/MP2T, " + 
            "video/3gpp"
    }

    handlePlayerStateChange(state, prevState) {
        // Time update
        if (state.currentTime !== prevState.currentTime) {
            this.props.playerUpdate(state)
        }
    }

    handleDrop(acceptedFiles, rejectedFiles) {
        this.props.uploadVideo(acceptedFiles[0])
    }

    componentDidMount() {
        // subscribe to player updates
        this.refs.player.subscribeToStateChange(
            this.handlePlayerStateChange.bind(this)
        );
    }
    
    componentWillUpdate() {
        this.refs.player.forceUpdate()
    }

    getVideoSource() {
        if (this.props.videoURL !== "")
            return SERVER_URL + this.props.videoURL
    }

    render() {
        return (
            <div id="editor">
                <Dropzone
                    onDrop={this.handleDrop.bind(this)}
                    accepts={this.videoTypes}
                    multiple={false}
                />
                <Player 
                    ref="player"
                    fluid={false}
                    height={-1}
                    width={-1}
                    src={this.getVideoSource()}
                />
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
