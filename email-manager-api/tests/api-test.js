const server = require('../src/bin/www');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

//Get emails

describe('Email', () => {
    describe('/GET emails', () => {
        it('it should GET emails', (done) => {
            chai.request(server)
                .get('/api/v1/email')
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});

describe('Create user', () => {
    it('it should create user', (done) => {
        chai.request(server)
            .post('/api/v1/user')
            .set('content-type', 'application/json')
            .send({
                "fullName": "Martian",
                "email": "martian@xyz.com"
            })
            .end((err, res) => {
                (res).should.have.status(200);
                (res.body).should.be.a('object');
                done();
            });
    });
}); 

describe('User emails', () => {
    it('it should create user emails relation', (done) => {
        chai.request(server)
            .post('/api/v1/user-email')
            .set('content-type', 'application/json')
            .send([{
                "userId": 1,
                "emailId": 1
            }])
            .end((err, res) => {
                (res).should.have.status(200);
                done();
            });
    });
}); 


describe('User and Sent Emails', () => {
    describe('/GET user emails', () => {
        it('it should GET user and emails sent to user', (done) => {
            chai.request(server)
                .get('/api/v1/user/sent/emails')
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});


describe('home', () => {
    describe('/', () => {
        it('home', (done) => {
            chai.request(server)
                .get('/status')
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});

describe('health', () => {
    describe('/', () => {
        it('health', (done) => {
            chai.request(server)
                .get('/status/health')
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});




