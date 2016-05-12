// Action Creator
export function addAccount(account) {
    return { type: 'ADD_ACCOUNT', account}
}

export function updateAccount(account) {
    return { type: 'UPDATE_ACCOUNT', account}
}

export function deleteAccount(account) {
    return { type: 'DELETE_ACCOUNT', account}
}

export function changeState(account) {
    return { type: 'CHANGE_STATE_ACCOUNT', account}
}
