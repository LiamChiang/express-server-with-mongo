const jwt = require("jsonwebtoken");
const token_secret = process.env.JWT_TOKEN_SECRET;

const generateAccessToken = ({account, password}) => {
    return jwt.sign({account, password}, token_secret, { expiresIn: "1d" });
};

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let result;
    if (authHeader) {
        const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        try {
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

            // Let's pass back the decoded token to the request object
            req.decoded = result;
            // We call next to pass execution to the subsequent middleware
            next();
        } 
        catch (err) {
            result = {
                error: `Authentication error. Token invalid.`,
                status: 401,
            };
            res.status(401).send(result);
        }
    } 
    else {
        result = {
            error: `Authentication error. Token required.`,
            status: 401,
        };
        res.status(401).send(result);
    }
};

module.exports = {
    validateToken, 
    generateAccessToken
};
