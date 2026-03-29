import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../current-user.decorator';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guard/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/list')
  listUsers() {
    return this.userService.listUsers();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Delete('/:id')
  deleteUser(@Param('id') _id: string) {
    console.log('Deleting user with id:', _id);
    return this.userService.deleteUser({ _id });
  }
}
