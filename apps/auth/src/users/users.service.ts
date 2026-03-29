import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateUser(createUserDto);
    const password = await bcrypt.hash(createUserDto.password, 10);
    const payload = {
      ...createUserDto,
      password,
    };
    return await this.userRepository.create(payload);
  }
  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  getUser({ _id }: { _id: string }) {
    return this.userRepository.findOne({ _id });
  }

  listUsers() {
    return this.userRepository.find({});
  }

  deleteUser({ _id }: { _id: string }) {
    return this.userRepository.findOneAndDelete({ _id });
  }

  private async validateUser(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      console.error(error);
      return;
    }

    throw new UnprocessableEntityException(
      'User with this email already exists',
    );
  }
}
