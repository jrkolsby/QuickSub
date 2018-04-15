import React, {Component, Fragment} from 'react'

const PLAYED_CLASS = "played"
const CHUNK_CLASS = "chunk"
const DEFAULT_CLASS = ""
const PLAYHEAD_CLASS = "playhead"

class Waveform extends Component {

    timeToIndex(time) {
        var percent = time / this.props.duration
        return Math.floor(percent * this.props.data.length)
    }

    renderChunk() {
         
    }

    renderData() { 
        // this.props.begin
        // this.props.end
        // this.props.length
        // this.props.chunks

        if (this.props.data.length === 0 ||
            this.props.length === 0) {
            return ""
        }

        var length = this.props.end - this.props.begin

        if (this.props.length) 
            length = this.props.length

        var middleIndex = timeToIndex(this.props.currentTime)
        var bottomIndex = middleIndex + (this.props.length / 2)

        if (bottomIndex < 0)
            bottomIndex = 0

        var topIndex = bottomIndex + length

        if (topIndex > this.props.data.length)
            topIndex = this.props.data.length

        if (middleIndex === 0)
            middleIndex = 1

        if (middleIndex === this.props.data.length)
            middleIndex = this.props.data.length - 1

        var spans = []

        for (i = bottomIndex; i < topIndex; i++) {

            if (chunkTrigger = true && i >= nextEndIndex)

                nextStart = this.props.chunks[chunkIndex].start / this.props.duration
                nextEnd = this.props.chunks[chunkIndex].end / this.props.duration

            if (i < middleIndex) {
                before.push(this.props.data[i])
            } else {
                after.push(this.props.data[i])
            }
        }

        var beforeString = "{" + before.join(',') + "}"
        var afterString = "{" + after.join(',') + "}"


        return (
            <Fragment>
                <span className={PLAYED_CLASS}>{beforeString}</span>
                <span className={UNPLAYED_CLASS}>{afterString}</span>
            </Fragment>
        )

    }   

    render() {
        return (
            <div className="waveform">{this.renderData()}</div>
        )
    }
}

export default Waveform
