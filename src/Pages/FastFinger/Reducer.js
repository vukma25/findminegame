
import { ACTIONS } from "./Action"

export const initialState = {
    'state': 'waiting',
    'targetParagraph': [],
    'userInput': [],
    'currentIndex': 0,
    'startTime': null,
    'wpm': 0,
    'accuracy': 100,
    'incorrectChars': 0,
    'correctChars': 0,
    'totalChars': 0,
    'options': {
        'duration': 60,
        'useUpper': false,
        'useMarkAndArticle': false
    }
}

export const reducer = (state, action) => {
    
    switch(action.type) {
        case ACTIONS.INITIALIZE_NEW_GAME:
            return {
                ...state,
                "targetParagraph": action.payload,
                'userInput': [],
                'currentIndex': 0,
                'startTime': Date.now(),
                'wpm': 0,
                'accuracy': 100,
                'incorrectChars': 0,
                'correctChars': 0,
                'totalChars': 0,
            }

        case ACTIONS.SET_STATE:
            return {
                ...state,
                "state": action.payload
            }

        case ACTIONS.CHANGE_USER_INPUT:

            const {
                buffer,
                newIndex,
                correct,
                incorrect,
                wpm,
                accuracy
            } = action.payload

            return {
                ...state,
                "userInput": [...state.userInput, buffer],
                "currentIndex": newIndex,
                "wpm": wpm,
                "accuracy": accuracy,
                "incorrectChars": incorrect,
                "correctChars": correct,
                "totalChars": state.totalChars + buffer.length,
            }

        case ACTIONS.CHANGE_OPTIONS:
            return {
                ...state,
                "options": {
                    ...state.options,
                    ...action.payload
                }
            }

        case ACTIONS.QUIT_GAME:
            return {
                ...state,
                'state': 'waiting',
                'targetParagraph': [],
                'userInput': [],
                'currentIndex': 0,
                'startTime': null,
                'wpm': 0,
                'accuracy': 100,
                'incorrectChars': 0,
                'correctChars': 0,
                'totalChars': 0,
            }

        default:
            throw new Error('Reducer received an invalid action')
    }
    
}