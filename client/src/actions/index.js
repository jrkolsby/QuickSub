export const ACTIONS = {
    PLAY: 'GO TIME',
    STOP: 'NO MORE',
    INSERT_CAPTION: 'new cap'
}

export const playVideo = () => {
    return {
        type: ACTIONS.PLAY
    }
}

export const stopVideo = () => {
    return {
        type: ACTIONS.STOP 
    }
}

export const insertCaption = () => {
    return {
        type: ACTIONS.INSERT_CAPTION
    }
}
