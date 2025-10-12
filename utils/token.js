const jwt = require('jsonwebtoken');
const genToken = (userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        return token;
    } catch (error) {
        throw new Error(`Token generation failed: ${error.message}`);
    }
};

module.exports = genToken;
