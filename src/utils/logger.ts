import debugjs from "debug";

type Logger = debugjs.Debugger;
interface LoggerCreator {
    debug: Logger;
    info: Logger;
    warn: Logger;
    error: Logger;
}

function createLoggers(app: string): LoggerCreator {
    const debug: Logger = debugjs(`${app}:debug`);
    debug.log = console.log.bind(console);

    const info: Logger = debugjs(`${app}:info`);
    info.log = console.info.bind(console);

    const warn: Logger = debugjs(`${app}:warn`);
    warn.log = console.warn.bind(console);

    const error: Logger = debugjs(`${app}:error`);
    error.log = console.error.bind(console);

    return {
        debug,
        info,
        warn,
        error
    };
}

export default createLoggers("botClient");