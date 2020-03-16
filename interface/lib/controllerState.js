const controllerState = function(controllerDefinition, storageService, sessionState, integrationService, rulesetService, authClientProvider) {
	this.controllerDefinition 						= controllerDefinition;
	this.controllerDefinition.storageService 		= storageService;
	this.controllerDefinition.sessionState 			= sessionState;
	this.controllerDefinition.integrationService 	= integrationService;
	this.controllerDefinition.rulesetService 		= rulesetService;
	this.controllerDefinition.authClientProvider 	= authClientProvider;
};

controllerState.prototype.setContext = function(request, response) {
	this.request = request;
	this.response = response;

	this.controllerDefinition.sessionState.setContext(this.request, this.response);
	this.controllerDefinition.authClientProvider.setSessionState(this.controllerDefinition.sessionState);

	//set this within all of the services
	Object.keys(this.controllerDefinition).forEach((prop) => {
		const service = this.controllerDefinition[prop];
		if (service && service.setAuthClientProvider) {
			service.setAuthClientProvider(this.controllerDefinition.authClientProvider);
		}
	});
};

controllerState.prototype.generateResponseHeaders = function() {
	this.controllerDefinition.sessionState.generateResponseHeaders();
};

controllerState.prototype.deallocate = function() {
	this.controllerDefinition.sessionState.deallocate();
	this.controllerDefinition = null;
	this.request = null;
	this.response = null;
};

controllerState.prototype.getBag = function() {
	return this.controllerDefinition.bag;
};

controllerState.prototype.triggerEvent = function(name, details) {
	return new Promise((resolve, reject) => {
		let result = null;

		if (this.controllerDefinition.events[name]) {
			result = this.controllerDefinition.events[name].bind(this.controllerDefinition)(details);
		}

		if (result && result.then) {
			return result.then(resolve).catch(reject);
		}

		return resolve();
	});
};

module.exports = function(controllerDefinition, clientConfig, storageService, sessionState, integrationService, rulesetService, authClientProvider) {
	if (!storageService) {
		storageService = require("../../shared/storageService")();
	}

	if (!sessionState) {
		sessionState = require("./sessionState")(controllerDefinition.sessionName);
	}

	if (!integrationService) {
		integrationService = require("../../shared/integrationService")();
	}

	if (!rulesetService) {
		rulesetService = require("../../shared/ruleService")();
	}

	if (!authClientProvider) {
		authClientProvider = require('../../shared/authClientProvider')(clientConfig);
	}

	return new controllerState(controllerDefinition, storageService, sessionState, integrationService, rulesetService, authClientProvider);
};