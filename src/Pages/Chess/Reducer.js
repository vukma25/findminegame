
import { 
    CREATE_EFFECT_ACTION,
    DISPLAY_MOVE_ACTION, 
    HIDDEN_MOVE_ACTION, 
    REPLACE_PIECE_ACTION 
} from "./Action"


export const initialState = {
    'board': [
        [{
            'square': 57,
            'type': 'br',
            'value': 5
        }, {
            'square': 58,
            'type': 'bn',
            'value': 3
        }, {
            'square': 59,
            'type': 'bb',
            'value': 3
        }, {
            'square': 60,
            'type': 'bq',
            'value': 9
        }, {
            'square': 61,
            'type': 'bk',
            'value': 10
        }, {
            'square': 62,
            'type': 'bb',
            'value': 3
        }, {
            'square': 63,
            'type': 'bn',
            'value': 3
        }, {
            'square': 64,
            'type': 'br',
            'value': 5
        }],
        [{
            'square': 49,
            'type': 'bp',
            'value': 1
        }, {
            'square': 50,
            'type': 'bp',
            'value': 1
        }, {
            'square': 51,
            'type': 'bp',
            'value': 1
        }, {
            'square': 52,
            'type': 'bp',
            'value': 1
        }, {
            'square': 53,
            'type': 'bp',
            'value': 1
        }, {
            'square': 54,
            'type': 'bp',
            'value': 1
        }, {
            'square': 55,
            'type': 'bp',
            'value': 1
        }, {
            'square': 56,
            'type': 'bp',
            'value': 1
        }],
        [{}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}],
        [{
            'square': 9,
            'type': 'wp',
            'value': 1
        }, {
            'square': 10,
            'type': 'wp',
            'value': 1
        }, {
            'square': 11,
            'type': 'wp',
            'value': 1
        }, {
            'square': 12,
            'type': 'wp',
            'value': 1
        }, {
            'square': 13,
            'type': 'wp',
            'value': 1
        }, {
            'square': 14,
            'type': 'wp',
            'value': 1
        }, {
            'square': 15,
            'type': 'wp',
            'value': 1
        }, {
            'square': 16,
            'type': 'wp',
            'value': 1
        }],
        [{
            'square': 1,
            'type': 'wr',
            'value': 5
        }, {
            'square': 2,
            'type': 'wn',
            'value': 3
        }, {
            'square': 3,
            'type': 'wb',
            'value': 3
        }, {
            'square': 4,
            'type': 'wq',
            'value': 9
        }, {
            'square': 5,
            'type': 'wk',
            'value': 10
        }, {
            'square': 6,
            'type': 'wb',
            'value': 3
        }, {
            'square': 7,
            'type': 'wn',
            'value': 3
        }, {
            'square': 8,
            'type': 'wr',
            'value': 5
        }]
    ],
    'pieces': [
        {
            'id': 1,
            'piece': 'bp',
            'square': 49,
            'coordinate': [1, 0]
        },
        {
            'id': 2,
            'piece': 'bp',
            'square': 50,
            'coordinate': [1, 1]
        },
        {
            'id': 3,
            'piece': 'bp',
            'square': 51,
            'coordinate': [1, 2]
        },
        {
            'id': 4,
            'piece': 'bp',
            'square': 52,
            'coordinate': [1, 3]
        },
        {
            'id': 5,
            'piece': 'bp',
            'square': 53,
            'coordinate': [1, 4]
        },
        {
            'id': 6,
            'piece': 'bp',
            'square': 54,
            'coordinate': [1, 5]
        },
        {
            'id': 7,
            'piece': 'bp',
            'square': 55,
            'coordinate': [1, 6]
        },
        {
            'id': 8,
            'piece': 'bp',
            'square': 56,
            'coordinate': [1, 7]
        },
        {
            'id': 9,
            'piece': 'br',
            'square': 57,
            'coordinate': [0, 0]
        },
        {
            'id': 10,
            'piece': 'bn',
            'square': 58,
            'coordinate': [0, 1]
        },
        {
            'id': 11,
            'piece': 'bb',
            'square': 59,
            'coordinate': [0, 2]
        },
        {
            'id': 12,
            'piece': 'bq',
            'square': 60,
            'coordinate': [0, 3]
        },
        {
            'id': 13,
            'piece': 'bk',
            'square': 61,
            'coordinate': [0, 4]
        },
        {
            'id': 14,
            'piece': 'bb',
            'square': 62,
            'coordinate': [0, 5]
        },
        {
            'id': 15,
            'piece': 'bn',
            'square': 63,
            'coordinate': [0, 6]
        },
        {
            'id': 16,
            'piece': 'br',
            'square': 64,
            'coordinate': [0, 7]
        },
        {
            'id': 17,
            'piece': 'wp',
            'square': 9,
            'coordinate': [6, 0]
        },
        {
            'id': 18,
            'piece': 'wp',
            'square': 10,
            'coordinate': [6, 1]
        },
        {
            'id': 19,
            'piece': 'wp',
            'square': 11,
            'coordinate': [6, 2]
        },
        {
            'id': 20,
            'piece': 'wp',
            'square': 12,
            'coordinate': [6, 3]
        },
        {
            'id': 21,
            'piece': 'wp',
            'square': 13,
            'coordinate': [6, 4]
        },
        {
            'id': 22,
            'piece': 'wp',
            'square': 14,
            'coordinate': [6, 5]
        },
        {
            'id': 23,
            'piece': 'wp',
            'square': 15,
            'coordinate': [6, 6]
        },
        {
            'id': 24,
            'piece': 'wp',
            'square': 16,
            'coordinate': [6, 7]
        },
        {
            'id': 25,
            'piece': 'wr',
            'square': 1,
            'coordinate': [7, 0]
        },
        {
            'id': 26,
            'piece': 'wn',
            'square': 2,
            'coordinate': [7, 1]
        },
        {
            'id': 27,
            'piece': 'wb',
            'square': 3,
            'coordinate': [7, 2]
        },
        {
            'id': 28,
            'piece': 'wq',
            'square': 4,
            'coordinate': [7, 3]
        },
        {
            'id': 29,
            'piece': 'wk',
            'square': 5,
            'coordinate': [7, 4]
        },
        {
            'id': 30,
            'piece': 'wb',
            'square': 6,
            'coordinate': [7, 5]
        },
        {
            'id': 31,
            'piece': 'wn',
            'square': 7,
            'coordinate': [7, 6]
        },
        {
            'id': 32,
            'piece': 'wr',
            'square': 8,
            'coordinate': [7, 7]
        }
    ],
    'squares': {
        '1': [0, 695],
        '2': [100, 695],
        '3': [200, 695],
        '4': [300, 695],
        '5': [400, 695],
        '6': [500, 695],
        '7': [600, 695],
        '8': [700, 695],

        '9': [0, 595],
        '10': [100, 595],
        '11': [200, 595],
        '12': [300, 595],
        '13': [400, 595],
        '14': [500, 595],
        '15': [600, 595],
        '16': [700, 595],

        '17': [0, 496],
        '18': [100, 496],
        '19': [200, 496],
        '20': [300, 496],
        '21': [400, 496],
        '22': [500, 496],
        '23': [600, 496],
        '24': [700, 496],

        '25': [0, 398],
        '26': [100, 398],
        '27': [200, 398],
        '28': [300, 398],
        '29': [400, 398],
        '30': [500, 398],
        '31': [600, 398],
        '32': [700, 398],

        '33': [0, 300],
        '34': [100, 300],
        '35': [200, 300],
        '36': [300, 300],
        '37': [400, 300],
        '38': [500, 300],
        '39': [600, 300],
        '40': [700, 300],

        '41': [0, 200],
        '42': [100, 200],
        '43': [200, 200],
        '44': [300, 200],
        '45': [400, 200],
        '46': [500, 200],
        '47': [600, 200],
        '48': [700, 200],

        '49': [0, 100],
        '50': [100, 100],
        '51': [200, 100],
        '52': [300, 100],
        '53': [400, 100],
        '54': [500, 100],
        '55': [600, 100],
        '56': [700, 100],

        '57': [0, 0],
        '58': [100, 0],
        '59': [200, 0],
        '60': [300, 0],
        '61': [400, 0],
        '62': [500, 0],
        '63': [600, 0],
        '64': [700, 0],
    },
    'effectSquare': {
        'square': 0,
        'display': 'none'
    }
}

export const reducer = (state, action) => {

    //console.log(action.type)

    switch (action.type) {
        case CREATE_EFFECT_ACTION:
            return {
                ...state,
                'effectSquare': {
                    ...state.effectSquare,
                    ...action.payload
                }
            }
        case DISPLAY_MOVE_ACTION:
            return {
                ...state,
                'board': action.payload
            }
        case HIDDEN_MOVE_ACTION:
            return {
                ...state,
                'board': action.payload,
                'effectSquare': {
                    'square': 0,
                    'display': 'none'
                }
            }
        case REPLACE_PIECE_ACTION: 
            return {
                ...state,
                ...action.payload
            }
        default:
            throw new Error("Invalid action")
    }

}