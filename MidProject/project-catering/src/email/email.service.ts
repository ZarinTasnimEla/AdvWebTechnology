import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    console.log('EMAIL_HOST:', this.configService.get<string>('EMAIL_HOST'));
    console.log('MAIL_PORT:', this.configService.get<number>('MAIL_PORT'));
    console.log('EMAIL_USER:', this.configService.get<string>('EMAIL_USER'));
    console.log('EMAIL_PASS:', this.configService.get<string>('EMAIL_PASS'));
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      tls: {
        ciphers:'SSLv3',
      },
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
  }
}
