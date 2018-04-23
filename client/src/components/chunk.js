import React, {Component} from 'react'

import Waveform from './waveform'

class Chunk extends Component {
    constructor(props) {
        super(props);
        this.props.chunk.inputText = ""
        this.inputDidChange = this.inputDidChange.bind(this)
    }

    didSplit() {
        this.props.handleSplit()
    
    }

    didJoin() {
        this.props.handleJoin()
    }

    inputDidChange() {
        let newInputText = this.refs.textInput.value
        this.props.handleEdit(newInputText)
    }

    componentDidMount() { 
        // TODO: calculate pixels per second!
        //console.log(this.refs.data.offsetWidth)
    }

    render() {
        let start = "-"
        let end = "-"

        if (this.props.chunk) {
            start = this.props.chunk.start.toFixed(2)
            end = this.props.chunk.end.toFixed(2)
        }

        return (
            <div className="chunk" draggable="true"
                onDragStart={(e) => {
                    this.props.handleStartJoin()
                }}
                onDrop={(e) => {
                    this.props.handleJoin()
                }}
            >
                <div className="handle start"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        this.props.handleStartTrim(e.clientX, true)
                    }}
                ></div>
                <div className="handle end"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        this.props.handleStartTrim(e.clientX, false)
                    }}
                ></div>
                <Waveform
                    chunk={this.props.chunk}
                    data={this.props.waveformData}
                    currentTime={this.props.currentTime}
                    totalDuration={this.props.totalDuration} 
                />
                <div className="data" ref="data">
                    <span className="start">{start}</span>
                    <span className="end">{end}</span>
                </div>
                <input 
                    ref="textInput"
                    type="text" 
                    placeholder="Caption"
                    onFocus={this.props.handleSelect}
                    onChange={this.inputDidChange}
                    value={this.props.chunk.inputText}
                />
            </div>
        )
    }
}

export default Chunk
