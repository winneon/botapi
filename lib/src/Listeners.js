"use strict";
class Listeners {
    constructor(main) {
        this.main = main;
    }
    register(listener) {
        let name = listener.constructor.name;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        if ((this.main.client.listeners(name).length > 1 && name === "message") ||
            (this.main.client.listeners(name).length > 0 && name !== "message")) {
            return Promise.reject(new Error("An event with that name is already registered."));
        }
        this.main.client.on(name, (...args) => {
            args.unshift(this.main);
            listener.onDiscordEvent.apply(listener, args);
        });
        return Promise.resolve();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Listeners;

//# sourceMappingURL=Listeners.js.map
