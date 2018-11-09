import ACTIONS from '.'

export const split = (chunkIndex, splitTime) => {
    return {
        type: ACTIONS.SPLIT_CHUNK,
        payload: {
        
        }
    }
}

export const deleteChunk = (chunkIndex) => {
    return {
        type: ACTIONS.DELETE,
        payload: chunkIndex
    }
}


export const editChunk = (chunkIndex, inputText) => {
    return {
        type: ACTIONS.EDIT_CHUNK,
        payload: {
            index: chunkIndex,
            inputText
        }
    }
}

export const join = (destinationChunkIndex) => {
    return {
        type: ACTIONS.JOIN,
        payload: destinationChunkIndex
    }
}

export const startJoin = (sourceChunkIndex) => {
    return {
        type: ACTIONS.START_JOIN,
        payload: sourceChunkIndex
    }
}

export const startTrim = (chunkIndex, origin, isStart) => {
    return {
        type: ACTIONS.START_TRIM,
        payload: {
            index: chunkIndex,
            origin,
            isStart
        }
    }
}

export const endTrim = () => {
    return {
        type: ACTIONS.END_TRIM
    }
}

export const trim = (offset) => {
    return {
        type: ACTIONS.TRIM,
        payload: offset
    }

}

export const jumpToChunk = (chunkIndex) => {
    return {
        type: ACTIONS.JUMP_CHUNK,
        payload: chunkIndex
    }
}
