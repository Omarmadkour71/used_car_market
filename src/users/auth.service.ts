import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // (1) Check if the Email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email In Use!');
    }

    // (2) Password Hashing
    // creating the salt
    const salt = randomBytes(8).toString('hex');
    // hash the password and salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hash and salt together
    const hashedPassword = salt + '.' + hash.toString('hex');

    // (3) Create a new User
    const user = await this.userService.create(email, hashedPassword);

    // (4) return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong Password');
    }

    return user;
  }
}
