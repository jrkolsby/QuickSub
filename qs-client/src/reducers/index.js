import {combineReducers} from 'redux'

import editor from './editor'
import player from './player'

export default combineReducers({
    player,
    editor
})
