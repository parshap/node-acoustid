/* jshint node:true */
"use strict";

var fpcalc = require("fpcalc");

module.exports = function(file, options, callback) {
	if ( ! options || ! options.key) {
		throw new Error("Options object with `options.key` is required.");
	}

	fpcalc(file, options.fpcalc || {}, function(err, result) {
		if (err) return callback(err);
		// Return track info
		getinfo(result, options, callback);
	});
};
// -- Get track information given fingerprint

var querystring = require("querystring"),
	concat = require("concat-stream");

var META_DEFAULT = "recordings releases releasegroups tracks usermeta sources";

function getinfo(fp, options, callback) {
	// Create request to http service
	var req = request({
		format: "json",
		meta: options.meta || META_DEFAULT,
		client: options.key,
		duration: fp.duration,
		fingerprint: fp.fingerprint,
	});

	req.on("error", callback);
	req.on("response", function(res) {
		res.pipe(concat(function(data) {
			var results;

			// Expect 200 response
			if (res.statusCode !== 200) {
				return callback(new Error(data));
			}

			// Expect valid JSON response body
			try {
				results = JSON.parse(data);
			}
			catch (err) {
				return callback(err);
			}

			// Expect "ok" status in json object
			if (results.status !== "ok") {
				return callback(new Error(data));
			}

			// Return results
			callback(null, results.results);
		}));
	});
}

// -- Create HTTP request object

var API_URL = "http://api.acoustid.org/v2/lookup",
	hyperquest = require("hyperquest");

function request(params) {
	var req = hyperquest.post(API_URL),
		query = querystring.stringify(params),
		buf = new Buffer(query);
	req.setHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setHeader("Content-Length", buf.length);
	// @TODO GZip the request body
	req.end(buf);
	return req;
}
