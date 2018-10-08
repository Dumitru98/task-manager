'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');

var publicApp = express.Router();
var privateApp = express.Router();

debug.log = console.info.bind(console);

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

function security(req, res, next) {
	let token = null;

	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
		token = req.headers.authorization.split(' ')[1];

	if (!token && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer')
		token = req.headers.Authorization.split(' ')[1];

	if (!token) 
		token = req.query.token;

	if (!token) 
		token = req.body.token;

	req.token = token;
	next();
}

publicApp.post('/signup', async function(req, res) {
	try {
		var username = req.body.username;
		var password = req.body.password;
		var fullName = req.body.fullName;
		var email = req.body.email;
		var groupNames = [];

		let user = await db.user.findByUsername(username);

		if (!user) {
			var token = createToken();

			await db.user.createUser(username, password, fullName, email, token, groupNames);
			debug('User ' + username + ' created');
			return res.status(200).send({ err: 0, token: token });
		} else {
			debug('The user ' + username + ' already exist');
			return res.status.send({ err: 1, message: 'The user ' + username + ' already exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});

publicApp.post('/login', async function(req, res) {
	try {
		var username = req.body.username;
		var password = req.body.password;

		let user = await db.user.findByUsernameAndPassword(username, password);

		if (user) {
			var token = createToken();

			await db.user.setToken(username, token);
			debug('Login successful');
			return res.status(200).send({ err: 0, token: token });
		} else {
			debug('Username or password incorrect');
			return res.status(200).send({ err: 1, message: 'The username or the password is incorrect!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});

privateApp.post('/logout', async function(req, res) {
	try {
		var user = await db.user.findByToken(req.body.token);

		if (user) {
			await db.user.setToken(user.username, '');
			debug('User found');
			return res.status(200).send({ err: 0 });
		} else {
			debug('Couldn\'t find the given token');
			return res.status(200).send({ err: 1, message: 'Couldn\'t find the user with the given token!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!' + e });
	}
});

privateApp.post('/update', async function(req, res) {
	try {
		var username = req.body.username;
		if (req.body.fullName)
			var fullName = req.body.fullName;

		if (req.body.email)
			var email = req.body.email;

		var user = await db.user.findByUsername(username);

		if (user) {
			var updatedUser = await db.user.edit(username, email, fullName);
			debug('The user ' + username + ' updated');
			return res.status(200).send({ err: 0, user: updatedUser });
		} else {
			debug('The user ' + username + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});

privateApp.get('/get', async function(req, res) {
	try {
		var user = await db.user.findByToken(req.token);

		if (user) {
			debug('User found');
			return res.status(200).send({ err: 0, user: user });
		} else {
			debug('Couldn\'t find the given token');
			return res.status(200).send({ err: 1, message: 'Couldn\'t find the user with the given token!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});

privateApp.post('/fullNames/get', async function(req, res) {
	try {
		var fullNames = [];

		for (let username of req.body.usernames) {
			var user = await db.user.findByUsername(username);

			if (!user) {
				debug('Couldn\'t find the given username');
				return res.status(200).send({ err: 1, message: 'Couldn\'t find the user with the given username!' });
			}

			fullNames.push(user.fullName);
		}

		debug('Users found');
		return res.status(200).send({ err: 0, fullNames: fullNames });
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});

privateApp.post('/check/name', async function (req, res) {
	try {
		var username = req.body.username;
		console.log(username);

		var user = await db.user.findByUsername(username);
		if (user) {
			return res.status(200).send({ err: 0 });
		} else {
			return res.status(200).send({ err: 1, message: 'Username ' + username + ' doesn\'t exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error' + e });
	}
});


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;