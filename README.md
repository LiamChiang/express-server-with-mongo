# Pre-requirements
### MongoDB packages
### Node.js and NPM packages
***Note: You must install all these packages, otherwise the server can not be setup***

# Development
## Local Setup
### Step 1: Install mongodb to your computer
### Step 2: install nodejs to your computer
### Step 4: ```npm install```
### Step 5: ```npm start_db```
### Step 6: ```npm start```
***Note: by default the application is running on port 3000, you can edit it as .env file***

# Environment #
## .env setup ##
```
JWT_TOKEN_SECRET= {jwt secret string}
MONGO_URL= {mongoDB connect url}
MONGO_PORT= {mongoDB connect port}
MONGO_DB= {mongoDB database name}
PORT= {Server connect port}
SALT_WORK_FACTOR= {bcrpt salt work number}
```
***Note: edit the .env file to customize your server and mongoDB information***

# MongoDB DB and Collections Schema #
## DB ##
### Name: { Please edit the DB name in .env } ###
## Users ##
### Collection: ***users*** ###

``` 
{
    "account" : { type: String; unique: true; required: true },
    "password" : { type: String; required: true }
}
```
## Products ##
### Collection: ***products*** ###

``` 
{
    "name" : { type: String; required: true },
    "date" : { type: Date; default: Current date-time },
    "code" : { type: String; unique: true; required: true },
    "status" : { type: String; required: true }
}
```

# CURL Script #

## Running on Local ##
### Create User ###
Note: The API will return back a valid token for the products api request use.
``` 
curl --location --request POST 'http://127.0.0.1:3000/v1/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account": "I-am-User",
    "password": "IAmPassWord"
}'
```

### Login User ###
Note: You can also get the token by login the account.
``` 
curl --location --request POST 'http://127.0.0.1:3000/v1/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account": "I-am-User",
    "password": "IAmPassWord"
}'
```

### User register/login return example ###
``` 
{
    "status": 200,
    "result": "Successfully registered the account: liam.chan. The token will be expired after a day",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibGlhbS5jaGFuIiwicGFzc3dvcmQiOiIkMmIkMTAkTi92NVh2UG5EY1AzQ292RDVoeVl4LnlnWXROVHI2TDVSOC9BUWo0Rm92RHNNSDZkRXV2MUciLCJpYXQiOjE2MjM0MzE0NjksImV4cCI6MTYyMzUxNzg2OX0.B82AEIIt5Tsx36hNn-wE7OvPpQaN_AsqfZVB2JyPNE8"
}
```


Note: Every API request that relate to the "products" endpoint must send with the bearer token. ( Token can be retrieved from ***v1/login*** or ***v1/register*** )
### Create Product ###
``` 
curl --location --request POST 'http://127.0.0.1:3000/v1/products' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "matcha 1",
    "code": "matcha-1-1",
    "status": "new"
}' \
-H "Authorization: Bearer { TOKEN }"
```

### Get all Products ###
```
curl --location --request GET 'http://127.0.0.1:3000/v1/products' \
-H "Authorization: Bearer ${TOKEN}"
```

### Get Product ###
note: Please change the product code first
```
curl --location --request GET 'http://127.0.0.1:3000/v1/products/{ product code }' \
-H "Authorization: Bearer ${TOKEN}"
```

### Delete Product ###
note: Please change the product code first
```
curl --location --request DELETE 'http://127.0.0.1:3000/v1/products/{ product code }' \
-H "Authorization: Bearer ${TOKEN}"
```


### Update Product ###
note: Please change the product code first
```
curl --location --request PUT 'http://127.0.0.1:3000/v1/products/{ product code }' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test 1",
    "status": "modify"
}' \
-H "Authorization: Bearer ${TOKEN}"
```
# Packages use #
```
"bcrypt": "^5.0.1",
"body-parser": "^1.19.0",
"chai": "^4.3.4",
"cross-env": "^7.0.3",
"dotenv": "^10.0.0",
"express": "^4.17.1",
"jsonwebtoken": "^8.5.1",
"mocha": "^9.0.0",
"mongoose": "^5.12.13",
"morgan": "^1.10.0",
"nodemon": "^2.0.7",
"superagent": "^6.1.0"
```

# Unit test #
## How to run the unit test:
### step 1:
Make sure the server and MongoDB have been turned on.

### step2:
```npm run test```