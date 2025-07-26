export const CREATE_EFFECT_ACTION = "CREATE_EFFECT"
export const DISPLAY_MOVE_ACTION = "DISPLAY_MOVE"
export const HIDDEN_MOVE_ACTION = "HIDDEN_MOVE"
export const REPLACE_PIECE_ACTION = "REPLACE_PIECE"

export const setDisplayEffect = (payload) => {
    
    return {
        type: CREATE_EFFECT_ACTION,
        payload
    }
}

export const setDisplayMove = payload => {
    return {
        type: DISPLAY_MOVE_ACTION,
        payload
    }
}

export const setHiddenMove = payload => {
    return {
        type: HIDDEN_MOVE_ACTION,
        payload
    }
}

export const setReplacePiece = payload => {
    return {
        type: REPLACE_PIECE_ACTION,
        payload
    }
}