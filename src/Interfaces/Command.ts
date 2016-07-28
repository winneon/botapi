"use strict";

// External TS Imports
import { Client, Message } from "discord.js";

// Local TS Imports
import Commands from "../Commands";

interface Command {
	usage: string;
	description: string;
	requiredArgs: number;

	aliases?: string[];
	requiredRole?: string;

	onCommand(commands: Commands, client: Client, message: Message, args: string[]): void;
}

export default Command;
