import {ACTIONS} from '../actions';

let defaultState = {
    index: 0
}

const nav = (state=defaultState, action) => {
    switch(action.type) {
        case ACTIONS.NAVIGATE:
            return {
                ...state,
                index: action.payload
            }
        default:
            return state;
    }
}

export default nav
