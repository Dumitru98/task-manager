'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res) {
	var usernameCreator = req.body.usernameCreator;
	var usernameReceiver = req.body.usernameReceiver;
	var groupName = req.body.groupName;
	var taskName = req.body.taskName;
	var taskString = req.body.taskString;
	var taskPriority = req.body.taskPriority;

	var group = await db.group.findByGroupName(groupName);
	if (group) {
		var user = await db.user.findByUsername(usernameReceiver);

		if (user) {
			var taskId = await db.task.createTask(taskName, taskString, taskPriority);
			debug('Task ' + taskName + ' created');

			if (usernameCreator === usernameReceiver) {
				await db.group.setTasksReceived(groupName, usernameReceiver, taskId);
				debug('User tasks list updated');
			} else {
				await db.group.setTasksGiven(groupName, usernameCreator, taskId);
				await db.group.setTasksReceived(groupName, usernameReceiver, taskId);
				debug('Users tasks list updated');
			}

			return res.status(200).send({ err: 0 });
		} else {
			debug('The user ' + usernameReceiver + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + usernameReceiver + ' doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + 'doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + 'doesn\'t exist!' });
	}
});

privateApp.post('/get', async function(req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;

	debug('Getting the tasks list from the user ' + username + ' in the group ' + groupName);
	var tasksId = await db.group.findTasks(groupName, username);

	var tasks = {
		tasksGiven: [],
		tasksReceived: []
	};

	for (let taskId of tasksId.tasksGiven) {
		let task = await db.task.findByTaskId(taskId);
		tasks.tasksGiven.push(task);
	}
	debug('Given tasks got successfully');

	for (let taskId of tasksId.tasksReceived) {
		let task = await db.task.findByTaskId(taskId);
		tasks.tasksReceived.push(task);
	}
	debug('Received tasks got successfully');

	return res.status(200).send({ err: 0, tasks: tasks });
});

privateApp.post('/delete', async function(req, res) {
	var taskId = req.body.taskId;

	debug('Searching fot the task');
	var existTask = await db.task.findByTaskId(taskId);

	if (existTask) {
		await db.task.deleteTask(taskId);
		debug('Task deleted');
		return res.status(200).send({err:0});
	} else {
		debug('There is no task with that id');
		return res.status(200).send({ err: 1, message: 'The task with the given id doesn\'t exist!' });
	}
});

privateApp.post('/test', function(req, res) {
	let test = 'nothing';
	return res.status(200).send({ err: 0, test: test });
});

module.exports.privateRoutes = privateApp;