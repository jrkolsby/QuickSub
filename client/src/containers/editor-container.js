import React, {Component} from 'react'

import {Player} from 'video-react'
import Dropzone from 'react-dropzone'
import ChunkEditor from '../components/chunkEditor.js'
import Waveform from '../components/waveform.js'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

const SERVER_URL = "http://localhost:3008/"
const DROPZONE_CLASS = "dropzone"
const DROPZONE_ACTIVE_CLASS = "active"
const DROPZONE_ACCEPT_CLASS = "accept"
const DROPZONE_REJECT_CLASS = "reject"

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
        // ACTION : update player
        this.props.playerUpdate(state)
    }

    handleDrop(acceptedFiles, rejectedFiles) {
        // ACTION : server call
        this.props.uploadVideo(acceptedFiles[0])
    }

    componentDidMount() {
        // subscribe to player updates
        this.refs.player.subscribeToStateChange(
            this.handlePlayerStateChange.bind(this)
        );
    }

    componentWillReceiveProps(newProps) {
        var newChunkIndex = newProps.currentChunk
        var newChunk = newProps.chunks[newChunkIndex]        

        const { player } = this.refs.player.getState();

        // Need to add 0.25 because of odd float comparison
        var newTime = parseFloat(player.currentTime) + 0.25
        var start = parseFloat(newChunk.start)
        var end = parseFloat(newChunk.end)

        if (newTime < start ||
            newTime > end) {
            console.log('SEEK: ' + start + ' > ' + newTime)
            this.refs.player.seek(start) 
        }
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
                    style={{}}
                    className={DROPZONE_CLASS}
                    activeClassName={DROPZONE_ACTIVE_CLASS}
                    acceptClassName={DROPZONE_ACCEPT_CLASS}
                    rejectClassName={DROPZONE_REJECT_CLASS}
                    multiple={false}
                />
                <Player 
                    ref="player"
                    fluid={false}
                    height={-1}
                    width={-1}
                    src={this.getVideoSource()}
                />
                <Waveform
                    data={this.props.waveformData}
                    currentTime={this.props.currentTime}
                    totalDuration={this.props.duration}
                    //chunks={this.props.chunks}
                    length={100}
                />
                <ChunkEditor
                    chunks={this.props.chunks}
                    duration={this.props.duration}
                    currentTime={this.props.currentTime}
                    waveformData={this.props.waveformData}
                    handleSelect={this.props.jumpToChunk}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.editor
}

export default connect(mapStateToProps, actionCreators)(EditorContainer)
