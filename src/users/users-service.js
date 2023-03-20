const bcrypt = require('bcryptjs');
const xss = require('xss');
const Treeize = require('treeize');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^a-zA-Z]).{8,}/;

const UsersService = {
    hasUserWithUsername(db, username) {
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user);
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user);
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password cannot start or end with an empty space'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
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
            password: xss(userData.pass)

        }
    }
}