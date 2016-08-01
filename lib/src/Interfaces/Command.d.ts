import { Client, Message } from "discord.js";
import Commands from "../Commands";
interface Command {
    usage: string;
    description: string;
    requiredArgs: number;
    aliases?: string[];
    requiredRole?: string;
    onCommand(commands: Commands, client: Client, message: Message, args: string[]): void;
}
export default Command;
