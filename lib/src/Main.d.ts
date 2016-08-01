import * as discord from "discord.js";
import Commands from "./Commands";
import Listeners from "./Listeners";
declare class Main {
    options: {
        commandPrefix: string;
    };
    discord: any;
    client: discord.Client;
    commands: Commands;
    listeners: Listeners;
    constructor(options?: any);
    configure(options: any): Promise<any>;
    loginWithToken(token: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
}
export default Main;
