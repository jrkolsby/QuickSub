const request = require('superagent');

const UPLOAD_URL = "http://localhost:3008/upload"
const FILENAME = 'videoFile'

export const ACTIONS = {
    PLAYER_UPDATE: 'hi im carl',
    INSERT_CAPTION: 'new cap',
    BEGIN_UPLOAD: 'in progress',
    SERVER_ERROR: 'SERVER_ERROR',
    SERVER_SUCCESS: 'SERVER_SUCCESS'
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
                dispatch(res.body) 
            }
            if (err) {
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
