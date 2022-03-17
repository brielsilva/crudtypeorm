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