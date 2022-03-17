import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import MailOptions from './mailer_options_interface';

@Injectable()
export default class EmailService {  
  constructor(
    private readonly configService: ConfigService
  ) {
      //sgMail.setApiKey(configService.get('SENDGRID_PASS'));
      sgMail.setApiKey('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');
  }

  sendMail(options: MailOptions) {
    return sgMail.send(options);
  }
}