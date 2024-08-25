import pino from 'pino';
import { env } from './environment';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      crlf: false,
      errorLikeObjectKeys: ['err', 'error'],
      errorProps: '',
      levelFirst: false,
      messageKey: 'msg',
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

class Logger {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          crlf: false,
          errorLikeObjectKeys: ['err', 'error'],
          errorProps: '',
          levelFirst: false,
          messageKey: 'msg',
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  public log(level: 'info' | 'warn' | 'error' | 'debug', message: string, ...args: any[]) {
    this.logger[level](message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
}

export default Logger;