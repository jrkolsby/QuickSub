const ACTIONS = {
    ERROR: "ERROR",
    SUCCESS: "SUCCESS"
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
