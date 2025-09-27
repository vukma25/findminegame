
export const ACTION = {
    START_GAME: "start_game",
    SELECT_SQUARE: "select_square",
    FILL_SQUARE: "fill_square",
    INITIALIZE_NEW_GAME: "new_game",
    MATCH_GAME_OVER: "game_over",
    CHANGE_VARIANT: "change_variant",
    LOADING: "loading",
    OPEN_CORRECT: "open_correct",
    UNMOUNT_SQUARE: "unmount_square",
}

export const setOpenCorrect = (payload) => {
    return {
        type: ACTION.OPEN_CORRECT,
        payload
    }
}

export const setSelectSquare = (payload) => {
    return {
        type: ACTION.SELECT_SQUARE,
        payload
    }
}

export const setFillSquare = (payload) => {
    return {
        type: ACTION.FILL_SQUARE,
        payload
    }
}

export const setInitializeGame = (payload) => {
    return {
        type: ACTION.INITIALIZE_NEW_GAME,
        payload
    }
}

export const setGameOver = (payload) => {
    return {
        type: ACTION.MATCH_GAME_OVER,
        payload
    }
}

export const setStartGame = () => {
    return {
        type: ACTION.START_GAME
    }
}

export const setVariant = (payload) => {
    return {
        type: ACTION.CHANGE_VARIANT,
        payload
    }
}

export const setLoading = (payload) => {
    return {
        type: ACTION.LOADING,
        payload
    }
}

export const setUnmountSquare = () => {
    return {
        type: ACTION.UNMOUNT_SQUARE
    }
}