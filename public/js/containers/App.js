import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAccountsIfNeeded } from '../actions'

class App extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
         const { dispatch } = this.props
        dispatch(fetchAccountsIfNeeded())
    }
}

App.propTypes = {
    accounts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return { accounts: state.accounts }
}

export default connect(mapStateToProps)(App)
