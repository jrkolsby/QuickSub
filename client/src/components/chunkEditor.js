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
                    active={active}
                    start={0}
                    end={10}
                    time={-1}
                    text={"hey"}
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
