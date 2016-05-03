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
                .then(result => Account.fetch(result.id)) // function(result) { return Account.fetch(result.id);}
                .then(account => {
                    account.name.should.equal('takatori')
                    account.password.should.equal('satoshi')
                    account.icon_image_url.should.equal('https://placeimg.com/640/480/any')
                })
        })
    })
    
    describe('#fetchInAccounts()', () => {
        it('should fetch in Accounts', () => {
            return Account.fetchInAccounts()
                .then(accounts => {
                    accounts.should.lengthOf(2)
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

    describe('#countInAccounts', () => {
        it('should count in accounts', () => {
            return Account.countInAccounts()
                .then(result => {
                    result.should.equal(2)
                })
        })
    })

    describe('#all', () => {
        it('should dump all accounts without _id', () => {
            return Account.all()
                .then(accounts => {
                    accounts.should.lengthOf(3)
                    accounts[0].should.not.have.ownProperty('_id')
                    accounts[1].should.not.have.ownProperty('_id')
                    accounts[2].should.not.have.ownProperty('_id')                                        
                })
        })
    })

    describe('#delete', () => {
        it('should delete the account by id', () => {
            return Account.list()
                .then(accounts => {
                    Account.delete(accounts[0].id)
                })
                .then(() => Account.list())
                .then(accounts => {
                    accounts.should.lengthOf(2)
                })
        })
    })


    describe('#changeState', () => {
        it('should change a account state', () => {
            return Account.fetchInAccounts()
                .then(accounts => {
                    accounts[0].changeState()
                    accounts[1].changeState()
                })
                .then(() => Account.fetchInAccounts())
                .then(accounts => {
                    accounts.should.lengthOf(0)
                })
        })
    })

    describe('#update', () => {
        it('should update a account', () => {
            return Account.list()
                .then(accounts => {
                    accounts[0].update('update', 'update', 'http://....')
                    return accounts[0].id
                })
                .then((id) => Account.fetch(id))
                .then(account => {
                    account.name.should.equal('update')
                    account.password.should.equal('update')
                    account.icon_image_url.should.equal('http://....')      
                })
        })
    })    
    
})


