import {ACTIONS} from '../actions';

let defaultState = {
    userTime: 140,
    adversaryTime: 150,

    speed: 1,

    url: "./videos/video.mp4",
    title: "",
    loaded: false,
    play: false,
    volume: 5
}

const editor = (state=defaultState, action) => {
    switch(action.type) {
        case ACTIONS.PLAY:
            return {
                ...state,
                play: true
            }

        case ACTIONS.STOP:
            return {
                ...state,
                play: false
            }

        default:
            return state
    }
}

export default editor
