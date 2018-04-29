import React, {Component, Fragment} from 'react'

const CHUNK_CLASS = "partition"
const DEFAULT_CLASS = ""
const PLAYHEAD_CLASS = "playhead"
const SPLITHEAD_CLASS = "splithead"

class Waveform extends Component {

    indexWithTime(time) {
        var percent = time / this.props.totalDuration
        return Math.floor(percent * this.props.data.length)
    }

    makeSpans(spanArray) { 
        return spanArray.map((span, index) => {
            if (span.inner === "{}") {
                return null
            } else {
                return (
                    <span 
                        key={index}
                        className={span.className}>
                        {span.inner}
                    </span>
                ) 
            }
        })
    }

    makePercentSpanArray() {
        var preLength = Math.floor(this.props.length * (this.props.percent / 100))
        var postLength = this.props.length - preLength

        return [
            {
                className: CHUNK_CLASS,
                inner: "{" + "50,".repeat(preLength > 0 ? preLength-1 : 0) 
                        + (preLength > 0 ? "50" : "") + "}"
            },
            /*
            {
                className: DEFAULT_CLASS,
                inner: "{" + "50,".repeat(postLength > 0 ? postLength-1 : 0) 
                        + (postLength > 0 ? "50" : "") + "}"

            }
            */
        ] 
    }

    makeSegmentSpanArray(start, end, play, defaultClass) {
        
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

    renderPercent() {
        var percentIndex = this.props.length * this.props.percent

        return this.makeSpans(
            this.makePercentSpanArray(percentIndex)
        )
        
    }

    renderStatic() {
        var playIndex = this.indexWithTime(this.props.currentTime)
        var startIndex = this.indexWithTime(this.props.chunk.start)
        var endIndex = this.indexWithTime(this.props.chunk.end)
            
        var spanArray = this.makeSegmentSpanArray(startIndex, 
                                                  endIndex, 
                                                  playIndex,
                                                  CHUNK_CLASS)
        return this.makeSpans(spanArray)
    }

    renderDynamic() { 
        var playIndex = this.indexWithTime(this.props.currentTime)
        var startIndex = playIndex - Math.floor(this.props.length / 2)
        var endIndex = startIndex + this.props.length

        if (startIndex < 0) {
            startIndex = 0
            endIndex = startIndex + this.props.length
        }

        if (endIndex > this.props.data.length-1) {
            endIndex = this.props.data.length-1
            startIndex = endIndex - this.props.length
        }

        var spanArray = this.makeSegmentSpanArray(startIndex, 
                                                  endIndex, 
                                                  playIndex,
                                                  DEFAULT_CLASS)
        return this.makeSpans(spanArray)
	}   

    shouldComponentUpdate() {
        return true;
    }

    render() {
        
        if (this.props.chunk == null &&
            this.props.length == null &&
            this.props.percent == null &&
            this.props.totalDuration == null &&
            this.props.chunk.end <= this.props.totalDuration)
            return null

        if (this.props.isPercent) {
            return (
                <div className="waveform">
                    {this.renderPercent()} 
                </div>
            ) 
        } 

        if (this.props.chunk) {
            return (
                <div className="waveform">
                    {this.renderStatic()} 
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
