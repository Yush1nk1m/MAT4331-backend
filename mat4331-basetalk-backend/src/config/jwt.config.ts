import { JwtSignOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

export const jwtAccessOptions: JwtSignOptions = {
  secret: process.env.JWT_ACCESS_SECRET,
  expiresIn: '7d',
};

export const jwtRefreshOptions: JwtSignOptions = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '30d',
};

export const jwtGrantCodeOptions: JwtSignOptions = {
  secret: process.env.JWT_GRANT_SECRET,
  expiresIn: '1m',
};
