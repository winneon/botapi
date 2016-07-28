"use strict";

// Local TS Imports
import Main from "./Main";
import Listener from "./Interfaces/Listener";

class Listeners {
	main: Main;

	constructor(main: Main){
		this.main = main;
	}

	register(listener: Listener): Promise<any> {
		let name: string = listener.constructor.name;
		name = name.charAt(0).toLowerCase() + name.slice(1);

		if (this.main.client.eventNames().indexOf(name) > -1){
			return Promise.reject(new Error("An event with that name is already registered."));
		}

		this.main.client.on(name, (...args: any[]) => {
			args.unshift(this.main);
			listener.onDiscordEvent.apply(listener, args);
		});

		return Promise.resolve();
	}
}

export default Listeners;
