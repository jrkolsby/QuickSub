import {ACTIONS} from '../actions'

let defaultState = {
    error: false
}

const importer = (state=defaultState, action) => {
    switch(action.type) {
        default:
            return state
    }
}

export default importer
