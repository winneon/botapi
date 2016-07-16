"use strict";

// External Node Imports
let chai: any = require("chai");

// External TS Imports
import { Server } from "discord.js";

// Local TS Imports
import Main from "../src/Main";
import TestCommand from "./TestCommand";

let API: Main;
let testCommand: TestCommand;

let server: Server;

function triggerCommand(command: string): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		if (API){
			API.client.sendMessage(server.channels[0], command)
				.then((message) => {
					let times: number = 0;

					let interval: any = setInterval(() => {
						if (testCommand.test){
							resolve();
						} else {
							times++;

							if (times === 5){
								clearInterval(interval);
								reject(new Error("Timed out."));
							}
						}
					}, 1000);
				});
		} else {
			reject(new Error("API isn't initialized."));
		}
	});
}

describe("Initialization", () => {
	before("create main object", () => {
		API = new Main({
			autoReconnect: true,
			rateLimitAsError: true
		});
	});

	it("should configure", () => {
		return API.configure({
			commandPrefix: "!t:"
		});
	});

	it("should login", () => {
		return API.login(process.env["BOTAPI_EMAIL"] || "", process.env["BOTAPI_PASSWD"] || "");
	});
});

describe("Server Tasks", () => {
	before("create test server & test command", () => {
		testCommand = new TestCommand();

		return API.client.createServer("botapi test server", "us-west")
			.then(serv => server = serv);
	});

	describe("Commands", () => {
		it("should register the test command", () => {
			return API.commands.register(testCommand)
		});

		it("should trigger the test command", () => {
			return triggerCommand("!t:testcommand query this");
		});

		it("should trigger the test command with an alternate alias", () => {
			return triggerCommand("!t:google query this");
		});
	});
});
