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

    componentWillReceiveProps(newProps) {
        if (newProps.active)
            this.refs.textInput.focus() 
    }  

    render() {
        let start = "-"
        let end = "-"

        if (this.props.chunk) {
            var startSeconds = this.props.chunk.start.toFixed(2)
            var endSeconds = this.props.chunk.end.toFixed(2)

            var startMinutes = Math.floor(startSeconds / 60)
            var endMinutes = Math.floor(endSeconds / 60)

            var startSeconds = (startSeconds % 60).toFixed(2)
            var endSeconds = (endSeconds % 60).toFixed(2)

            if (startSeconds < 10)
                startSeconds = "0" + startSeconds

            if (endSeconds < 10)
                endSeconds = "0" + endSeconds

            if (startMinutes === 0)
                startMinutes = ""
            else
                startMinutes += ":"

            if (endMinutes === 0)
                endMinutes = ""
            else
                endMinutes += ":"

            start = startMinutes + startSeconds
            end = endMinutes + endSeconds
        }

        return (
            <div className={this.props.active ?
                            "chunk active" : "chunk"}
                draggable="true"
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
                <div className="delete"
                    onClick={(e) => {
                        this.props.handleDelete()
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
                    onFocus={() => {
                        if (!this.props.active)
                            this.props.handleSelect()
                    }}
                    onChange={this.inputDidChange}
                    value={this.props.chunk.inputText}
                />
            </div>
        )
    }
}

export default Chunk
