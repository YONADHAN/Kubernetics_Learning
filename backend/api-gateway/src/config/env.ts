import dotenv from "dotenv";
import { z } from "zod";

import { NodeEnvironments, LogLevels } from "../constants/index";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().int().positive(),

    NODE_ENV: z.enum([
        NodeEnvironments.DEVELOPMENT,
        NodeEnvironments.PRODUCTION,
        NodeEnvironments.TEST,
    ]),

    SERVICE_NAME: z.string().min(1),

    CALCULATOR_SERVICE_URL: z.url(),

    REQUEST_TIMEOUT: z.coerce.number().positive(),

    LOG_LEVEL: z.enum([
        LogLevels.TRACE,
        LogLevels.DEBUG,
        LogLevels.INFO,
        LogLevels.WARN,
        LogLevels.ERROR,
        LogLevels.FATAL,
    ]),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(
        " Invalid environment variables:"
    );

    console.error(parsed.error.format());

    process.exit(1);
}

export const env = parsed.data;