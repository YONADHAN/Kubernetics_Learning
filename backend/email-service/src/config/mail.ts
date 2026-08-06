import { env } from "./env";

export const mailConfig = {
  host: env.MAIL_HOST,

  port: env.MAIL_PORT,

  secure: env.MAIL_SECURE,

  auth: {
    user: env.MAIL_USER,

    pass: env.MAIL_PASSWORD,
  },

  from: env.MAIL_FROM,

  to: env.MAIL_TO,
} as const;