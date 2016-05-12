import React, { PropTypes } from 'react'

const AccountList = ({ accounts }) => (
    <ul>
      {accounts.map(account => <li>{account}</li>)}
    </ul>
)

AccountList.propTypes = {
    accounts: PropTypes.array.isRequired
}

export default AccountList
