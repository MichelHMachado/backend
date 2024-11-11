import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Req,
  Get,
  ConflictException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { parseCookies } from 'src/utils/cookieUtils';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { getAuthorizationToken } from 'src/utils/getAuthorizationToken';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    if (!body.email || !body.password) {
      return res
        .status(400)
        .json({ message: 'Email and password must be provided' });
    }
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );

      const { access_token, refresh_token } =
        await this.authService.login(user);
      this.setRefreshTokenCookie(res, refresh_token);

      return res.status(HttpStatus.CREATED).json({ access_token });
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Post('sign-up')
  async signUp(@Body() body: UserDto, @Res() res: Response) {
    if (!body.email || !body.password || !body.name) {
      return res
        .status(400)
        .json({ message: 'Name, email, and password are required' });
    }
    try {
      const user = await this.authService.signUp(body);
      const { access_token, refresh_token } =
        await this.authService.login(user);
      this.setRefreshTokenCookie(res, refresh_token);
      return res.status(HttpStatus.CREATED).json({ access_token });
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ error: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: `Sign-up failed, please try again: ${error}` });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    const token = getAuthorizationToken(req);

    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No token found', isAuthenticated: false });
    }

    try {
      const decoded = this.jwtService.verify(token);

      return res
        .status(HttpStatus.OK)
        .json({ isAuthenticated: true, user: decoded });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ isAuthenticated: false, error: error });
    }
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const cookies = parseCookies(req.headers.cookie);
    const { refresh_token } = cookies;

    if (!refresh_token) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'No token found', isAuthenticated: false });
    }
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(refresh_token);
      this.setRefreshTokenCookie(res, refreshToken);
      return res.json({ access_token: accessToken });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ isAuthenticated: false, error });
    }
  }
}
