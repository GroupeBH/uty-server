import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';

type TokenPair = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUserByPhone(phone: string, password: string): Promise<User | null> {
    const user = await this.users.findByPhone(phone);
    if (!user || !user.passwordHash) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? (user as unknown as User) : null;
  }

  async registerLocal(phone: string, password: string, roles?: string[]): Promise<TokenPair> {
    const existing = await this.users.findByPhone(phone);
    if (existing) throw new ConflictException('phone already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await this.users.createUser({
      phone,
      passwordHash,
      roles: roles?.length ? roles : ['buyer'],
      provider: 'local',
    });
    const tokens = this.issueTokens(created as unknown as User);
    this.logger.log(`User registered ${created.phone}`);
    return tokens;
  }

  issueTokens(user: User): TokenPair {
    const payload = { sub: (user as any)._id?.toString?.() ?? '', roles: user.roles, phone: user.phone };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async loginWithPhone(phone: string, password: string): Promise<TokenPair> {
    const user = await this.validateUserByPhone(phone, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    this.logger.log(`Login success ${phone}`);
    return this.issueTokens(user);
  }

  async loginWithProvider(
    provider: User['provider'],
    providerId: string,
    phone?: string,
    email?: string,
  ): Promise<TokenPair> {
    let user = await this.users.findByProvider(provider, providerId);
    if (!user) {
      user = await this.users.createUser({
        provider,
        providerId,
        phone: phone ?? `pseudo-${provider}-${providerId}`,
        email,
        roles: ['buyer'],
      });
    }
    return this.issueTokens(user as unknown as User);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken);
      const user = await this.users.findById(decoded.sub);
      if (!user) throw new UnauthorizedException('User not found');
      this.logger.log(`Refresh token for ${user.phone ?? decoded.sub}`);
      return this.issueTokens(user as unknown as User);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

