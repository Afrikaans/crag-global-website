import winston from 'winston';
const { combine, timestamp, json } = winston.format;

export const auditLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({ format: winston.format.json() })
  ],
});

export const auditMiddleware = () => (req: any, _res: any, next: any) => {
  req.audit = (event: string, meta?: any) =>
    auditLogger.info({ event, ip: req.ip, userAgent: req.get('user-agent'), ...meta });
  next();
};
