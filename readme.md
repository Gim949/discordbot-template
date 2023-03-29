## Installing
Needs Nodejs 18+

Go [here]([https://abal.moe/Eris/docs/0.17.2/getting-started) for docs

### Directories
* `src` -- Contains the source, I'm using typescript here
    * `commands` -- Application commands, refer to `ApplicationCommand.template` or `ping.ts` for how you should be creating these kinds of files
    * `core` -- Main bot code, use this folder for when you want to add databases or external stuff
    * `events` -- Event handlers, based off name of file; double check the docs to make sure you have the right arguments. Every function in there should start with `BotClient`
    * `utils` -- Utility functions