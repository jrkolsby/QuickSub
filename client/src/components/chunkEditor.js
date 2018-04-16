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
                    handleSelect={() => {
                        this.props.handleSelect(index)
                    }}
                />
            )
        })
    }

    render() {
        return (
            <div id="chunk-editor">
                {this.renderChunks()}
            </div>
        )
    }
}

export default ChunkEditor
