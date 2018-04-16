import React, {Component} from 'react'

import Waveform from './waveform'

class Chunk extends Component {

    render() {
        return (
            <div className="chunk">
                <Waveform
                    chunk={this.props.chunk}
                    data={this.props.waveformData}
                    currentTime={this.props.currentTime}
                    totalDuration={this.props.totalDuration}
                />
                <input 
                    type="text" 
                    onFocus={this.props.handleSelect}
                />
            </div>
        )
    }
}

export default Chunk
