/**
 * Very small logger - in a real project you would use winston/pino etc.
 * This implementation writes JSON to stdout for easy parsing.
 */
export class Logger {
    static format(level, message, meta) {
        const log = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(meta ? { meta } : {})
        };
        return JSON.stringify(log);
    }
    static info(message, meta) {
        console.log(this.format('info', message, meta));
    }
    static debug(message, meta) {
        console.log(this.format('debug', message, meta));
    }
    static error(message, meta) {
        console.error(this.format('error', message, meta));
    }
}
