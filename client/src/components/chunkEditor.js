import React, {Component} from 'react'

import Chunk from './chunk'

class ChunkEditor extends Component {
    renderChunks() {
        return this.props.chunks.map((chunk, index) => {

            var active = false

            if (index === this.props.currentChunk)
                active = true

            return (
                <Chunk
                    key={index}
                    active={active}
                    chunk={this.props.chunks[index]}
                    waveformData={this.props.waveformData}
                    currentTime={this.props.currentTime}
                    totalDuration={this.props.duration}

                    handleStartTrim={(origin, isStart) => {
                        this.props.handleStartTrim(index, origin, isStart)
                    }}
                    handleStartJoin={() => {
                        this.props.handleStartJoin(index)
                    }}

                    handleSelect={() => {
                        this.props.handleSelect(index)
                    }}

                    handleEdit={(newText) => {
                        this.props.handleEdit(index, newText)
                    }}

                    handleSplit={(splitTime) => {
                        this.props.handleSplit(index, splitTime) 
                    }}

                    handleDelete={() => {
                        this.props.handleDelete(index)
                    }}

                    handleJoin={() => {
                        this.props.handleJoin(index)
                    }}
                />
            )
        })
    }

    render() {
        //console.log('chunkEditor props', this.props)
        return (
            <div
                className={"editor" + 
                          (this.props.isUploading ? 
                          "" : " active") +
                          (this.props.timeMode ? 
                          " time" : "")}
                onMouseMove={(e) => {
                    if (this.props.isTrimming)
                        this.props.handleTrim(e.clientX)
                }}
                onMouseUp={(e) => {
                    this.props.handleEndTrim()
                }}
                onMouseLeave={(e) => {
                    this.props.handleEndTrim() 
                }}
            >
                {this.renderChunks()}
            </div>
        )
    }
}

export default ChunkEditor
