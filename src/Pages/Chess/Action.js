
export const REPLACE_PIECE_ACTION = "REPLACE_PIECE"
export const PAWN_PROMOTION = "PAWN_PROMOTION"
export const NEW_GAME_ACTION = "NEW_GAME"

export const setReplacePiece = payload => {
    return {
        type: REPLACE_PIECE_ACTION,
        payload
    }
}

export const setPawnPromotion = payload => {
    return {
        type: PAWN_PROMOTION,
        payload
    }
}