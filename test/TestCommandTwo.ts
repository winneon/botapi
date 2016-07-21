"use strict";

// External TS Imports
import { Message } from "discord.js";

// Local TS Imports
import Commands from "../src/Commands";
import Command from "../src/Interfaces/Command";

class TestCommandTwo implements Command {
	usage: string = "";
	description: string = "A second test command.";
	requiredArgs: number = 0;

	onCommand(commands: Commands, message: Message, args: string[]): void {
		// blank
	}
}

export default TestCommandTwo;
