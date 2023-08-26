import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendGrid from '@sendgrid/mail';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailUtilService {
  private log: Logger = new Logger('email-util');

  constructor(
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendEmail(emailSubject: string, htmlData: string, toMail: string) {
    sendGrid.setApiKey(this.config.get<string>('SENDGRID_API_KEY'));
    const msg = {
      to: toMail,
      from: this.config.get<string>('FROM_EMAIL'), // Use the email address or domain you verified above
      subject: emailSubject,
      text: 'reset link',
      html: htmlData,
    };
    //ES6
    const data = await sendGrid.send(msg).then(
      () => {
        this.log.log('response of send email');
      },
      (error) => {
        this.log.error(error);

        if (error.response) {
          this.log.error(error.response.body);
        }
      },
    );
    this.log.log('this', data);
    return true;
  }

  async sendEmailByNodemailer(
    emailSubject: string,
    htmlData: string,
    toMail: string,
  ) {
    const msg = {
      to: toMail,
      from: this.config.get<string>('FROM_EMAIL'), // Use the email address or domain you verified above
      subject: emailSubject,
      text: 'reset link',
      html: htmlData,
    };
    const data = await this.mailerService
      .sendMail(msg)
      .then(
        () => {
          this.log.log('response of send email');
        },
        (error) => {
          this.log.error(error);

          if (error.response) {
            this.log.error(error.response.body);
          }
        },
      )
      .catch((e) => {
        console.log(e);
      });
    this.log.log('this', data);
    return true;
  }
}
