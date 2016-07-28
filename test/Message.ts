"use strict";

// External TS Imports
import { Message as DiscordMessage } from "discord.js";

// Local TS Imports
import Main from "../src/Main";
import Listener from "../src/Interfaces/Listener";
import TestCommand from "./TestCommand";

class Message implements Listener {
	test: boolean;
	command: TestCommand;

	constructor(testCommand: TestCommand){
		this.test = false;
		this.command = testCommand;
	}

	onDiscordEvent(main: Main, message: DiscordMessage): void {
		if (main.client.user.id === message.author.id){
			if (message.content.indexOf("that's invalid") > -1 || message.content.indexOf("do this") > -1){
				this.command.test = true;
			}
		}
	}
}

export default Message;
