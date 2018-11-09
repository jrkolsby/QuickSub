import {combineReducers} from 'redux'

import nav from './nav'
import editor from './editor'

export default combineReducers({
    nav,
    editor
})

/*

state = {
    videoRate: 1,
    videoTimecode: 0,
    videoPlaying: false,
    shouldInsert: false,

    voiceClips: [
        {
            start: 0,
            end: 0
            text: "",
            processed: false,
        }
    ],
    titles: [
        {
            start: 0,
            end: 0,
            text: ""
        },
        {
            start: 0,
            end: 0,
            text: ""
        },
    ],
}

*/
