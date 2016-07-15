"use strict";

// External TS Imports
import { Message } from "discord.js";

// Local TS Imports
import Commands from "../src/Commands";
import Command from "../src/Interfaces/Command";

class TestCommand implements Command {
	usage: string = "<query>";
	description: string = "A test command.";
	requiredArgs: number = 1;

	aliases: string[] = [ "google" ];
	test: boolean = false;

	onCommand(commands: Commands, message: Message, args: string[]): void {
		this.test = true;
	}
}

export default TestCommand;
