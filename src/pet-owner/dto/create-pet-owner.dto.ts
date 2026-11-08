import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { CreatePetDto } from '../../pet/dto/create-pet.dto';
import { CreatePetWithOwner } from './create-pet-with-owner.dto';

export class CreatePetOwnerDto {
  @ApiProperty({ description: 'Nome completo do proprietário', example: 'Maria da Silva' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'CPF do proprietário (exatamente 11 dígitos numéricos)', example: '12345678901' })
  @Expose()
  @Matches(/^\d{11}$/, { message: 'cpf deve conter 11 dígitos numéricos' })
  cpf: string;

  @ApiProperty({ description: 'Número de telefone com DDD (10 ou 11 dígitos numéricos)', example: '71987654321' })
  @Expose()
  @Matches(/^\d{10,11}$/, { message: 'phone deve conter 10 ou 11 dígitos numéricos' })
  phone: string;

  @ApiProperty({ description: 'Endereço de e-mail válido do proprietário', example: 'maria.silva@email.com' })
  @Expose()  
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Endereço residencial do proprietário', example: 'Rua Principal, 456 - Salvador, BA' })
  @Expose()  
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'Lista opcional de pets associados ao proprietário', type: () => [CreatePetDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePetWithOwner)
  pets?: CreatePetWithOwner[];
}