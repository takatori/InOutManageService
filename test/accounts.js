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

            
            Account.create(account, (err, createdAccount) => {
                // Confirm that an error does not exist
                should.not.exist(err)
                createdAccount.id.should.equal(1)
                createdAccount.name.should.equal('takatori')
                createdAccount.password.should.equal('satoshi')
                createdAccount.icon_image_url.should.equal('https://placeimg.com/640/480/any')
                done()
            })
        })
    })

    describe('#fetch()', () => {
        it('should fetch a Account by id', done => {
            Account.fetch(1, (err, account) => {
                should.not.exist(err)
                should.exist(account)
                account.id.should.equal(1)
                account.name.should.equal('takatori')
                account.password.should.equal('satoshi')
                account.icon_image_url.should.equal('https://placeimg.com/640/480/any')
                done()
            })
        })
    })
})


