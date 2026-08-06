import nodemailer from "nodemailer";

import { mailConfig } from "../config/mail";

import type { EmailPayload } from "../types/EmailPayload";

export class MailProvider {
  private readonly transporter =
    nodemailer.createTransport({
      host: mailConfig.host,

      port: mailConfig.port,

      secure: mailConfig.secure,

      auth: mailConfig.auth,
    });

  public async send(
    payload: EmailPayload
  ): Promise<void> {
    await this.transporter.sendMail({
      from: mailConfig.from,

      to: payload.to,

      subject: payload.subject,

      text: payload.text,

      html: payload.html,
    });
  }
}

export const mailProvider =
  new MailProvider();