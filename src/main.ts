import "dotenv/config";
import BotClient from "@bot/core/BotClient";
import logger from "@bot/utils/logger";

const client = new BotClient();
client.init().then(() => client.connect()).catch(err => logger.error(err));