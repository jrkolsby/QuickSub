export const ACTIONS = {
    PLAYER_UPDATE: 'hi im carl',
    INSERT_CAPTION: 'new cap'
}

export const playerUpdate = (playerState) => {
    return {
        type: ACTIONS.PLAYER_UPDATE,
        payload: playerState
    }
}

export const insertCaption = () => {
    return {
        type: ACTIONS.INSERT_CAPTION
    }
}
