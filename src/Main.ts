"use strict";

// Source Map Redirection
require("source-map-support").install();

// External TS Imports
import * as discord from "discord.js";

// Local TS Imports
import Commands from "./Commands";

class Main {
	discord: any;
	client: discord.Client;
	commands: Commands;

	options: {
		commandPrefix: string
	};

	constructor(options?: any){
		this.discord = discord;
		this.client = new discord.Client(options);
		this.commands = new Commands(this);

		this.options = {
			commandPrefix: "!"
		};
	}

	configure(options): Promise<any> {
		for (let option in options){
			if (!this.options[option]){
				return Promise.reject(new Error("The option `" + option + "` does not exist."));
			}
		}

		for (let option in this.options){
			this.options[option] = options[option] || this.options[option];
		}

		return Promise.resolve(this.options);
	}

	loginWithToken(token: string): Promise<any> {
		let that = this;

		return new Promise<any>((resolve, reject) => {
			that.client.loginWithToken(token)
				.then((newToken) => {
					if (!newToken || newToken.length === 0){
						reject(new Error("Bad token."));
					}

					resolve(newToken);
				})
				.catch(error => reject(error));
		});
	}

	login(email: string, password: string): Promise<any> {
		let that = this;

		return new Promise<any>((resolve, reject) => {
			that.client.login(email, password)
				.then((newToken) => {
					if (!newToken || newToken.length === 0){
						reject(new Error("Bad token."));
					}

					resolve(newToken);
				})
				.catch(error => reject(error));
		});
	}
}

export default Main;
