"use strict";

// Local TS Imports
import Main from "../Main";

interface Listener {
	onDiscordEvent(main: Main, ...args: any[]): void;
}

export default Listener;
