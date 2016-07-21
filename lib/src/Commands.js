"use strict";
class Commands {
    constructor(main) {
        this.main = main;
        this.commands = [];
        this.setInvalidCommand("Invalid command.");
        this.setUsageCommand("Usage: `%usage%`");
        this._messageCallback = (message) => {
            let text = message.content;
            let lowered = text.toLowerCase();
            if (lowered.startsWith(main.options.commandPrefix) && !lowered.endsWith(main.options.commandPrefix)) {
                let command = text.split(" ")[0].replace(main.options.commandPrefix, "");
                let args = text.split(" ");
                args.splice(0, 1);
                for (let item of this.commands) {
                    if (item.aliases.indexOf(command.toLowerCase()) > -1) {
                        if (item.callback.requiredArgs <= args.length) {
                            item.callback.onCommand(this, message, args);
                        }
                        else {
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
    register(command) {
        let commandAliases = this._checkCommandAliases(command.constructor.name, command.aliases);
        for (let item of this.commands) {
            let itemAliases = this._checkCommandAliases(item.callback.constructor.name, item.aliases);
            if (itemAliases.some((elem) => {
                return commandAliases.indexOf(elem) > -1;
            })) {
                return Promise.reject(new Error("One of the aliases or command names are already registered."));
            }
        }
        this.commands.push({
            aliases: commandAliases,
            callback: command
        });
        return Promise.resolve();
    }
    setInvalidCommand(text, replacer = "%cmd%") {
        if (typeof text === "function") {
            text = text(replacer);
        }
        this._invalidCommand = (command, message) => this.main.client.sendMessage(message.channel, text.replace(replacer, this.main.options.commandPrefix + command));
    }
    setUsageCommand(text, replacer = "%usage%") {
        if (typeof text === "function") {
            text = text(replacer);
        }
        this._usageCommand = (command, usage, message) => this.main.client.sendMessage(message.channel, text.replace(replacer, this.main.options.commandPrefix + command + usage));
    }
    _checkCommandAliases(name, aliases) {
        let commandAliases = aliases || [];
        for (let item in commandAliases) {
            commandAliases[item] = commandAliases[item].toLowerCase();
        }
        if (commandAliases.indexOf(name) === -1) {
            commandAliases.push(name);
        }
        return commandAliases;
    }
    _registerListener() {
        this.main.client.removeListener("message", this._messageCallback);
        this.main.client.on("message", this._messageCallback);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Commands;

//# sourceMappingURL=Commands.js.map
