/**
 * Very small logger - in a real project you would use winston/pino etc.
 * This implementation writes JSON to stdout for easy parsing.
 */
export class Logger {
  private static format(level: string, message: string, meta?: any) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta ? { meta } : {})
    };
    return JSON.stringify(log);
  }

  static info(message: string, meta?: any) {
    console.log(this.format('info', message, meta));
  }

  static debug(message: string, meta?: any) {
    console.log(this.format('debug', message, meta));
  }

  static error(message: string, meta?: any) {
    console.error(this.format('error', message, meta));
  }
}
