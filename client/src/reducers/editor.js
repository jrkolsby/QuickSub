import {ACTIONS} from '../actions';

/*
    chunks: [
        {
            start:
            end:
            textInput:
            textPrediction:
            waveformData:
            audioURL:
        }
    ]
*/

/*
    SERVER RESPONSE:

    {
        chunks: [
            {
                start:
                end:
                audioURL:
                waveformData:
            }, ...
        ]
        waveformData:
        audioURL:
        videoURL:
    }
*/

let defaultState = {
    chunks: [],
    player: {},
    currentTime: 0,
    waveformData: [],
    audioURL: "",
    videoURL: ""
}

const editor = (state=defaultState, action) => {
    switch(action.type) {
        case ACTIONS.PLAYER_UPDATE:
            return {
                ...state,
                currentTime: action.payload.currentTime
            }
        default:
            return state
    }
}

export default editor
