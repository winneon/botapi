"use strict";

// Source Map Redirection
require("source-map-support").install();

// External TS Imports
import * as discord from "discord.js";

class Main {
	discord: any;
	client: discord.Client;

	constructor(options?: any){
		this.discord = discord;
		this.client = new discord.Client(options);
	}

	login(token: string): Promise<any> {
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
}

export default Main;
