const jwt = require('jsonwebtoken');

exports.verify = (token, secret) => {
    let decoded = jwt.verify(token, secret);
    if (decoded) {
        return decoded.id;
    } else {
        return -1;
    }
};