import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addAccount } from '../actions'

class AddAccount extends Component {
    
    constructor(props){
        super(props)
        this.input = '' 
    }
    
    onSubmit(e) {
        const dispatch = this.props
        e.preventDefault()
        dispatch(addAccount(this.input.value))
        this.input.value = ''
    }

    render() {
        return (
                <div>
                <form onSubmit={this.onSubmit}>
                <input ref={node => {this.input = node}}/>
                <button type>Add Account</button>
                </form>
                </div>
        )
    }
}

AddAccount = connect()(AddAccount)
export default AddAccount
