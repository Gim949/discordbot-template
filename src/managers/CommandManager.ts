import { recursiveReadDir } from "@bot/utils/FileUtils";
import BotClient from "@bot/core/BotClient";
import { CommandInteraction, ApplicationCommandStructure, ComponentInteraction } from "eris";
import path from "node:path";
import logger from "@bot/utils/logger";

type CommandFileType = {
    struct: ApplicationCommandStructure;
    handler: Function;
    componentHandler?: Function;
}

export default
class CommandManager {
    private commandsList: CommandFileType[] = Array<CommandFileType>();

    constructor(private client: BotClient) {}

    private async loadCommands() {
        const root = path.resolve(__dirname, "..");
        const commandsDir = path.resolve(root, "commands");

        const files = await recursiveReadDir(commandsDir);
        await Promise.all(files.map(async (file: string) => {
            const commandObj: CommandFileType = await import(path.resolve(commandsDir, file));
            this.commandsList.push(commandObj);
        }));
    }

    public async registerStructs(guildId: string = "some guild id", force: boolean = false) { // Support global commands here too -- I'll do it later though
        const commands = await this.client.getGuildCommands(guildId);
        const guildName = this.client.guilds.get(guildId)?.name ?? guildId;
        const cmdList = this.commandsList.filter(command => force || !commands.some(c => c.name === command.struct.name));
        logger.info(`Registering ${cmdList.length} commands... ${cmdList.map(c => `'${c.struct.name}'`).join(", ")}`);
        logger.info(`Commands already registered: "${guildName}": ${commands.map(c => `'${c.name}'`).join(", ")}`);
        await Promise.all(cmdList.map(cmd => cmd.struct).map(async commandStruct => this.client.createGuildCommand(guildId, commandStruct)));
    }

    public async deleteStructs(guildId: string = "some guild id") {
        const commands = await this.client.getGuildCommands(guildId);
        await Promise.all(commands.map(async command => this.client.deleteGuildCommand(guildId, command.id)));
    }

    public async getAllGuildCommands() {
        const guilds = this.client.guilds.map(g => ({ id: g.id, name: g.name }));
        return await Promise.all(guilds.map(async ({ id, name }) => {
            const commands = (await this.client.getGuildCommands(id)).map(c => c.name);
            const guildInfo = `${name} (${id})`;
            return { guildInfo, commands };
        }));
    }

    private registerHandlers() {
        this.client.on("interactionCreate", async interaction => {
            if(interaction instanceof CommandInteraction) {
                await Promise.all(this.commandsList.map(async ({ struct, handler }) => {
                    if(interaction.data.name === struct.name)
                        await handler(this.client, interaction);
                }));
            }
            else if(interaction instanceof ComponentInteraction) {
                // Find where this component interaction is from
                const interactionName = interaction.message.interaction?.name;
                if(!interactionName) {
                    logger.warn(`Interaction name not found! Aborting ${interaction.id} ${interaction.message.id} ${interaction.channel.toString()}`);
                    return interaction.createMessage("This component interaction is not from a command.");
                }

                const command = this.commandsList.find(c => c.struct.name.startsWith(interactionName.split(" ")[0]));
                if(!command) {
                    logger.warn(`Command not found! Aborting ${interactionName}`);
                    return interaction.createMessage("This component interaction is not from a command.");
                }
                else if(!command.componentHandler) {
                    logger.warn(`Component handler not found! Aborting ${interactionName}`);
                    return interaction.createMessage("Component handler not implemented! Blame ranny for having skill issue!");
                }

                // Calls component handler from command
                await command.componentHandler(this.client, interaction);
            }
        });
    }

    private async registerClientCommands() {
        // https://github.com/abalabahaha/eris/blob/0.16.x/examples/basicCommands.js
        // this.client.registerCommand("command", async (msg: Message, args: string[]): Promise<any> => {
        // },
        // {
        //     description: "",
        //     fullDescription: "",
        //     usage: "",
        // });
    }

    async init() {
        await this.loadCommands();
        await this.registerClientCommands();
        this.registerHandlers();
    }
}