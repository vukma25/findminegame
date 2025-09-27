import SUDOKU_VARIANTS from './Variant'
import { ACTION } from './Action'

export const initialState = {
    "status": "waiting",
    "puzzle": [],
    "answers": [],
    "gameOver": false,
    "isWin": false,
    "squareActivating": null,
    "errors": {
        "times": 0,
        "square": new Set()
    },
    "semaphore": true, //cờ hiệu để dừng thời gian
    "variant": {
        "size": 9,
        "difficulty": SUDOKU_VARIANTS[9].difficulties[1].cellsToRemove
    },
    "loading": false

}

export const reducer = (state, action) => {

    switch(action.type) {
        case ACTION.INITIALIZE_NEW_GAME:
            const { puzzle, answers } = action.payload ?? { puzzle: [], answers: [] }

            return {
                ...state,
                "status": "waiting",
                "puzzle": puzzle,
                "answers": answers,
                "gameOver": false,
                "squareActivating": null,
                "errors": {
                    "times": 0,
                    "square": new Set()
                },
                "semaphore": true
            }

        case ACTION.SELECT_SQUARE: 
            return {
                ...state,
                "squareActivating": action.payload
            }

        case ACTION.FILL_SQUARE:
            return {
                ...state,
                "puzzle": action.payload.puzzle,
                "answers": action.payload.answers,
                "errors": action.payload.errors
            }

        case ACTION.MATCH_GAME_OVER:
            const { gameOver, isWin } = action.payload

            return {
                ...state,
                "gameOver": gameOver,
                "isWin": isWin,
                "squareActivating": null,
                "semaphore": true
            }

        case ACTION.START_GAME:
            return {
                ...state,
                "status": "playing",
                "semaphore": false
            }

        case ACTION.CHANGE_VARIANT:
            const { size, difficulty } = action.payload

            return {
                ...state,
                "variant": {
                    size,
                    difficulty
                }
            }

        case ACTION.LOADING:
            return {
                ...state,
                "loading": action.payload
            }

        case ACTION.OPEN_CORRECT: 
            return {
                ...state,
                "answers": action.payload
            }

        case ACTION.UNMOUNT_SQUARE: 
            return {
                ...state,
                "squareActivating": null
            }
        default:
            throw new Error("Invalid action")
    }
}