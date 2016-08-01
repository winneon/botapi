import { Message } from "discord.js";
import Main from "./Main";
import Command from "./Interfaces/Command";
declare class Commands {
    main: Main;
    commands: {
        aliases: string[];
        callback: Command;
    }[];
    _invalidCommand: (command: string, message: Message) => Promise<any>;
    _usageCommand: (command: string, usage: string, message: Message) => Promise<any>;
    _messageCallback: (message: Message) => void;
    constructor(main: Main);
    register(command: Command): Promise<any>;
    setInvalidCommand(text: string, replacer?: string): void;
    setInvalidCommand(text: (replacer: string) => string, replacer?: string): void;
    setUsageCommand(text: string, replacer?: string): void;
    setUsageCommand(text: (replacer: string) => string, replacer?: string): void;
    _checkCommandAliases(name: string, aliases?: string[]): string[];
    _registerListener(): void;
}
export default Commands;
