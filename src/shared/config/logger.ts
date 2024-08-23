import pino from 'pino';
import { env } from './env';

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