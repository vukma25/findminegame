
const ACTIONS = {
    CLICK_CELL: "click_cell",
    AI_THINKING: "ai_thinking",
    CHANGE_MODE: "change_mode",
    CHANGE_AI_DIFFICULTY: "ai_difficulty",
    CHANGE_CARO_VARIANT: "change_variant",
    CHANGE_STATUS: "change_status",
    REFRESH_GAME: "refresh_game" 
}

export const setBoard = (payload) => {
    return {
        type: ACTIONS.CLICK_CELL,
        payload
    }
}

export const setAIThinking = (payload) => {
    return {
        type: ACTIONS.AI_THINKING,
        payload
    }
}

export const setMode = (payload) => {
    return {
        type: ACTIONS.CHANGE_MODE,
        payload
    }
}

export const setAiDifficulty = (payload) => {
    return {
        type: ACTIONS.CHANGE_AI_DIFFICULTY,
        payload
    }
}


export const setVariant = (payload) => {
    return {
        type: ACTIONS.CHANGE_CARO_VARIANT,
        payload
    }
}

export const setStatus = (payload) => {
    return {
        type: ACTIONS.CHANGE_STATUS,
        payload
    }
}

export const setNewGame = () => {
    return {
        type: ACTIONS.REFRESH_GAME
    }
}

export default ACTIONS