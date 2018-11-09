const ACTIONS = {
    ERROR: "SERVER_ERROR",
    SUCCESS: "SERVER_SUCCESS"
}

global.error = (errorMessage) => {
    return {
        type: ACTIONS.ERROR,
        payload: errorMessage
    }
}

global.success = (chunkData) => {
    return {
        type: ACTIONS.SUCCESS,
        payload: chunkData
    }
}
