import { ConsoleLogger, LogLevel } from "@slack/logger";
export const logLevel =
  (process.env.SLACK_LOG_LEVEL as LogLevel) || LogLevel.INFO;
export const logger = new ConsoleLogger();
logger.setLevel(logLevel);
