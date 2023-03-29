import EventManager from "@bot/managers/EventManager";
import logger from "@bot/utils/logger";
import Eris from "eris";

export default
class BotClient extends Eris.CommandClient {

    public eventManager: EventManager;

    constructor() {
        super(process.env.TOKEN ?? "0", {
            intents: Eris.Constants.Intents.all
        }, { owner: "Ranny", prefix: "--" });

        this.eventManager = new EventManager(this);

        logger.debug("BotClient constructed.");
    }

    async init() {
        await this.eventManager.init();

        logger.debug(`BotClient initialized.`);
    }
}