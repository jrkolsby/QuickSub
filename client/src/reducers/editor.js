import {ACTIONS} from '../actions';

let defaultState = {
    chunks: [],
    currentTime: 0,
    duration: 0,
    waveformData: [],

    audioURL: "",
    videoURL: "",

    uploadPending: false,

    error: false,
    errorText: ""
}

const editor = (state=defaultState, action) => {
    switch(action.type) {
        case ACTIONS.PLAYER_UPDATE:
            return {
                ...state,
                currentTime: action.payload.currentTime,
                duration: action.payload.duration
            }
    
        case ACTIONS.BEGIN_UPLOAD:
            return {
                ...state,
                uploadPending: true,

                error: false,
                errorText: ""
            }

        case ACTIONS.SERVER_ERROR:
            return {
                ...state,
                uploadPending: false,

                error: true,
                errorText: action.payload,
            }

        case ACTIONS.SERVER_SUCCESS:
            var audioURL = action.payload.directory + "/" 
                + action.payload.audioURL

            var videoURL = action.payload.directory + "/" 
                + action.payload.videoURL

            return {
                ...state,

                chunks: action.payload.chunks,
                waveformData: action.payload.waveformData,

                audioURL,
                videoURL,

                uploadPending: false,

                error: false,
                errorText: ""


            }


        default:
            return state
    }
}

export default editor
