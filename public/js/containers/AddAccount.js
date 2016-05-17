import React from 'react'
import { connect } from 'react-redux'
import { addAccount } from '../actions'

let AddAccount = ({dispatch}) => {
    let input

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(addAccount(input.value))
        input.value = ''
    }

    return (
        <div>
          <form onSubmit={onSubmit}>
            <input ref={node => {input = node}}/>
            <button type>Add Account</button>
          </form>
        </div>
    )
}

AddAccount = connect()(AddAccount)
export default AddAccount
