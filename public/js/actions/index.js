import fetch from 'isomorphic-fetch'

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


/**
 * 非同期処理では呼び出し時と応答を受け取った時に状態が変化する
 * 普通どんなAPI呼び出しでも少なくとも3つの異なるdispatchが必要になる
 * - reducerにリクエストが始まったことを知らせるaction  ex: { type: 'FETCH_POSTS_REQUEST' } or { type: 'FETCH_POSTS' }
 * - reducerにリクエストが正常に終了したことを知らせるaction ex: { type: 'FETCH_POSTS_SUCCESS', response: { ... } } or  { type: 'FETCH_POSTS', status: 'success', response: { ... } }
 * - reducerにリクエストが失敗したことを知らせるaction ex: { type: 'FETCH_POSTS_FAILURE', error: 'Oops' } or { type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
 */
export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS'
export function requestAccounts() {
    return {
        type: FETCH_ACCOUNTS
    }
}

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'
export function receiveAccounts(accounts) {
    return {
        type: RECEIVE_ACCOUNTS,
        accounts: accounts
    }
}

/**
 * どうやって上記の動機的なaction creatorをネットワークリクエストとともに使うか
 * ``redux-thunk``を使う。このような特定のミドルウェアを利用することで
 * action createrはオブジェクトの代わりに関数を返すことができるようになる。
 * 関数は純粋関数でなくてもよく非同期APIコールのような副作用のある関数でもよい。
 * thunk action creatorは他のaction creatorのように利用することができる。
 * store.dispather(fetchAccounts())
 */
function fetchAccounts(store) {
    // 非同期処理
    // thunkミドルウェアはdispatchメソッドを引数として関数に渡す
    return function(dispatch) {
        // first dispatch: APIコールが開始されたことを伝えるためにstateを更新する
        dispatch(requestAccounts())

        // thunkミドルウェアから呼ばれる関数は値を返すことができる
        // dispatchメソッドの返り値として渡される
        // 本ケースではpromiseオブジェクトを返すが
        // thunkではpromiseは必須ではない。
        return fetch('localhost:3000/apis/accounts')
            .then(response => response.json())
            .then(json => {
                console.log(json)
                // APIコールの結果によってアプリケーションの状態を更新する
                dispatch(receiveAccounts(json))
            })
    }
}

export function fetchAccountsIfNeeded() {

    return (dispatch, getState) => {
        if(getState().isFetching) {
            return Promise.resolve();
        } else {
            return dispatch(fetchAccounts())
        }
    }
}
