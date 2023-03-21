const bcrypt = require('bcryptjs');
const xss = require('xss');
const Treeize = require('treeize');
const REQEX_UPPER_LOWER_NUMBER = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;

const UsersService = {
    hasUserWithUsername(db, username) {
        console.log('inside hasUserWithUsername()...', username);
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user);
    },
    insertUser(db, newUser) {
        console.log('inside insertUser()...', newUser);
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user);
    },
    validatePassword(password) {
        console.log('inside validatePassword()...', password);
        if (password.length < 4) {
            return 'Password must be longer than 4 characters';
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password cannot start or end with an empty space'
        }
        if (!REQEX_UPPER_LOWER_NUMBER.test(password)) {
            return 'Password must contain at least one uppercase, one lowercase, and one number';
        }
        return null;
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    getById(knex, id) {
        return knex('users')
            .select('*')
            .where('id', id)
            .first();
    },
    getByUsername(knex, username) {
        return knex('users')
            .select('*')
            .where('username', username)
            .first();
    },
    serializeUser(user) {
        const userTree = new Treeize();
        const userData = userTree.grow([user]).getData()[0];

        return {
            id: userData.id,
            username: xss(userData.username),
            password: xss(userData.password),
            location_id: xss(userData.location_id),
            date_created: new Date(userData.date_created)
        }
    }
}

module.exports = UsersService;