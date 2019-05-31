process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : users', () => {

    // the migrations are applied to the test database
    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run();});
    });

    // the test database is rolled back to the initial state
    afterEach(() => {
        return knex.migrate.rollback();
    });

    describe('GET /api/users', () => {
        it('should return all users', (done) => {
            // authenticating (required for accessing the api)
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'valentin23',
                        password: 'val123',
                    }
                })
                .end((err, res) => {
                    chai.request(server)
                        .get('/api/users')
                        .set({
                            authorization: res.body.data.token
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal('application/json');
                            res.body.status.should.eql('success');
                            res.body.data.users.length.should.eql(5);
                            res.body.data.users[0].should.include.keys(
                                'id', 'login', 'mail', 'firstName', 'lastName', 'avatar'
                            );
                            done();
                        });
                });
        });
    });

    describe('GET /api/users/:id', () => {
        it('should respond with a single user', (done) => {
            // authenticating (required for accessing users)
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'valentin23',
                        password: 'val123',
                    }
                })
                .end((err, res) => {
                    chai.request(server)
                        .get('/api/users/1')
                        .set({
                            authorization: res.body.data.token
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal('application/json');
                            res.body.status.should.eql('success');
                            res.body.data.user.should.include.keys(
                                'id', 'login', 'mail', 'firstName', 'lastName', 'avatar'
                            );
                            done();
                        });
                });
        });
        it('should throw an error if the user does not exist', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'valentin23',
                        password: 'val123',
                    }
                })
                .end((err, res) => {
                    chai.request(server)
                        .get('/api/users/9999999')
                        .set({
                            authorization: res.body.data.token
                        })
                        .end((err, res) => {
                            should.exist(err);
                            res.status.should.equal(404);
                            res.type.should.equal('application/json');
                            res.body.status.should.eql('error');
                            res.body.message.should.eql('User not found');
                            done();
                        });
                });
        });
    });

    describe('POST /api/users/register', () => {
        it('should return the user that was added', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    user: {
                        login: 'ira',
                        mail: 'irinabespalova@gmail.com',
                        password: 'irinabespalova5',
                        firstName: 'Ирина',
                        lastName: 'Беспалова',
                    }
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('success');
                    res.body.data.user.should.include.keys(
                        'id', 'login', 'mail', 'firstName', 'lastName', 'avatar'
                    );
                    done();
                });
        });


        it('should throw an error if the payload is malformed', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    user: {
                        firstName: 'Александр'
                    }
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('error');
                    should.exist(res.body.message);
                    done();
                });
        });

        it('should throw an error if the login is already used', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    user: {
                        login: 'valentin23',
                        password: 'newpassword'
                    }
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(409);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('error');
                    should.exist(res.body.message);
                    done();
                });
        });

        it('should throw an error if the mail is already used', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    user: {
                        login: 'newlogin',
                        mail: 'valentin23@gmail.com',
                        password: 'newpassword'
                    }
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(409);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('error');
                    should.exist(res.body.message);
                    done();
                });
        });
    });

    describe('POST /api/users/auth', () => {
        it('should return the user logged in', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'natamur',
                        password: 'Natamur332',
                    }
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('success');
                    res.body.data.user.should.include.keys(
                        'id', 'login', 'mail', 'firstName', 'lastName', 'avatar'
                    );
                    done();
                });
        });

        it('should throw an error if the authentication fails (wrong login)', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'qsdqsdqsd',
                        password: 'qsdsqdqsd',
                    }
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('error');
                    should.exist(res.body.message);
                    done();
                });
        });
        it('should throw an error if the authentication fails (wrong password)', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .send({
                    user: {
                        login: 'valentin23',
                        password: 'qsdsqdqsd',
                    }
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(422);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('error');
                    should.exist(res.body.message);
                    done();
                });
        });
    });

    describe('PUT /api/users/update', () => {
        it('should return the user that was updated', (done) => {
                // creating a new user
                chai.request(server)
                    .post('/api/users/register')
                    .send({
                        user: {
                            login: 'testuser000333999',
                            mail: 'onemail@onemail.com',
                            password: 'testuser000333999',
                        }
                    })
                    .end(() => {
                        // authenticating as the new user (required for update)
                        chai.request(server)
                            .post('/api/users/auth')
                            .send({
                                user: {
                                    login: 'testuser000333999',
                                    password: 'testuser000333999',
                                }
                            })
                            .end((err, res) => {
                                const userObj = res.body.data.user;
                                // updating the user
                                chai.request(server)
                                    .put(`/api/users/update`)
                                    .set({
                                        authorization: res.body.data.token
                                    })
                                    .send({
                                        user: {
                                            id: userObj.id,
                                            mail: 'anothermail@anothermail.com',
                                        },
                                        passwordOld: 'testuser000333999',
                                        passwordNew: '123123123123',
                                    })
                                    .end((err, res) => {
                                        should.not.exist(err);
                                        res.status.should.equal(200);
                                        res.type.should.equal('application/json');
                                        res.body.status.should.eql('success');
                                        res.body.data.user.should.include.keys(
                                            'id', 'login', 'mail', 'firstName', 'lastName', 'avatar'
                                        );
                                        const newUserObj = res.body.data.user;
                                        newUserObj.mail.should.not.eql(userObj.mail);
                                        done();
                                    });
                            });
                    });
            }
        );
    });
});
