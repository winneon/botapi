"use strict";
function Command(options) {
    return (target, key, value) => {
        return {
            configurable: true,
            value: function (...args) {
                if (!this["_commands"]) {
                    this["_commands"] = {};
                }
                this["_commands"][key] = options;
                return value.value.apply(this, args);
            }
        };
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;

//# sourceMappingURL=Command.js.map
