"use strict";

// External Node Imports
let chai: any = require("chai");

// External TS Imports
import { Server } from "discord.js";

// Local TS Imports
import Main from "../src/Main";
import Command from "../src/Interfaces/Command";
import Listener from "../src/Interfaces/Listener";

// Listener and Command Imports
import Message from "./Message";
import Ready from "./Ready";
import TestCommand from "./TestCommand";
import TestCommandTwo from "./TestCommandTwo";

let API: Main;

let ready: Ready;
let message: Message;

let testCommand: TestCommand;
let testCommandTwo: TestCommandTwo;

let server: Server;

function triggerCommand(command: string, commandObj: Command): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		if (API){
			if (commandObj["test"]){
				commandObj["test"] = false;
			}

			API.client.sendMessage(server.channels[0], command)
				.then((message) => {
					let times: number = 0;

					let interval: any = setInterval(() => {
						if (commandObj["test"]){
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

function triggerListener(listener: Listener): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		if (API){
			let times: number = 0;

			let interval: any = setInterval(() => {
				if (listener["test"]){
					resolve();
				} else {
					times++;

					if (times === 10){
						clearInterval(interval);
						reject(new Error("Timed out."));
					}
				}
			}, 500);
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

describe("botAPI suite", () => {
	describe("Initialization", () => {
		before("create main object & command objects", () => {
			API = new Main({
				autoReconnect: true,
				rateLimitAsError: true
			});

			testCommand = new TestCommand();
			testCommandTwo = new TestCommandTwo();
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
		it("should create a test server", () => {
			return API.client.createServer("botapi test server", "us-west")
				.then(serv => server = serv);
		});

		describe("Listeners", () => {
			it("should register the ready event", () => {
				ready = new Ready();
				return API.listeners.register(ready);
			});

			it("should fail to register the ready event", () => {
				return reversePromise(API.listeners.register(ready), "The ready event registered properly.");
			});

			it("should register the message event", () => {
				message = new Message(testCommand);
				return API.listeners.register(message);
			});

			it("should fail to register the message event", () => {
				return reversePromise(API.listeners.register(message), "The message event registered properly.");
			});

			it("should trigger the ready event", () => {
				return triggerListener(ready);
			});
		});

		describe("Commands", () => {
			before("create invalid & usage responses", () => {
				API.commands.setInvalidCommand("You fucking idiot, that's invalid. %invalid%", "%invalid%");
				API.commands.setInvalidCommand(replacer => "You fucking idiot, that's invalid. %invalid%", "%invalid%");

				API.commands.setUsageCommand("You fucking idiot, do this: %command%", "%command%");
				API.commands.setUsageCommand(replacer => "You fucking idiot, do this: %command%", "%command%");
			});

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
				return triggerCommand("!t:testcommand query this", testCommand);
			});

			it("should trigger the test command with an alternate alias", () => {
				return triggerCommand("!t:google query this", testCommand);
			});

			it("should trigger the invalid response", () => {
				return triggerCommand("!t:notregisteredcommand", testCommand);
			});

			it("should trigger the usage response", () => {
				return triggerCommand("!t:testcommand", testCommand);
			});
		});
	});

	after("when all tests are finished", () => {
		return API.client.deleteServer(server);
	});
});
