const websitesController = function(app, fileLister, roleCheckHandler) {
	this.app = app;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

websitesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob('.sources/website/*.website.json').then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.split('.').slice(0, -1).join('.');
			return r;
		}));
		next();
	});
};

websitesController.prototype.getWebsite = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/website/', req.params.name + '.website.json').then((data) => {
		res.json(data);
		next();
	});
};

websitesController.prototype.updateWebsite = function(req, res, next) {
	this.fileLister.writeFile('.sources/website/', req.params.name + '.website.json', JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

websitesController.prototype.getResource = function(req, res, next) {
	this.fileLister.readFile('.sources/website/', req.query.path).then((data) => {
		res.send(data);
		next();
	});
};

websitesController.prototype.createOrUpdateResource = function(req, res, next) {
	this.fileLister.writeFile('.sources/website/', req.query.path, req.body.resource).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

websitesController.prototype.initEndpoints = function() {
	this.app.get('/websites', 					this.roleCheckHandler.enforceRoles(this.get.bind(this), 					['website_reader', 'website_admin', 'system_reader', 'system_admin']));
	this.app.get('/websites/:name', 			this.roleCheckHandler.enforceRoles(this.getWebsite.bind(this), 				['website_reader', 'website_admin', 'system_reader', 'system_admin']));
	this.app.put('/websites/:name', 			this.roleCheckHandler.enforceRoles(this.updateWebsite.bind(this), 			['website_writer', 'website_admin', 'system_writer', 'system_admin']));
	this.app.get('/websites/:name/resource', 	this.roleCheckHandler.enforceRoles(this.getResource.bind(this), 			['website_writer', 'website_admin', 'system_writer', 'system_admin']));
	this.app.post('/websites/:name/resource', 	this.roleCheckHandler.enforceRoles(this.createOrUpdateResource.bind(this), 	['website_writer', 'website_admin', 'system_writer', 'system_admin']));
};

module.exports = function(app, fileLister, roleCheckHandler) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require('../../shared/roleCheckHandler')();
	}

	return new websitesController(app, fileLister, roleCheckHandler);
};