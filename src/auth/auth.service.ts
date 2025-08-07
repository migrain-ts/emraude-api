import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      return user;
    }
    return null;
  }

  async signUp(user: {
    email: string;
    password: string;
    nickname: string;
    avatarUrl: string;
  }) {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: user.email }, { nickname: user.nickname }],
    });
    if (existingUser) {
      throw new ConflictException(
        existingUser.nickname
          ? 'This nickname is already in use'
          : 'This email is already in use',
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await this.userModel.create({
      ...user,
      hashedPassword,
    });

    await createdUser.save();
    return 'User created successfully';
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.nickname, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
