import BotClient from "@bot/core/BotClient";
import { CommandInteraction } from "eris";

export const struct = {
    "name": "ping",
    "description": "Sends a ping"
}

export const handler = async (client: BotClient, interaction: CommandInteraction) => {
    interaction.createMessage("Pong!");
}