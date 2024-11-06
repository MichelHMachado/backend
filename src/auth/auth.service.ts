import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário e/ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos');
    }

    const { password: _, ...userData } = user.toJSON();

    return userData;
  }

  async login(user: any) {
    const { name, email, uuid } = user;
    const accessToken = this.jwtService.sign(
      { uuid, name, email },
      { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign({ uuid }, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signUp(userDto: UserDto) {
    const existingUser = await this.userService.findOneByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });
    return user;
  }
}
