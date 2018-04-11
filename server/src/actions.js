const ACTIONS = {
    ERROR: "uh oh!",
    SUCCESS: "here's ur chunks"
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
