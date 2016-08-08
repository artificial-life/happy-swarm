'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
const repo = require('./repository/main.js');

server.connection({
	port: 3000
});

server.start((err) => {

	if (err) {
		throw err;
	}
	console.log('Server running at:', server.info.uri);
});

server.register(require('inert'), (err) => {

	if (err) {
		throw err;
	}

	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			reply.file('./www/index.html');
		}
	});

	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			file: function (request) {
				return "./bower_components/" + request.params.param;
			}
		}
	});
	server.route({
		method: 'GET',
		path: '/data/{data_file*}',
		handler: {
			file: function (request) {
				return `./data/${request.params.data_file}.json`;
			}
		}
	});

	server.route({
		method: 'POST',
		path: '/repository',
		handler: repo.add
	});

	server.route({
		method: 'DELETE',
		path: '/repository',
		handler: repo.delete
	});

	server.route({
		method: 'GET',
		path: '/elements/{param*}',
		handler: {
			directory: {
				path: 'www/elements',
				listing: true
			}
		}
	});

});
