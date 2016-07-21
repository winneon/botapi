"use strict";

// External Node Imports
let chai: any = require("chai");

// External TS Imports
import { Server } from "discord.js";

// Local TS Imports
import Main from "../src/Main";
import TestCommand from "./TestCommand";
import TestCommandTwo from "./TestCommandTwo";

let API: Main;
let testCommand: TestCommand;
let testCommandTwo: TestCommandTwo;

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

							if (times === 10){
								clearInterval(interval);
								reject(new Error("Timed out."));
							}
						}
					}, 500);
				});
		} else {
			reject(new Error("API isn't initialized."));
		}
	});
}

function reversePromise(promise: Promise<any>, errorString: string): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		promise
			.then(() => reject(new Error(errorString)))
			.catch(error => resolve());
	});
}

describe("Initialization", () => {
	before("create main object", () => {
		API = new Main({
			autoReconnect: true,
			rateLimitAsError: true
		});
	});

	it("should fail to configure", () => {
		return reversePromise(API.configure({
			nonExistant: "option"
		}), "Main configured properly.");
	});

	it("should configure", () => {
		return API.configure({
			commandPrefix: "!t:"
		});
	});

	it("should login", () => {
		return API.loginWithToken(process.env["BOTAPI_TOKEN"] || "");
	});
});

describe("Server Tasks", () => {
	before("create test server & test command", () => {
		testCommand = new TestCommand();
		testCommandTwo = new TestCommandTwo();

		return API.client.createServer("botapi test server", "us-west")
			.then(serv => server = serv);
	});

	describe("Commands", () => {
		it("should register a test command", () => {
			return API.commands.register(testCommand);
		});

		it("should fail to register a second test command", () => {
			return reversePromise(API.commands.register(testCommand), "The second command registered properly.");
		});

		it("should register a second test command", () => {
			return API.commands.register(testCommandTwo);
		});

		it("should trigger the test command", () => {
			return triggerCommand("!t:testcommand query this");
		});

		it("should trigger the test command with an alternate alias", () => {
			return triggerCommand("!t:google query this");
		});

		/*it("should trigger the usage response", () => {
			return new Promise<any>((resolve, reject) => {
				API.client.sendMessage(server.channels[0], "!t:testcommand")
					.then((message) => {
						let times: number = 0;

						let interval: any = setInterval(() => {
							if (testCommand.test){
								resolve();
							} else {
								times++;

								if (times === 10){
									clearInterval(interval);
									reject(new Error("Timed out."));
								}
							}
						}, 500);
					});
			});
		});*/
	});
});
