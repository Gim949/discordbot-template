import logger from "@bot/utils/logger";
import Eris from "eris";

export default
class BotClient extends Eris.CommandClient {
    constructor() {
        super(process.env.TOKEN ?? "0", {
            intents: Eris.Constants.Intents.all
        }, { owner: "Ranny", prefix: "--" });

        logger.debug("BotClient constructed.");
    }

    async init() {
        logger.debug("BotClient initialized.");
    }
}