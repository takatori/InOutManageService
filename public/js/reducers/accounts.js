function accounts(state=[], action) {
    switch(action.type) {
    case 'ADD_ACCOUNT':
        return [
                ...state,
            {}
        ]
    case 'UPDATE_ACCOUNT':
        return state
    case 'DELTE_ACCOUNT':
        return state
    case 'CHANGE_STATE_ACCOUNT':
        return state
    default:
        return state
    }
}

export default accounts
