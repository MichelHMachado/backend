import {
  ConflictException,
  ForbiddenException,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user.toJSON();

    return userData;
  }

  async login(user: any) {
    const { name, email, uuid } = user;
    const accessToken = await this.jwtService.signAsync(
      { uuid, name, email },
      { expiresIn: '15m' },
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

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Fetch the user details from the database using the uuid in the payload
      const user = await this.userService.findOne(payload.uuid);

      // Ensure that the user is found
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // Create the access token payload with the full user details
      const accessTokenPayload = {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
      };

      const { access_token, refresh_token } =
        await this.login(accessTokenPayload);

      return { accessToken: access_token, refreshToken: refresh_token };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token', error);
    }
  }
}
