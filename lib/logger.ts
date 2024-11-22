interface LogMeta {
    [key: string]: any;
}

class Logger {
    private static instance: Logger;
    private isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: string, message: string, meta?: LogMeta): string {
        const timestamp = new Date().toISOString();
        const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaString}`;
    }

    public info(message: string, meta?: LogMeta): void {
        const formattedMessage = this.formatMessage('INFO', message, meta);
        console.log(formattedMessage);
    }

    public error(message: string, error?: Error | any, meta?: LogMeta): void {
        const errorMeta = {
            ...meta,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined
            } : error
        };

        const formattedMessage = this.formatMessage('ERROR', message, errorMeta);
        console.error(formattedMessage);
    }

    public warn(message: string, meta?: LogMeta): void {
        const formattedMessage = this.formatMessage('WARN', message, meta);
        console.warn(formattedMessage);
    }

    public debug(message: string, meta?: LogMeta): void {
        if (this.isDevelopment) {
            const formattedMessage = this.formatMessage('DEBUG', message, meta);
            console.debug(formattedMessage);
        }
    }
}

const logger = {
    info(message: string, meta?: any) {
        Logger.getInstance().info(message, meta);
    },
    warn(message: string, meta?: any) {
        Logger.getInstance().warn(message, meta);
    },
    error(message: string, meta?: any) {
        Logger.getInstance().error(message, meta);
    }
};

export { logger };
