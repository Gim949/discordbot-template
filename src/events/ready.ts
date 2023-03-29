import logger from "@bot/utils/logger";
import BotClient from "@bot/core/BotClient";

export default 
async (client: BotClient) => {
    logger.info(`[${new Date().toISOString()}] Bot is ready.`);
}