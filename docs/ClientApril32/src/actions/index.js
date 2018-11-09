import { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } from 'subtitle'

const request = require('superagent');

const UPLOAD_URL = "http://localhost:3008/upload"
const FILENAME = 'videoFile'

export const ACTIONS = {
    JUMP_CHUNK: 'new chunk yo',
    EDIT_CHUNK: 'new stuff',

    START_TRIM: 'draggin',
    START_JOIN: 'joinin',

    END_TRIM: 'no more!',
    END_JOIN: 'stopit!',

    TRIM: 'move it or lose it!',
    JOIN: 'two shall be as one',
    SPLIT: 'one shall be as two',
    DELETE: 'BEGONE!', 
    EXPORT: 'Donezo!',

    PLAYER_UPDATE: 'hi im carl',
    INSERT_CAPTION: 'new cap',
    BEGIN_UPLOAD: 'in progress',
    SERVER_ERROR: 'SERVER_ERROR',
    SERVER_SUCCESS: 'SERVER_SUCCESS',
    SERVER_PROGRESS: 'new percent',
}

export const exportSRT = () => {
    return (dispatch, getState) => {
        var string = stringify(
            getState().editor.chunks.map((chunk, index) => {
                return {
                    start: chunk.start,
                    end: chunk.end,
                    text: chunk.inputText
                }
            }))

		var blob = new Blob([string]);
		var a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
		a.download = "/filename.srt";
		document.body.appendChild(a);
		a.click(); 
		document.body.removeChild(a);
    }
}

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

export const playerUpdate = (playerState) => {
    return {
        type: ACTIONS.PLAYER_UPDATE,
        payload: playerState
    }
}

export const beginUpload = () => {
    return {
        type: ACTIONS.UPLOAD_PENDING
    }
}

/* NOTE: THIS FUNCTION DISPATCHES
   SERVER-GENERATED ACTIONS */
export const uploadVideo = (videoFile) => {
    return (dispatch, getState) => {
        const req = request.post(UPLOAD_URL);
        req.attach(FILENAME, videoFile)
        req.end((err, res) => {
            if (res) {
                console.log(res.body)
                dispatch(res.body) 
            } else {
                console.log(err)
            } 
        })
    }
}

export const insertCaption = () => {
    return {
        type: ACTIONS.INSERT_CAPTION
    }
}
