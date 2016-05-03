'use strict'

// import the mongoose helper utilities
import utils from './utils'
import should from 'should'
import Account from '../models/accounts'

describe('models', () => {
    
    describe('#create()', () => {
        it('should create a new Account', () => {
            // Create a Account object to pass
            const account = {
                name: 'takatori',
                password: 'satoshi',
                icon_image_url: 'https://placeimg.com/640/480/any'
            };

            return Account.create(account)
                .then(account => {
                    account.name.should.equal('takatori')
                    account.password.should.equal('satoshi')
                    account.icon_image_url.should.equal('https://placeimg.com/640/480/any')
                })
            })
        })

    describe('#fetch()', () => {
        it('should fetch a Account by id', () => {
            const account = {
                name: 'takatori',
                password: 'satoshi',
                icon_image_url: 'https://placeimg.com/640/480/any'
            };
            
            return Account.create(account)
                .then(result => {
                    return Account.fetch(result.id)
                })
                .then(account => {
                    account.name.should.equal('takatori')
                    account.password.should.equal('satoshi')
                    account.icon_image_url.should.equal('https://placeimg.com/640/480/any')
                })
        })
    })

    describe('#list()', () => {
        it('should fetch Accounts', () => {
            return Account.list()
                .then(accounts => {
                    accounts.should.lengthOf(3)
                })
        })
    })
    
})


