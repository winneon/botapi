"use strict";

// External TS Imports
import { Message } from "discord.js";

// Local TS Imports
import Main from "./Main";
import Command from "./Interfaces/Command";

class Commands {
	main: Main;
	commands: {
		aliases: string[],
		callback: Command
	}[];

	_invalidCommand: (command: string, message: Message) => Promise<any>;
	_usageCommand: (command: string, usage: string, message: Message) => Promise<any>;

	_messageCallback: (message: Message) => void;

	constructor(main: Main){
		this.main = main;
		this.commands = [ ];

		this.setInvalidCommand("Invalid command.");
		this.setUsageCommand("Usage: `%usage%`");

		this._messageCallback = (message) => {
			let text: string = message.content;
			let lowered: string = text.toLowerCase();

			if (lowered.startsWith(main.options.commandPrefix) && !lowered.endsWith(main.options.commandPrefix)){
				let command: string = text.split(" ")[0].replace(main.options.commandPrefix, "");
				let args: string[] = text.split(" ");

				args.splice(0, 1);

				for (let item of this.commands){
					if (item.aliases.indexOf(command.toLowerCase()) > -1){
						if (item.callback.requiredArgs <= args.length){
							item.callback.onCommand(this, message, args);
						} else {
							this._usageCommand(command, item.callback.usage, message);
						}

						return;
					}
				}

				this._invalidCommand(command, message);
			}
		};

		this._registerListener();
	}

	register(command: Command): Promise<any> {
		let commandAliases: string[] = this._checkCommandAliases(command.constructor.name, command.aliases);

		for (let item of this.commands){
			let itemAliases: string[] = this._checkCommandAliases(item.callback.constructor.name, item.aliases);

			if (itemAliases.some((elem) => {
				return commandAliases.indexOf(elem) > -1;
			})){
				return Promise.reject(new Error("One of the aliases or command names are already registered."));
			}
		}

		this.commands.push({
			aliases: commandAliases,
			callback: command
		});

		return Promise.resolve();
	}

	setInvalidCommand(text: string, replacer?: string): void;
	setInvalidCommand(text: (replacer: string) => string, replacer?: string): void;
	setInvalidCommand(text: any, replacer: string = "%cmd%"): void {
		if (typeof text === "function"){
			text = text(replacer);
		}

		this._invalidCommand = (command, message) => 
			this.main.client.sendMessage(message.channel, text.replace(replacer, this.main.options.commandPrefix +command));
	}

	setUsageCommand(text: string, replacer?: string): void;
	setUsageCommand(text: (replacer: string) => string, replacer?: string): void
	setUsageCommand(text: any, replacer: string = "%usage%"): void {
		if (typeof text === "function"){
			text = text(replacer);
		}

		this._usageCommand = (command, usage, message) =>
			this.main.client.sendMessage(message.channel, text.replace(replacer, this.main.options.commandPrefix + command + usage));
	}

	_checkCommandAliases(name: string, aliases?: string[]): string[] {
		let commandAliases: string[] = aliases || [ ];

		for (let item in commandAliases){
			commandAliases[item] = commandAliases[item].toLowerCase();
		}

		if (commandAliases.indexOf(name) === -1){
			commandAliases.push(name);
		}

		return commandAliases;
	}

	_registerListener(): void {
		this.main.client.removeListener("message", this._messageCallback);
		this.main.client.on("message", this._messageCallback);
	}
}

export default Commands;
