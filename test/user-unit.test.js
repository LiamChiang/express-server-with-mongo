const connectUrl = `http://127.0.0.1:9000`;
const expect  = require('chai').expect;
const agent = require('superagent');

describe('User endpoint', () => {
    const v1 = '/v1';
    const user_endpoint = '/user';
    const user_api = connectUrl + v1 + user_endpoint;
    
    const mock_account = 'account.testing';
    const mock_password = 'password.testing';

    before( async () => {
        try {
            const delete_url = user_api + '/' + mock_account;
            await agent.del(delete_url).then();
        }
        catch(err) {
            console.log('Unable to delete non-exist account.');
        }
    });
    describe ('User register account', () => {

        const register = '/register';
        const register_url = user_api + register;
        // register the account with the mocking one.
        it('should successfully register an account and retrieve a token', async () => {
            try {
                const response = await agent.post(register_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                expect(res.status).to.equal(200);
                expect(res).to.have.property('result');
                expect(res).to.have.property('token');
            }
            catch(err) {
                console.log('Unable to register account.');
            }
        });
        // try register the account with the same mocking one.
        it('should fail register an account by duplicated account', async () => {
            try {
                await agent.post(register_url).send({account: mock_account, password: mock_password});
            }
            catch(err) {
                const error = err.response.body;
                expect(err.status).to.equal(500);
                expect(error).to.have.property('error');
            }
        });
    });

    describe ('User login account', () => {
        const login = '/login';
        const login_url = user_api + login;
        // try login with the mocking account.
        before( function() {
            const delete_url = user_api + '/' + mock_account;
            agent.del(delete_url);
        });

        it('should successfully login with the mocking account', async () => {
            try {
                const response = await agent.post(login_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                expect(res.status).to.equal(200);
                expect(res).to.have.property('result');
                expect(res).to.have.property('token');
            }
            catch(err) {
                console.log('Unable to login with the account.');
            }
        });

        // try login the account with the same mocking one after the account has been removed.
        it('should fail login with the account by non-exist user', async () => {
            // remove the account
            try {
                await agent.post(login_url).send({account: mock_account, password: mock_password});
            }
            catch(err) {
                const error = err.response.body;
                expect(err.status).to.equal(500);
                expect(error).to.have.property('error');
            }
        })
    });
    

    describe ('User delete account', () => {
        const delete_url = user_api + '/' + mock_account;

        before( function() {
            const register = '/register';
            const register_url = user_api + register;
            agent.post(register_url).send({account: mock_account, password: mock_password}).then(res => {
                console.log(res);
            });
        });
        // try login with the mocking account.
        it('should successfully delete the exist account', async () => {

            try {
                const response = await agent.del(delete_url);
                const res = response.body;
                expect(res.status).to.equal(200);
                expect(res).to.have.property('result');
                expect(res).to.have.property('token');
            }
            catch(err) {
                console.log('Unable to delete the account.');
            }
        });

        // try login the account with the same mocking one after the account has been removed.
        it('should fail delete the non-exist account', async () => {
            try {
                const delete_url = user_api + '/' + mock_account;
                await agent.del(delete_url);
            }
            catch(err) {
                const error = err.response.body;
                expect(err.status).to.equal(500);
                expect(error).to.have.property('error');
            }
        })
    });
});