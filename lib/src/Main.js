"use strict";
// Source Map Redirection
require("source-map-support").install();
// External TS Imports
const discord = require("discord.js");
// Local TS Imports
const Commands_1 = require("./Commands");
const Listeners_1 = require("./Listeners");
class Main {
    constructor(options) {
        this.options = {
            commandPrefix: "!"
        };
        this.discord = options.Client ? options : discord;
        this.client = new discord.Client(options);
        this.commands = new Commands_1.default(this);
        this.listeners = new Listeners_1.default(this);
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
                    /* istanbul ignore next */
                    reject(new Error("Bad token."));
                }
                resolve(newToken);
            })
                .catch((error) => {
                /* istanbul ignore next */
                reject(error);
            });
        });
    }
    login(email, password) {
        /* istanbul ignore next */
        return (function () {
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
        })();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;

//# sourceMappingURL=Main.js.map
