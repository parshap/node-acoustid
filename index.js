/* jshint node:true */
"use strict";

var API_URL = "http://api.acoustid.org/v2/lookup";

var domain = require("domain"),
	querystring = require("querystring"),
	fpcalc = require("fpcalc"),
	hyperquest = require("hyperquest"),
	concat = require("concat-stream");

module.exports = function(file, options, callback) {
	var d = domain.create()
		.on("error", callback);

	fpcalc(file, d.intercept(function(result) {
		// @TODO GZip this
		var buf = new Buffer(querystring.stringify({
			format: "json",
			meta: "recordings releasegroups compress",
			client: options.key,
			duration: result.duration,
			fingerprint: result.fingerprint,
		}));

		var req = hyperquest.post(API_URL);
		req.setHeader("Content-Type", "application/x-www-form-urlencoded");
		req.setHeader("Content-Length", buf.length);
		req.end(buf);

		req.on("response", function(res) {
			if (res.statusCode !== 200) {
				return callback(new Error(res.statsuCode));
			}

			res.pipe(concat(function(data) {
				var results = JSON.parse(data);

				if (results.status !== "ok") {
					return callback(new Error(data));
				}

				callback(null, results.results);
			}));
		});
	}));
};
