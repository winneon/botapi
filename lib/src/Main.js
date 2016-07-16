"use strict";
// Source Map Redirection
require("source-map-support").install();
// External TS Imports
const discord = require("discord.js");
// Local TS Imports
const Commands_1 = require("./Commands");
class Main {
    constructor(options) {
        this.discord = discord;
        this.client = new discord.Client(options);
        this.commands = new Commands_1.default(this);
        this.options = {
            commandPrefix: "!"
        };
    }
    configure(options) {
        for (let option in options) {
            if (!this.options[option]) {
                return Promise.reject(new Error("The option `" + option + "` does not exist."));
            }
        }
        for (let option in this.options) {
            this.options[option] = options[option] || this.options[option];
        }
        return Promise.resolve(this.options);
    }
    loginWithToken(token) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.client.loginWithToken(token)
                .then((newToken) => {
                if (!newToken || newToken.length === 0) {
                    reject(new Error("Bad token."));
                }
                resolve(newToken);
            })
                .catch(error => reject(error));
        });
    }
    /* istanbul ignore next */
    login(email, password) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.client.login(email, password)
                .then((newToken) => {
                if (!newToken || newToken.length === 0) {
                    reject(new Error("Bad token."));
                }
                resolve(newToken);
            })
                .catch(error => reject(error));
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;

//# sourceMappingURL=Main.js.map
