const blobService = function(app, roleCheckHandler) {
    this.app = app;
    this.roleCheckHandler = roleCheckHandler;
};

blobService.prototype.init = function(dir) {
    return new Promise((resolve) => {
        this.app.get('*', this.roleCheckHandler.enforceRoles(this.getResource.bind(this), ['system_admin']));

        return resolve();
    });
};

blobService.prototype.getResource = function(req, res, next) {
    res.status(200);
    res.json('hello');
    res.end();
    next();
};

module.exports = function(app, roleCheckHandler) {
    if (!roleCheckHandler) {
        roleCheckHandler = require('../../support.lib/roleCheckHandler')();
    }

    return new blobService(app, roleCheckHandler);
};