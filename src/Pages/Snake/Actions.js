const ACTIONS = {
    CHANGE_DIRECT: "change_direct",
    SPAWN_FOOD: "spawn_food",
    SNAKE_STATE: "snake_state",
    LISTEN_STATUS: "listen_status",
    SET_SPEED: "set_speed",
    SET_PAUSE: "set_pause",
    SETTING_SIZE: "setting_size",
    SETTING_MODE: "setting_mode",
    SELECT_MAP: "select_map",
    SNAKE_ATE: "snake_ate",
    NEW_GAME: "new_game"
}

const createAction = (type, payload = "THIS_IS_UNIQUE_FLAG") => {
    if (payload === "THIS_IS_UNIQUE_FLAG") {
        return { type: type }
    }
    return {
        type: type,
        payload: payload
    }
}

export const preHandleAction = {
    handleChangeDirect: (payload) => createAction(ACTIONS.CHANGE_DIRECT, payload),
    handleSpawnFood: (payload) => createAction(ACTIONS.SPAWN_FOOD, payload),
    handleSnakeState: (payload) => createAction(ACTIONS.SNAKE_STATE, payload),
    handleListenStatus: (payload) => createAction(ACTIONS.LISTEN_STATUS, payload),
    handleSettingSize: (payload) => createAction(ACTIONS.SETTING_SIZE, payload),
    handleSettingMode: (payload) => createAction(ACTIONS.SETTING_MODE, payload),
    handleSelectMap: (payload) => createAction(ACTIONS.SELECT_MAP, payload),
    handleSnakeAte: (payload) => createAction(ACTIONS.SNAKE_ATE, payload),
    handleSetSpeed: (payload) => createAction(ACTIONS.SET_SPEED, payload),
    handleSetPause: () => createAction(ACTIONS.SET_PAUSE),
    handleSetNewGame: (payload) => createAction(ACTIONS.NEW_GAME, payload),
}

export default ACTIONS