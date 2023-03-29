import BotClient from "@bot/core/BotClient";
import { recursiveReadDir } from "@bot/utils/FileUtils";
import logger from "@bot/utils/logger";
import path from "node:path";

export default
class EventManager {

    private eventsList: Map<string, Function> = new Map();
    constructor(private client: BotClient) {}

    private async loadEvents() {
        const root = path.resolve(__dirname, "..");
        const eventsDir = path.resolve(root, "events");

        const files = await recursiveReadDir(eventsDir);
        await Promise.all(files.map(async file => {
            const func = await import(path.resolve(eventsDir, file));
            const name = path.basename(file).split(".")[0];
            logger.info(`Loaded event: ${name}.`)
            this.eventsList.set(name, func.default);
        }));
    }

    private async registerEvents() {
        this.eventsList.forEach((func, name) => this.client.on(name, (...args) => func(this.client, ...args)));
    }

    async init() {
        await this.loadEvents();
        await this.registerEvents();
    }
}