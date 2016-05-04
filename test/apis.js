'use strict'

import utils from './utils'
import app from '../app'
import should from 'should'
import request from 'supertest-promised'

describe('apis', () => {

    describe('/apis/accounts', () => {
        it('should return account list', () => {
            return request(app)
                .get('/apis/accounts')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {
                    res.body.accounts.should.lengthOf(3)
                })
                .end()
        })
    })

    describe('/apis/accounts/:id/inout', () => {
        it('should change the account state', () => {
            return request(app)
                .get('/apis/accounts/1/inout')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {                                                            
                    res.body.message.should.equal('Succeeded in changing the 1 state')
                })
                .end()            
        })
    })

    describe('/apis/accounts/in/count', () => {
        it('should count in accounts', () => {
            return request(app)
                .get('/apis/accounts/in/count')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {                                        
                    res.body.count.should.equal(1)
                })
                .end()            
        })
    })    

    describe('/apis/accounts/in', () => {
        it('should return in accounts', () => {
            return request(app)
                .get('/apis/accounts/in')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {
                    res.body.accounts.should.lengthOf(1)
                })
                .end()
        })
    })

    describe('/apis/accounts', () => {
        it('should create an account', () => {
            return request(app)
                .post('/apis/accounts')
                .send({
                        name: 'tori',
                        password: 'tak',
                        icon_image_url: 'https://placeimg.com/640/480/any'})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {
                    res.body.message.should.equal(`Succeeded in create account`)
                })
                .end()
        })
    })

    describe('/apis/accounts/:id', () => {
        it('should update an account', () => {
            return request(app)
                .post('/apis/accounts/1')
                .send({
                    name: 'tktr',
                    password: 'satoshi',
                    new_password: 'updated_password',
                    icon_image_url: ''
                })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {
                    res.body.message.should.equal(`Succeeded in update the account`)                    
                })
                .end()
        })
    })

    describe('/apis/accounts/:id', () => {
        it('should delete an account', () => {
            return request(app)
                .delete('/apis/accounts/1')
                .send({
                    password: 'satoshi'
                })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
                .expect(res => {
                    res.body.message.should.equal(`Succeeded in delete the account`)                    
                })
                .end()
        })
    })
    
})
