
import ACTIONS from "./Action"

export const initialState = {
    "status": "waiting",
    "name": "Caro",
    "size": 15,
    "board": Array.from({length: 15}, () => Array.from({length: 15}, () => 0)),
    "currentPlayer": 1,
    "mode": "AI",
    "aiDifficulty": "medium",
    "aiThinking": false,
}

export const reducer = (state, action) => {

    switch(action.type) {
        case ACTIONS.CLICK_CELL:
            return {
                ...state,
                "board": action.payload,
                "currentPlayer": state.currentPlayer === 1 ? 2 : 1
            }

        case ACTIONS.CHANGE_STATUS:
            return {
                ...state,
                "status": action.payload
            }

        case ACTIONS.CHANGE_MODE:
            return {
                ...state,
                "mode": action.payload
            }

        case ACTIONS.CHANGE_AI_DIFFICULTY:
            return {
                ...state,
                "aiDifficulty": action.payload
            }

        case ACTIONS.AI_THINKING:
            return {
                ...state,
                "aiThinking": action.payload
            }

        case ACTIONS.CHANGE_CARO_VARIANT:
            const { name, board, size } = action.payload

            return {
                ...state,
                "name": name,
                "board": board,
                "size": size
            }

        case ACTIONS.REFRESH_GAME:
            return {
                ...state,
                "status": "waiting",
                "board": Array.from({ length: state.size }, () => Array.from({ length: state.size }, () => 0)),
                "currentPlayer": 1,
            }

        default:
            throw new Error("Reducer receives an invalid action")
    }
}