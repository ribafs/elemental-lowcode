const dataResolver = function(stringFormat, environmentService) {
	this.stringFormat = stringFormat;
	this.environmentService = environmentService;
};

dataResolver.prototype.detectValues = function(string, data, scope, replaceUndefined) {
	if (!string || !string.indexOf || (string.indexOf("$.") === -1 && string.indexOf("$(") === -1)) {
		return string;
	}

	const regex = /(\$\.[\w\.]+)/gm;
	let m;
	//scoped data takes precedence
	let scopedData = Object.assign(scope, data);

	let replacements = [];

	while ((m = regex.exec(string)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		m.forEach((match, groupIndex) => {
			var rep = this.resolveValue(match, scopedData, replaceUndefined);

			replacements.push({
				val : match,
				rep : rep
			});
		});
	}

	replacements.forEach((r) => {
		if (typeof(r.rep) === "object") {
			string = r.rep;
		} else {
			string = string.replace(r.val, r.rep);
		}
	});

	//now detect functions
	const funcRegex = /(\$\(.*\)(?!\)))/gm
	replacements = [];

	while ((m = funcRegex.exec(string)) !== null) {
		if (m.index === funcRegex.lastIndex) {
			funcRegex.lastIndex++;
		}

		m.forEach((match, groupIndex) => {
			var rep = this.resolveFunction(match, scopedData);

			replacements.push({
				val : match,
				rep : rep
			});
		});
	}

	replacements.forEach((r) => {
		if (typeof(r.rep) === "object") {
			string = r.rep;
		} else {
			string = string.replace(r.val, r.rep);
		}
	});

	return string;
};

dataResolver.prototype.resolveFunction = function(fn, data) {
	//does it have unresolved values?
	if (fn.indexOf('$.') !== -1) {
		return fn;
	}

	//allow access to the string formatter
	const stringFormat = this.stringFormat;

	//evaluate and return the value
	return eval(fn.slice(2).slice(0, -1));
};

dataResolver.prototype.resolveValue = function(path, data, replaceUndefined) {
	let current = Object.assign({
		env : this.environmentService.listEnvironmentVariables()
	}, data);
	let parts = path.replace("$.", "").split(".");
	parts.forEach((p) => {
		if (current) {
			current = current[p];
		}
	});

	if (typeof(current) === "undefined" && !replaceUndefined) {
		return path;
	}

	if (replaceUndefined && typeof(current) === "undefined") {
		return "";
	}

	return current;
};

module.exports = function(stringFormat, environmentService) {
	if (!stringFormat) {
		stringFormat = require("elemental-string-format");
	}

	if (!environmentService) {
		environmentService = require("../../../shared/environmentService")();
	}

	return new dataResolver(stringFormat, environmentService);
};