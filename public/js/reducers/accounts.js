
function accounts(state={
    isFetching: false,
    accounts: []
}, action) {
    switch(action.type) {
    case 'FETCH_ACCOUNTS':
        return Object.assign({}, state, {isFetching: true})
    case 'RECIVE_ACCOUNTS':
        return Object.assign({}, state, {isFetching: false, accounts: action.accounts})        
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
