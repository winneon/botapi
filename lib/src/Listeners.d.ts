import Main from "./Main";
import Listener from "./Interfaces/Listener";
declare class Listeners {
    main: Main;
    constructor(main: Main);
    register(listener: Listener): Promise<any>;
}
export default Listeners;
