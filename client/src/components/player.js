import React, {Component} from 'react'

class Player extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <video
                src={this.props.source}
            />
        )
    }
}

export default Player
