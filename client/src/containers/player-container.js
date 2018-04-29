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

        if (!state.paused && state.paused !== prevState.paused)
            this.props.forcePlay()
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

                    if (newChunkIndex == newProps.editor.chunks.length-1) {
                        this.refs.player.pause()
                    } else {
                        this.props.jumpToChunk(newChunkIndex+1)
                        this.refs.player.seek(nextChunk.start) 
                    }
                } else {
                    this.refs.player.seek(start)
                }
            }

        } 

        if (newProps.editor.variableSpeed && 
            newChunk.text !== "") {
            let interval = (end - start)/60
            let wordCount = newChunk.text.length / DEFAULT_CPW

            let actualWPM = wordCount / interval

            this.refs.player.playbackRate = DEFAULT_WPM / actualWPM 
        } else {
            this.refs.player.playbackRate = 1
        }

        if (newProps.player.isPlaying && player.paused)
            this.refs.player.play()

        if (!newProps.player.isPlaying && !player.paused)
            this.refs.player.pause()

        this.refs.player.volume = (this.props.player.volume / 100)
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
                <div className={"player" + 
                                (this.props.player.isUploading ?
                                "" : " " + ACTIVE_CLASS)}
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
                <div className={"controls" +
                                (this.props.player.isVoluming ? 
                                " voluming" : "")}
                    onMouseMove={(e) => {
                        if (this.props.player.isVoluming)
                            this.props.volume(e.clientX)
                    }}
                    onMouseUp={this.props.endVolume}
                    onMouseLeave={this.props.endVolume}
                > 
                    <span className="left"> 
                        <span className={"icon repeat" + 
                                        (this.props.editor.repeatChunks ?
                                        " " + ACTIVE_CLASS : "")}
                            onClick={this.props.toggleRepeat}
                        ></span> 
                        <span className={"icon rate" + 
                                        (this.props.editor.variableSpeed ?
                                        " " + ACTIVE_CLASS : "")}
                            onClick={this.props.toggleRate}
                        ></span>
                        <span className={"icon volume" + 
                                        (this.props.player.isUploading ?
                                        "" : " " + ACTIVE_CLASS)}
                            onMouseDown={(e) => {
                                this.props.startVolume(e.clientX)
                            }}
                        >{this.props.player.volume}</span>
                    </span>

                    <span className="middle">
                        <span className={"icon previous" + 
                                        (this.props.player.isUploading ?
                                        "" : " " + ACTIVE_CLASS)}
                            onClick={() => {
                                this.props.jumpToChunk(
                                    this.props.editor.currentChunk - 1
                                )
                            }}
                        ></span>
                        <span className={"icon " +
                                        (this.props.player.isPlaying ?
                                        "pause" : "play") + 
                                        (this.props.player.isUploading ?
                                        "" : " " + ACTIVE_CLASS)}
                            onClick={this.props.togglePlay}
                        ></span>
                        <span className={"icon next" + 
                                        (this.props.player.isUploading ?
                                        "" : " " + ACTIVE_CLASS)}
                            onClick={() => {
                                this.props.jumpToChunk(
                                    this.props.editor.currentChunk + 1
                                )
                            }}
                        ></span>
                    </span>

                    <span className="right">
                        <span className={"icon type" + 
                                        (this.props.editor.timeMode ?
                                        "" : " " + ACTIVE_CLASS)}
                            onClick={() => {
                                if (this.props.editor.timeMode)
                                    this.props.toggleMode()
                            }}
                        >Type</span>
                        <span className={"icon time" + 
                                        (this.props.editor.timeMode ?
                                        " " + ACTIVE_CLASS : "")}
                            onClick={() => {
                                if (!this.props.editor.timeMode)
                                    this.props.toggleMode()
                            }}
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
