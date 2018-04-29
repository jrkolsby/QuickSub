import {ACTIONS} from '../actions';
import response from './response'

let SERVER_URL = "http://localhost:3008/content/"
let PIX_PER_DB = 0.5;

let defaultState = {
    audioURL: "",
    videoURL: "",

    waveformData: [],

    duration: 0,
    currentTime: 0,

    error: false,
    errorText: "",

    isUploading: true,
    uploadPercent: 0,

    isPasting: false,
    downloadPercent: 0,

    volume: 80,
    volumeOrigin: 0,
    originalVolume: 0,
    isVoluming: false,

    isPlaying: false,

    // DEMO RESPONSE
    /*
    ...response.payload,

    isUploading: false,

    audioURL: "http://localhost:3000/"
    + response.payload.directory + "/" 
    + response.payload.audioURL,

    videoURL: "http://localhost:3000/"
    + response.payload.directory + "/" 
    + response.payload.videoURL
    */
}

const player = (state=defaultState, action) => {
    switch(action.type) {

        case ACTIONS.TOGGLE_PLAY:
            return {
                ...state,

                isPlaying: !state.isPlaying
            }

        case ACTIONS.FORCE_PLAY:
            return {
                ...state,

                isPlaying: true
            }

        case ACTIONS.START_VOLUME:
            return {
                ...state,

                isVoluming: true,
                volumeOrigin: action.payload,
                originalVolume: state.volume
            }

        case ACTIONS.END_VOLUME:
            return {
                ...state,

                isVoluming: false
            }

        case ACTIONS.VOLUME:
            let offset = action.payload
            let origin = state.volumeOrigin
            let delta = Math.floor((origin - offset) / PIX_PER_DB)

            let newVolume = state.originalVolume - delta
            if (newVolume < 0) 
                newVolume = 0

            if (newVolume > 100)
                newVolume = 100

            return {
                ...state,

                volume: newVolume
            }

        case  ACTIONS.NEW_UPLOAD:
            return {
                ...state,

                isUploading: true,
                uploadPercent: 0
            }
            break;


        case ACTIONS.START_UPLOAD:
            return {
                ...state,

                isUploading: true
            }

        case ACTIONS.UPLOAD:
            return {
                ...state,

                uploadPercent: action.payload
            }

        case ACTIONS.END_UPLOAD:
            return {
                ...state,

                isUploading: false
            }

        case ACTIONS.SERVER_ERROR:

            if (!action.payload)
                return state
            
            return {
                ...state,

                error: true,
                errorText: action.payload,
            }

        case ACTIONS.SERVER_SUCCESS:

            if (!action.payload.directory &&
                !action.payload.videoURL &&
                !action.payload.audioURL)
                return {
                    ...state,

                    error: true,
                    errorText: "Server Error"
                }

            var audioURL = SERVER_URL
                + action.payload.directory + "/" 
                + action.payload.audioURL

            var videoURL = SERVER_URL
                + action.payload.directory + "/" 
                + action.payload.videoURL

            return {
                ...state,

                waveformData: action.payload.waveformData,

                audioURL,
                videoURL,

                error: false,
                errorText: ""
            }     

        case ACTIONS.PLAYER_UPDATE:
            return {
                ...state,

                currentTime: action.payload.currentTime,
                duration: action.payload.duration
            }
 
        default:
            return state;
    }
}

export default player
