const connectUrl = `http://127.0.0.1:9000`;
const expect  = require('chai').expect;
const agent = require('superagent');

describe('Products endpoint', () => {
    const v1 = '/v1';
    const products_endpoint = '/products';
    const products_api = connectUrl + v1 + products_endpoint;
    const mock_name = 'name.testing';
    const mock_code = 'code.testing';
    const mock_status = 'new';


    describe ('Create Product', () => {
        before( async() => {
            const user_endpoint = '/user';
            const user_api = connectUrl + v1 + user_endpoint;
            const register = '/register';
            const register_url = user_api + register;
    
            const mock_account = 'account.testing';
            const mock_password = 'password.testing';
    
            try {
                const response = await agent.post(register_url).send({account: mock_account, password: mock_password});   
                const res = response.body;
                this.token = res.token;
            }
            catch(err) {
                const login = '/login';
                const login_url = user_api + login;
                const response = await agent.post(login_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                this.token = res.token;
            }
        });

        it('should successfully create a product', async () => {
            try {
                const delete_url = products_api + '/' + mock_code;
                await agent.del(delete_url).auth(this.token, { type: 'bearer' });;
                
                const response = await agent.post(products_api).send({name: mock_name, code: mock_code, status: mock_status}).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(200);
                expect(res).to.have.property('result');
            }
            catch(err) {}
        });
        
        it('should fail create product by same product code', async () => {
            try {
                await agent.post(products_api).send({name: mock_name, code: mock_code, status: mock_status}).auth(this.token, { type: 'bearer' });;
            }
            catch(err) {
                const error = err.response.body;
                expect(err.status).to.equal(500);
                expect(error).to.have.property('error');
            }
        });

        it('should fail create the product when no auth token provide', async () => {
            try {
                await agent.post(products_api).send({name: 'testing', status: 'released'});
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token required.');
            }
        });

        it('should fail create the product with invalid auth token provide', async () => {
            try {
                await agent.post(products_api).auth('testing-token', { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token invalid.');
            }
        });
    });

    describe ('Get products', () => {
        before( async() => {
            const user_endpoint = '/user';
            const user_api = connectUrl + v1 + user_endpoint;
            const register = '/register';
            const register_url = user_api + register;

            const mock_account = 'account.testing';
            const mock_password = 'password.testing';

            try {
                const response = await agent.post(register_url).send({account: mock_account, password: mock_password});   
                const res = response.body;
                this.token = res.token;
            }
            catch(err) {
                const login = '/login';
                const login_url = user_api + login;
                const response = await agent.post(login_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                this.token = res.token;
            }
        });

        it('should successfully get the product by code', async () => {
            try {
                const get_prod_by_code = `${products_api}/${mock_code}`;
                const response = await agent.get(get_prod_by_code).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(200);
                expect(res).to.have.property('result');
                expect(res.result).to.have.property('name');
                expect(res.result).to.have.property('code');
                expect(res.result).to.have.property('date');
                expect(res.result).to.have.property('status');

            }
            catch(err) {}
        });

        it('should fail get the product when product does not exist', async () => {
            try {
                const get_prod_by_code = `${products_api}/${mock_code}`;
                await agent.get(get_prod_by_code).auth(this.token, { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(404);
                expect(error.error).to.equal('Unable to find a non-exist product.');
            }
        });

        it('should fail get the product when no auth token provide', async () => {
            try {
                const get_prod_by_code = `${products_api}/${mock_code}`;
                await agent.get(get_prod_by_code);
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token required.');
            }
        });

        it('should fail get the product with invalid auth token provide', async () => {
            try {
                const get_prod_by_code = `${products_api}/${mock_code}`;
                await agent.get(get_prod_by_code).auth('testing-token', { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token invalid.');
            }
        });

    });

    describe ('Update product', () => {
        before( async() => {
            const user_endpoint = '/user';
            const user_api = connectUrl + v1 + user_endpoint;
            const register = '/register';
            const register_url = user_api + register;

            const mock_account = 'account.testing';
            const mock_password = 'password.testing';

            try {
                const response = await agent.post(register_url).send({account: mock_account, password: mock_password});   
                const res = response.body;
                this.token = res.token;
            }
            catch(err) {
                const login = '/login';
                const login_url = user_api + login;
                const response = await agent.post(login_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                this.token = res.token;
            }
        });  
        
        it('should successfully update the product name as "this-is-updated-product"', async () => {
            try {
                const update_prod_by_code = `${products_api}/${mock_code}`;
                const response = await agent.put(update_prod_by_code).send({name: 'this-is-updated-product'}).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(203);
                expect(res).to.have.property('result');
                expect(res.result).to.have.property('name');
                expect(res.result.name).to.equal('this-is-updated-product');
            }
            catch(err) {}
        });

        it('should successfully update the product status as "modify"', async () => {
            try {
                const update_prod_by_code = `${products_api}/${mock_code}`;
                const response = await agent.put(update_prod_by_code).send({status: 'modify'}).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(203);
                expect(res).to.have.property('result');
                expect(res.result).to.have.property('status');
                expect(res.result.status).to.equal('modify');
            }
            catch(err) {}
        });

        it('should successfully update the product status as "released"', async () => {
            try {
                const update_prod_by_code = `${products_api}/${mock_code}`;
                const response = await agent.put(update_prod_by_code).send({status: 'released'}).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(203);
                expect(res).to.have.property('result');
                expect(res.result).to.have.property('status');
                expect(res.result.status).to.equal('released');
            }
            catch(err) {}
        });

        it('should fail update when no auth token provide', async () => {
            try {
                const update_prod_by_code = `${products_api}/${mock_code}`;
                await agent.put(update_prod_by_code).send({name: 'testing', status: 'released'});
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token required.');
            }
        });

        it('should fail update with invalid auth token provide', async () => {
            try {
                const update_prod_by_code = `${products_api}/${mock_code}`;
                await agent.put(update_prod_by_code).send({name: 'testing', status: 'released'}).auth('testing-token', { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token invalid.');
            }
        });
    });
    

    describe ('Delete Product', () => {
        before( async() => {
            const user_endpoint = '/user';
            const user_api = connectUrl + v1 + user_endpoint;
            const register = '/register';
            const register_url = user_api + register;

            const mock_account = 'account.testing';
            const mock_password = 'password.testing';

            try {
                const response = await agent.post(register_url).send({account: mock_account, password: mock_password});   
                const res = response.body;
                this.token = res.token;
            }
            catch(err) {
                const login = '/login';
                const login_url = user_api + login;
                const response = await agent.post(login_url).send({account: mock_account, password: mock_password});
                const res = response.body;
                this.token = res.token;
            }
        });  
        
        it('should successfully delete the product by product code', async () => {
            try {
                const get_prod_by_code = `${products_api}/${mock_code}`;
                const productReceived = await agent.get(get_prod_by_code).auth(this.token, { type: 'bearer' });
                if (!productReceived) {
                    await agent.post(products_api).send({name: mock_name, code: mock_code, status: mock_status}).auth(this.token, { type: 'bearer' });
                }

                const delete_prod_by_code = `${products_api}/${mock_code}`;
                const response = await agent.del(delete_prod_by_code).auth(this.token, { type: 'bearer' });
                const res = response.body;
                expect(res.status).to.equal(203);
                expect(res).to.have.property('result');
            }
            catch(err) {}
        });

        it('should fail delete the non-exist product', async () => {
            try {
                const delete_prod_by_code = `${products_api}/${mock_code}`;
                await agent.del(delete_prod_by_code).auth(this.token, { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(500);
                expect(error.error).to.equal('Unable to delete a non-exist product');
            }
        });

        it('should fail delete when no auth token provide', async () => {
            try {
                const delete_prod_by_code = `${products_api}/${mock_code}`;
                await await agent.del(delete_prod_by_code);
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token required.');
            }
        });

        it('should fail delete with invalid auth token provide', async () => {
            try {
                const delete_prod_by_code = `${products_api}/${mock_code}`;
                await agent.del(delete_prod_by_code).auth('testing-token', { type: 'bearer' });
            }
            catch(err) {
                const error = err.response.body;
                expect(error.status).to.equal(401);
                expect(error.error).to.equal('Authentication error. Token invalid.');
            }
        });
    });
});