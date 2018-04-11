import {combineReducers} from 'redux'

import nav from './nav'
import editor from './editor'
import importer from './importer'
import exporter from './exporter'

export default combineReducers({
    nav,
    editor,
    importer,
    exporter
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
