// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { EmailService } from '../email/email.service'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService, 
  ) {}

  private async determineUserRole(): Promise<'admin' | 'customer'> {
    const userCount = await this.userRepository.count();
    return userCount === 0 ? 'admin' : 'customer';
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized User or Invalid Credentials');
    }

    const role = user.id === 1 ? 'admin' : 'customer';
    const payload = {
      email: user.email,
      username: user.username,
      sub: user.id,
      role
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      role
    };
  }

  async signUp(signupDto: SignUpDto) {
    const { username, email, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const role = await this.determineUserRole();
    const newUser = this.userRepository.create({
      username,
      email,
      password,

    });

    await this.userRepository.save(newUser);

    
    await this.sendWelcomeEmail(newUser.email, newUser.username);

    return {
      newUser,
      role
    };
  }

  private async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const subject = 'Welcome to Our Platform!';
    const html = `
      <p>Hello ${username},</p>
      <p>Thank you for signing up for our platform!</p>
      <p>We're excited to have you on board.</p>
      <p>Best regards,</p>
      <p>The Team</p>
    `;

    try {
      await this.emailService.sendEmail({
        recipients: [email],
        subject: subject,
        html: html,
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);

      return {
        ...payload,
        role: payload.sub === 1 ? 'admin' : 'customer'
      };
    } catch (error) {
      return null;
    }
  }
}