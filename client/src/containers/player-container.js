import React, {Component} from 'react'

import {connect} from 'react-redux';
import * as actionCreators from '../actions/player'

import {Player} from 'video-react'
import Dropzone from 'react-dropzone'
import Waveform from '../components/waveform.js'

const ACTIVE_CLASS = "active"

const DROPZONE_CLASS = "dropzone"
const DROPZONE_ACCEPT_CLASS = "accept"
const DROPZONE_REJECT_CLASS = "reject"
const MINIMIZE_CLASS = "minimize"

// Characters per minute = 41 words per min * 5 chars per word
const DEFAULT_WPM = 140
const DEFAULT_CPW = 5

class PlayerContainer extends Component {
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
        if (state.duration !== prevState.duration ||
            state.currentTime !== prevState.currentTime) {
            this.props.playerUpdate(state)
        }
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

    handleSelect(chunkIndex) {
        this.refs.player.seek(
            this.props.editor.chunks[chunkIndex].start
        )
    }

    componentWillReceiveProps(newProps) {
        if (newProps.editor.chunks.length == 0)
            return;

        let newChunkIndex = newProps.editor.currentChunk
        let newChunk = newProps.editor.chunks[newChunkIndex]

        const { player } = this.refs.player.getState();

        let newTime = player.currentTime + 0.05
        let start = newChunk.start
        let end = newChunk.end

        //console.log('new player props', newTime, start, end)

        // If we're outside the current chunk
        if (newTime < start ||
            newTime > end) {

            // Go to start if we repeat chunks
            if (newProps.editor.repeatChunks) {
                this.refs.player.seek(start) 
            } else {

                let nextChunk = newProps.editor.chunks[newChunkIndex+1]

                // If in silence after chunk...
                if (nextChunk && newTime > end && 
                    newTime < nextChunk.start) {
                    this.props.jumpToChunk(newChunkIndex+1)
                    this.refs.player.seek(nextChunk.start)
                } else {
                    this.refs.player.seek(start)
                }
            }

        } 

        if (newProps.editor.variableSpeed) {
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
        //console.log('player props', this.props)
        return (
            <div id="player">
                <Dropzone
                    className={this.props.player.isUploading ?
                                (DROPZONE_CLASS) :
                                (DROPZONE_CLASS + " " +
                                 MINIMIZE_CLASS)}
                    onDrop={this.handleDrop.bind(this)}
                    accepts={this.videoTypes}
                    style={{}}
                    activeClassName={ACTIVE_CLASS}
                    acceptClassName={DROPZONE_ACCEPT_CLASS}
                    rejectClassName={DROPZONE_REJECT_CLASS}
                    multiple={false}
                />
                <div className={this.props.player.isUploading ?
                                "player" : "player" + " " +
                                ACTIVE_CLASS}
                >
                    <Player 
                        ref="player"
                        fluid={false}
                        height={-1}
                        width={-1}
                        src={this.props.player.videoURL}
                    />
                </div>
                <Waveform
                    isPercent={this.props.player.isUploading}
                    percent={this.props.player.uploadPercent}

                    data={this.props.player.waveformData}
                    currentTime={this.props.player.currentTime}
                    totalDuration={this.props.player.duration}

                    //chunks={this.props.chunks}
                    length={74}
                />
                <div className="controls"
                    onMouseMove={this.props.volume}
                    onMouseUp={this.props.endVolume}
                > 
                    <span className="left"> 
                        <span className="icon repeat"
                            onClick={this.props.toggleRepeat}
                        ></span> 
                        <span className="icon rate"
                            onClick={this.props.toggleRate}
                        >1.2</span>
                        <span className="icon volume active"
                            onMouseDown={this.props.startVolume}
                        >80</span>
                    </span>

                    <span className="middle">
                        <span className="icon previous active"
                            onClick={this.props.jumpToLastChunk}
                        ></span>
                        <span className="icon play active"
                            onClick={this.props.togglePlay}
                        ></span>
                        <span className="icon next active"
                            onClick={this.props.jumpToNextChunk}
                        ></span>
                    </span>

                    <span className="right">
                        <span className="icon type active"
                            onClick={this.props.toggleMode}
                        >Type</span>
                        <span className="icon time"
                            onClick={this.props.toggleMode}
                        >Time</span>
                    </span>
                </div>
            </div> 
        ) 
    }
}

const mapStateToProps = (state) => {
    return { 
        editor: state.editor,
        player: state.player
    }
}

export default connect(mapStateToProps, actionCreators)(PlayerContainer)
