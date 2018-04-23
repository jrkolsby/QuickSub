import React, {Component} from 'react'

import Chunk from './chunk'

class ChunkEditor extends Component {
    renderChunks() {
        return this.props.chunks.map((chunk, index) => {
            var active = false

            if (chunk.end >= this.props.currentTime &&
                chunk.start <= this.props.currentTime) { 
                active = true
            }

            return (
                <Chunk
                    key={index}
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

                    handleJoin={() => {
                        this.props.handleJoin(index)
                    }}
                />
            )
        })
    }

    render() {
        return (
            <div id="chunk-editor"
                className={this.props.isTrimming ? 'trimming' : null}
                onMouseMove={(e) => {
                    if (this.props.isTrimming) {
                        if (e.clientX === 0) {
                            this.props.handleTrim(-1) 
                        } else { 
                            this.props.handleTrim(e.clientX)
                        }
                    }
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
