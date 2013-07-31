/* jshint node:true */
"use strict";

var path = require("path"),
	acoustid = require("../"),
	test = require("tape");

var TEST_FILE = path.join(__dirname, "test.mp3"),
	OPTIONS = { key: "8XaBELgH" };

test("get data", function(t) {
	acoustid(TEST_FILE, OPTIONS, function(err, results) {
		t.ifError(err);
		t.ok(results);
		t.ok(results[0]);
		t.ok(results[0].recordings);
		t.ok(results[0].recordings[0].releasegroups);
		t.end();
	});
});
