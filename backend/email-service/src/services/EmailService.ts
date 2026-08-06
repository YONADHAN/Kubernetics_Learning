import { mailConfig } from "../config/mail";

import { FailureNotification } from "../templates/FailureNotification";

import { mailProvider } from "../providers/MailProvider";

import type { DeadLetterMessage } from "../types/DeadLetterMessage";

export class EmailService {
  public async sendFailureNotification(
    message: DeadLetterMessage
  ): Promise<void> {
    const template =
      FailureNotification.build(
        message
      );

    await mailProvider.send({
      to: mailConfig.to,

      subject: template.subject,

      text: template.text,
    });
  }
}

export const emailService =
  new EmailService();