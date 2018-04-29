import React, {Component} from 'react'

import ChunkEditor from '../components/chunkEditor'

import {connect} from 'react-redux';
import * as actionCreators from '../actions/editor'

// Characters per minute = 41 words per min * 5 chars per word
const DEFAULT_WPM = 140
const DEFAULT_CPW = 5

class EditorContainer extends Component {
    constructor(props) {
        super(props)

        this.handleSelect = this.handleSelect.bind(this)
    }

    handleSelect(chunkIndex) {
        //console.log('handle select', chunkIndex)
        this.props.jumpToChunk(chunkIndex)
    }

    render() {  
        //console.log('editor chunk', this.props)
        return (
            <ChunkEditor

                // Editor props
                currentChunk={this.props.editor.currentChunk}
                isTrimming={this.props.editor.isTrimming} 
                chunks={this.props.editor.chunks}

                // Player props
                duration={this.props.player.duration}
                currentTime={this.props.player.currentTime}
                waveformData={this.props.player.waveformData}

                // Action creators
                handleStartTrim={this.props.startTrim}
                handleStartJoin={this.props.startJoin}

                handleEndTrim={this.props.endTrim}
                handleEndJoin={this.props.endJoin}

                handleTrim={this.props.trim}

                handleJoin={this.props.join}
                handleSplit={this.props.split}
                handleEdit={this.props.editChunk}
                handleDelete={this.props.deleteChunk}

                handleSelect={this.handleSelect}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        editor: state.editor,
        player: state.player
    }
}

export default connect(mapStateToProps, actionCreators)(EditorContainer)
