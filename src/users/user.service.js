const config = require('../config/jwt.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user.toObject());
        const { password, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ sub: user._id }, config.public_token);
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-password');
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

async function createUser(userParam) {
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.password = bcrypt.hashSync(user.password, 10);
    }

    await user.save();
}

module.exports = {
    authenticate,
    getAll,
    getById,
    createUser
};