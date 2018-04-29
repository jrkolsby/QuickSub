import {ACTIONS} from '../actions';
import response from './response'

let SERVER_URL = "http://localhost:3008/"
let PIX_PER_SEC = 112.75 // TODO: Base this on the rendered px/s

let defaultState = {
    chunks: [],
    currentChunk: 0,

    repeatChunks: true,
    variableSpeed: false,
    
    typeMode: true,
    timeMode: false,

    isTrimming: false,
    trimOrigin: 0,
    trimOriginalStart: 0,
    trimOriginalEnd: 0,
    trimStart: false,
    trimChunkIndex: 0,
    joinChunkIndex: 0,

    //...response.payload,
}

const editor = (state=defaultState, action) => {
    switch(action.type) {

        case ACTIONS.DELETE:
            var newChunks = state.chunks.slice(0)

            newChunks.splice(action.payload, 1)

            var newCurrentChunk = 
                (state.currentChunk < action.payload ? 
                 state.currentChunk : state.currentChunk - 1)

            if (newCurrentChunk < 0)
                newCurrentChunk = 0

            return {
                ...state,
                chunks: newChunks, 
                currentChunk: newCurrentChunk
            }

        case ACTIONS.START_JOIN:
            return {
                ...state,
                joinChunkIndex: action.payload
            }

        case ACTIONS.JOIN:
            let firstIndex = state.joinChunkIndex
            let secondIndex = action.payload

            if (Math.abs(firstIndex - secondIndex) !== 1)
                return state

            if (firstIndex > secondIndex) {
                var temp = firstIndex
                firstIndex = secondIndex
                secondIndex = temp
            }
            
            let newStart = state.chunks[firstIndex].start
            let newEnd = state.chunks[secondIndex].end

            let newText = state.chunks[firstIndex].text + " " + 
                          state.chunks[secondIndex].text

            let newInputText = (state.chunks[firstIndex].inputText !== "" ?
                                state.chunks[firstIndex].inputText + " " : "") + 
                               (state.chunks[secondIndex].inputText !== "" ?
                                state.chunks[secondIndex].inputText : "")

            var newChunks = state.chunks.slice(0)

            var newCurrentChunk = (state.currentChunk < secondIndex ? 
                                   state.currentChunk : state.currentChunk - 1)

            newChunks.splice(secondIndex, 1)
            newChunks[firstIndex] = {
                ...newChunks[firstIndex],

                start: newStart,
                end: newEnd,
                text: newText,
                inputText: newInputText
            }

            return {
                ...state,
                chunks: newChunks,
                currentChunk: newCurrentChunk
            }

        case ACTIONS.TRIM:
            //console.log('trim', state)

            let offset = action.payload
            let origin = state.trimOrigin
            let delta = (origin - offset) / PIX_PER_SEC

            let lastChunk = state.chunks[state.trimChunkIndex-1]
            let nextChunk = state.chunks[state.trimChunkIndex+1]

            return {
                ...state,

                chunks: state.chunks.map((chunk, index) => {
                    if (index === state.trimChunkIndex) {
                        if (state.trimStart) {
                            var newStart = state.trimOriginalStart + delta

                            if (newStart > state.trimOriginalEnd)
                                return chunk

                            if (newStart < 0)
                                return chunk

                            if (lastChunk && newStart < lastChunk.end)
                                return chunk
                                
                            return {
                                ...chunk,
                                start: newStart
                            } 
                        } else {
                            var newEnd = state.trimOriginalEnd - delta

                            if (newEnd < state.trimOriginalStart)
                                return chunk

                            if (newEnd > state.duration)
                                return chunk

                            if (nextChunk && newEnd > nextChunk.start)
                                return chunk

                            return {
                                ...chunk,
                                end: newEnd
                            } 
                        }

                    }
                    return chunk
                })
            
            }
            
        case ACTIONS.END_TRIM:
            //console.log('end trim', state)

            return {
                ...state,
                isTrimming: false
            }

        case ACTIONS.START_TRIM:
            //console.log('start trim', state)
            
            let chunkIndex = action.payload.index
            let chunk = state.chunks[chunkIndex]
            let originalStart = chunk.start
            let originalEnd = chunk.end
            
            return {
                ...state,
                isTrimming: true,
                trimStart: action.payload.isStart,
                trimOrigin: action.payload.origin,
                trimChunkIndex: action.payload.index,

                trimOriginalStart: originalStart,
                trimOriginalEnd: originalEnd
            }

        case ACTIONS.EDIT_CHUNK:
            return {
                ...state,

                chunks: state.chunks.map((chunk, index) => {
                    if (index === action.payload.index) {
                        return {
                            ...chunk,

                            inputText: action.payload.inputText,
                        }
                    }
                    return chunk
                })
            }


        case ACTIONS.JUMP_CHUNK:
            //console.log('jump chunk action', action.payload)
            let newChunk = (action.payload > (state.chunks.length - 1) ? 0 :
                            action.payload)
                
            return {
                ...state,

                currentChunk: newChunk
            }

        case ACTIONS.SERVER_SUCCESS:
            return {
                ...state,

                chunks: action.payload.chunks
            }

        default:
            return state
    }
}

export default editor
