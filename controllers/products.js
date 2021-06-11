const connUri = process.env.MONGO_URL;
const mongoPort = process.env.MONGO_PORT;

const connUri = process.env.MONGO_URL;
const mongoPort = process.env.MONGO_PORT;
const db = process.env.MONGO_DB;
const url = `${connUri}:${mongoPort}/${db}`;

controller = {
    add: (req, res) => {
        return;
    }
}

module.exports = controller;