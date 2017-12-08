var assert = require('assert');
var request = require('request');

describe('API test', function() {
    var userToken = null;
    describe('POST /users/auth', function() {
        it('should return success true and user token', function(done) {
            request.post('http://127.0.0.1:3000/users/auth', {
                json: {
                    email: 'test@test.com',
                    password: '12345678'
                }
            },
            function (err, response, body) {
                if(err) {
                    done(err)
                }
                assert.equal(200, response.statusCode)
                assert.equal(true, body.success)
                userToken = body.token
                done()
            });
        });
    });

    describe('GET /reports/types', function() {
        it('should return 200 and report types', function(done) {
            request.get('http://127.0.0.1:3000/reports/types', {
            },
            function (err, response, body) {
                if(err) {
                    done(err)
                }
                console.log(body)
                assert.equal(200, response.statusCode)
                done()
            });
        });
    });

    describe('GET /reports/history', function() {
        it('should return 200 and all user report', function(done) {
            request.get('http://127.0.0.1:3000/reports/history', {
                json: {
                    token: userToken,
                }
            },
            function (err, response, body) {
                if(err) {
                    done(err)
                }
                assert.equal(200, response.statusCode)
                done()
            });
        });
    });

    describe('POST /reports/createbyname', function() {
        it('should return code 200 and success true', function(done) {
            request.post('http://127.0.0.1:3000/reports/createbyname', {
                json: {
                    token: userToken,
                    latitude: 5.5,
                    longitude: 6.5,
                    type: 'embouteillage'
                }
            },
            function (err, response, body) {
                if(err) {
                    done(err)
                }
                assert.equal(200,  response.statusCode)
                assert.equal(true, body.success)
                done()
            });
        });
    });
});
