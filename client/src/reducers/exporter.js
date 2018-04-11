import {ACTIONS} from '../actions'

let defaultState = {
    error: false
}

const exporter = (state=defaultState, action) => {
    switch(action.type) {
        default:
            return state
    }
}

export default exporter
