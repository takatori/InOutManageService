import React, { Component, PropTypes } from 'react'

class AccountList extends Component {
    render () {
        const accounts = this.props
        
        return (
            <ul>
              { accounts.map(account => <li>{account}</li>) }
            </ul>
        )
    }
}

AccountList.propTypes = {
    accounts: PropTypes.array.isRequired
}

export default AccountList
