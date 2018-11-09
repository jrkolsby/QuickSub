import React, {Component, Fragment} from 'react'

const CHUNK_CLASS = "chunk"
const DEFAULT_CLASS = ""
const PLAYHEAD_CLASS = "playhead"

class Waveform extends Component {

    indexWithTime(time) {
        var percent = time / this.props.totalDuration
        return Math.floor(percent * this.props.data.length)
    }

    makeSpans(spanArray) { 
        return spanArray.map((item, index) => {
            if (item.inner === "{}") {
                return null
            } else {
                return (
                    <span 
                        key={index}
                        className={item.className}>
                        {item.inner}
                    </span>
                ) 
            }
        })
    }

    makeSpanArray(start, end, play, defaultClass) {
        
        var currentSpan = 0
        var spanArray = [
            {
                className: defaultClass,
                inner: "{"
            }
        ]

        for (var i = start; i < end; i++) {
            if (i === play) {
                // Close current span
                spanArray[currentSpan].inner += "}"

                // Make playhead span
                spanArray.push({
                    className: PLAYHEAD_CLASS,
                    inner: "{" + this.props.data[i] + "}"
                })

                // Open new span
                spanArray.push({
                    className: defaultClass,
                    inner: "{"
                })

                currentSpan += 2

                continue;
            }

            if (spanArray[currentSpan].inner === "{") {
                spanArray[currentSpan].inner += this.props.data[i].toString()
            } else {
                spanArray[currentSpan].inner += "," + this.props.data[i]
            }
        }

        spanArray[currentSpan].inner += "}" 

        return spanArray
    }

    renderChunk() {
        var playIndex = this.indexWithTime(this.props.currentTime)
        var startIndex = this.indexWithTime(this.props.chunk.start)
        var endIndex = this.indexWithTime(this.props.chunk.end)
            
        var spanArray = this.makeSpanArray(startIndex, 
                                           endIndex, 
                                           playIndex,
                                           CHUNK_CLASS)
        return this.makeSpans(spanArray)
    }

    renderDynamic() { 
        var playIndex = this.indexWithTime(this.props.currentTime)
        var startIndex = playIndex - this.props.length / 2
        var endIndex = startIndex + this.props.length

        if (startIndex < 0) {
            startIndex = 0
            endIndex = startIndex + this.props.length
        }

        if (endIndex > this.props.data.length-1) {
            endIndex = this.props.data.length-1
            startIndex = endIndex - this.props.length
        }

        var spanArray = this.makeSpanArray(startIndex, 
                                           endIndex, 
                                           playIndex,
                                           DEFAULT_CLASS)
        return this.makeSpans(spanArray)
	}   

    render() {
        if (!this.props.totalDuration) {
            return null
        }

        if (this.props.chunk) {

            if (this.props.chunk.end > this.props.totalDuration) {
                return null
            }

            return (
                <div className="waveform">
                    {this.renderChunk()} 
                </div>
            )
        } 

        return (
            <div className="waveform">
                {this.renderDynamic()}
            </div>
        )
    }
}

export default Waveform
