"use strict";
// Source Map Redirection
require("source-map-support").install();
// External TS Imports
const discord = require("discord.js");
class Main {
    constructor(options) {
        this.discord = discord;
        this.client = new discord.Client(options);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;

//# sourceMappingURL=index.js.map
