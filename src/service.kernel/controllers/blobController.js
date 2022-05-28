const blobController = function(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator) {
    this.app                = app;
    this.dir                = dir;
    this.fileLister         = fileLister;
    this.storageService     = storageService;
    this.roleCheckHandler   = roleCheckHandler;
    this.path               = path;
    this.typeValidator      = typeValidator;

    this.initEndpoints();
};

blobController.prototype.getStores = function(req, res) {
    let results = null;
    this.fileLister.executeGlob(this.path.join(this.dir, '**/*.json')).then((_results) => {
        results = _results;
        return Promise.all(results.map((r) => {
            return this.storageService.detailCollection(r.name, req.headers.authorization.replace('Bearer ', ''))
                .then((details) => {
                    return Promise.resolve(details);
                }).catch(() => {
                    return Promise.resolve({ count : 0 });
                });
        }));
    }).then((details) => {
        //map into our results
        for (var i = 0; i < results.length; i++) {
            results[i].count = details[i] ? details[i].count : 0;
        }
        res.status(200);
        res.json(results);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

blobController.prototype.getStore = function(req, res) {
    this.fileLister.readJSONFile(this.dir, req.params.name + '.json').then((content) => {
        res.status(200);
        res.json(content);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

blobController.prototype.updateStore = function(req, res) {
    this.typeValidator.validate('blobstore', req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.params.name + '.json', JSON.stringify(req.body));
    }).then(() => {
        res.status(204);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

blobController.prototype.deleteStore = function(req, res) {
    this.fileLister.deleteFile(this.dir, req.params.name + '.json').then(() => {
        res.status(204);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

blobController.prototype.createStore = function(req, res) {
    this.typeValidator.validate('blobstore', req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.body.name + '.json', JSON.stringify(req.body));
    }).then(() => {
        res.status(201);
        res.location('/blob/stores/' + req.body.name);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

blobController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get('/blob/stores',             this.roleCheckHandler.enforceRoles(this.getStores.bind(this),    ['blobstore_reader', 'blobstore_admin', 'system_reader', 'system_admin']));
    this.app.get('/blob/stores/:name',       this.roleCheckHandler.enforceRoles(this.getStore.bind(this),     ['blobstore_reader', 'blobstore_admin', 'system_reader', 'system_admin']));
    this.app.put('/blob/stores/:name',       this.roleCheckHandler.enforceRoles(this.updateStore.bind(this),  ['blobstore_writer', 'blobstore_admin', 'system_writer', 'system_admin']));
    this.app.delete('/blob/stores/:name',    this.roleCheckHandler.enforceRoles(this.deleteStore.bind(this),  ['blobstore_writer', 'blobstore_admin', 'system_writer', 'system_admin']));
    this.app.post('/blob/stores',            this.roleCheckHandler.enforceRoles(this.createStore.bind(this),  ['blobstore_writer', 'blobstore_admin', 'system_writer', 'system_admin']));
};

module.exports = function(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator) {
    if (!fileLister) {
        fileLister = require('../lib/fileLister')();
    }

    if (!storageService) {
        storageService = require('../../support.lib/storageService')();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    if (!path) {
        path = require('path');
    }

    if (!typeValidator) {
        typeValidator = require('../lib/typeValidator')();
    }

    return new blobController(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator);
};