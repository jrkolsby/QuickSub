import React, {Component} from 'react'

import {Player} from 'video-react'
import Dropzone from 'react-dropzone'
import ChunkEditor from '../components/chunkEditor.js'
import Waveform from '../components/waveform.js'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

const DROPZONE_CLASS = "dropzone"
const DROPZONE_ACTIVE_CLASS = "active"
const DROPZONE_ACCEPT_CLASS = "accept"
const DROPZONE_REJECT_CLASS = "reject"
const DROPZONE_MINIMIZE_CLASS = "minimize"

// Characters per minute = 41 words per min * 5 chars per word
const DEFAULT_WPM = 160
const DEFAULT_CPW = 5

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

        var newTime = player.currentTime + 0.01
        var start = newChunk.start
        var end = newChunk.end

        if (this.props.repeatChunks) {

            if (newTime < start ||
                newTime > end) {
                this.refs.player.seek(start) 
            } 

        } else {

            if (newTime < start)
                this.refs.player.seek(start) 

            if (newTime > end)
                this.props.jumpToChunk(this.props.currentChunk + 1)
        }

        if (this.props.variableSpeed) {
            let interval = (end - start)/60
            let wordCount = newChunk.text.length / DEFAULT_CPW

            let actualWPM = wordCount / interval

            this.refs.player.playbackRate = DEFAULT_WPM / actualWPM 
        }
    }

    componentWillUpdate() {
        this.refs.player.forceUpdate()
    }

    render() {  
        return (
            <div id="editor">
                <Dropzone
                    onDrop={this.handleDrop.bind(this)}
                    accepts={this.videoTypes}
                    style={{}}
                    className={this.props.videoURL === "" ?
                                (DROPZONE_CLASS) :
                                (DROPZONE_CLASS + " " +
                                 DROPZONE_MINIMIZE_CLASS)}
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
                    src={this.props.videoURL}
                />
                <Waveform
                    data={this.props.waveformData}
                    currentTime={this.props.currentTime}
                    totalDuration={this.props.duration}
                    //chunks={this.props.chunks}
                    length={110}
                />
                <ChunkEditor
                    chunks={this.props.chunks}

                    duration={this.props.duration}
                    currentTime={this.props.currentTime}
                    waveformData={this.props.waveformData}

                    handleStartTrim={this.props.startTrim}
                    handleStartJoin={this.props.startJoin}

                    handleEndTrim={this.props.endTrim}
                    handleEndJoin={this.props.endJoin}

                    handleTrim={this.props.trim}
                    handleJoin={this.props.join}
                    handleSplit={this.props.split}

                    isTrimming={this.props.isTrimming} 

                    handleSelect={this.props.jumpToChunk}
                    handleEdit={this.props.editChunk}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.editor
}

export default connect(mapStateToProps, actionCreators)(EditorContainer)
