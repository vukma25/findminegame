export const ACTIONS = {
    QUIT_GAME: "quit",
    INITIALIZE_NEW_GAME: "init_new_game",
    SET_STATE: "state",
    CHANGE_USER_INPUT: "change_input",
    CHANGE_OPTIONS: "change_options",
}

export const setNewGame = (payload) => {
    return {
        type: ACTIONS.INITIALIZE_NEW_GAME,
        payload
    }
}

export const setGameState = (payload) => {
    return {
        type: ACTIONS.SET_STATE,
        payload
    }
}

export const setUserInput = (payload) => {
    return {
        type: ACTIONS.CHANGE_USER_INPUT,
        payload
    }
}

export const setOptions = (payload) => {
    return {
        type: ACTIONS.CHANGE_OPTIONS,
        payload
    }
}

export const setQuitGame = () => {
    return {
        type: ACTIONS.QUIT_GAME
    }
}