"use strict";

// External Node Imports
let chai: any = require("chai");

// Local TS Imports
import Main from "../src/index";

let API: Main = undefined;

describe("Main", () => {
	before("create main object", () => {
		API = new Main({
			autoReconnect: true,
			rateLimitAsError: true
		});
	});

	it("should login", () => {
		return API.login(process.env["BOTAPI_TOKEN"] || "");
	});
});
