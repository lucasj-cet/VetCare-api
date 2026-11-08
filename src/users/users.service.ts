import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserStatus } from '../generated/prisma/enums';
import { JwtService } from '@nestjs/jwt';
import { AcceptInviteDto } from '../auth/dto/accept-invite.dto';
import { ListUsersDto } from './dto/list-user.dto';
import { MailService } from '../mail/mail.service';
import { ResponseUserByIdDto } from './dto/response-user-byId.dto';

  const PAGE_SIZE = 10
@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository, 
    private readonly jwtService: JwtService,
    private readonly mailService: MailService) {}
  

  
  async create(data: CreateUserDto) {

    if(await this.usersRepository.findByEmail(data.email)){
      throw new ConflictException('Já existe um usuário com este e-mail');
    }

    const hashedPassword = await hash(data.password, 10);
    const user = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async invite(data: InviteUserDto){
    
    if(await this.usersRepository.findByEmail(data.email)){
      throw new ConflictException('Já existe um usuário com este e-mail');  
    }

    const user = await this.usersRepository.create({
      name: data.name,
      email: data.email,
      role: data.role,
      status: UserStatus.PENDING_INVITE,
      inviteSentAt: new Date()
    });

    const payload = {
      sub: user.id,
      email: user.email,
      porpose: 'invite'
    }
    const inviteToken = await this.jwtService.sign(payload)

    try{
      await this.mailService.sendConfirmationEmail(data.email, inviteToken)
    }catch(er)
    {
      throw new InternalServerErrorException(er);
    }
  
    return HttpStatus.CREATED
  }

  async deactivate(id: string){
    if (!await this.usersRepository.findById(id)){
      throw new BadRequestException('Usuário não existe')
    }
    await this.usersRepository.update(id,{status: 'DEACTIVATED'})
  }

  async refresh(id: string){
    const user = await this.usersRepository.findById(id)
    if(!user){
      throw new ConflictException('usuário não existe')
    }
    return plainToInstance(ResponseUserDto, user, {excludeExtraneousValues:true})
  }

  async findAll({ search, page }: ListUsersDto) {
    const currentPage = page ?? 1;

    const [data, total] = await Promise.all([
      this.usersRepository.findMany({
        search,
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      this.usersRepository.count(search),
    ]);

    const pageSize = PAGE_SIZE
    return {
      data,
      total,
      page: currentPage,
      pageSize
    };
  }

  async findOne(id: string) {

    const user = await this.usersRepository.findById(id);

    if(!user){
      throw new BadRequestException('Usuário não existe')
    }
    return plainToInstance(ResponseUserByIdDto, user, {excludeExtraneousValues: true} );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);

    if(!user){
      throw new BadRequestException('Usuário não existe')
    }
    const updatedUser = await this.usersRepository.update(user.id, updateUserDto)

    return plainToInstance(ResponseUserDto, user, {excludeExtraneousValues: true})
  }

  async remove(id: string) {
    const user = await this.usersRepository.findById(id);

    if(!user){
      console.log(user)
      throw new BadRequestException('Usuário não existe')
    }
    return await this.usersRepository.delete(id);
  }
}
