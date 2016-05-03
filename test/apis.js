'use strict'

import utils from './utils'
import app from '../app'
import should from 'should'
import request from 'supertest'

describe('apis', () => {

    describe('/apis/accounts', () => {
        it('should return account list', () => {
            request(app)
                .get('/apis/accounts')
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect(res => {
                    res.body.accounts.should.lengthOf(3)
                })
        })
    })

})
