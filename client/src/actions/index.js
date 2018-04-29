export const ACTIONS = {
    NEW_UPLOAD: 'newUpload',

    START_UPLOAD: 'startUpload',
	UPLOAD: 'upload',
	END_UPLOAD: 'endUpload',

    // SERVER-GENERATED
    SERVER_SUCCESS: 'SERVER_SUCCESS',
    SERVER_ERROR: 'SERVER_ERROR',

    PLAYER_UPDATE: 'playerUpdate',
    JUMP_CHUNK: 'jumpToChunk',
    EDIT_CHUNK: 'editChunk',

    START_VOLUME: 'startVolume',
    END_VOLUME: 'endVolume',
    VOLUME: 'volume',

    TOGGLE_PLAY: 'togglePlay',
    FORCE_PLAY: 'forcePlay',
    TOGGLE_REPEAT: 'toggleRepeat',
    TOGGLE_RATE: 'toggleRate',
    TOGGLE_MODE: 'toggleMode',

    START_TRIM: 'startTrim',
    TRIM: 'trim',
    END_TRIM: 'endTrim',

    START_JOIN: 'startJoin',
    END_JOIN: 'endJoin',

    JOIN: 'join',
    SPLIT: 'split',
    DELETE: 'delete', 

    EXPORT: 'exportSRT',
}

export default ACTIONS
