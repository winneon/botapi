"use strict";

// Local TS Imports
import Main from "../src/Main";
import Listener from "../src/Interfaces/Listener";

class Ready implements Listener {
	test: boolean;

	constructor(){
		this.test = false;
	}

	onDiscordEvent(main: Main): void {
		this.test = true;
	}
}

export default Ready;
