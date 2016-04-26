'use strict'

// import the mongoose helper utilities
import utils from './utils'
import should from 'should'
import Account from '../models/accounts'

describe('Accounts: models', () => {

    describe('#create()', () => {
        it('should create a new Account', done => {
            // Create a Account object to pass
            const account = {
                name: 'takatori',
                password: 'satoshi',
                icon_image_url: 'https://placeimg.com/640/480/any'
            };

            
            Account.create(account, (err, craetedUser) => {
                // Confirm that an error does not exist
                should.not.exist(err)
                done()
            })
        })
    })
})
