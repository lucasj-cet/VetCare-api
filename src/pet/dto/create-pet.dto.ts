import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Sex } from '../../generated/prisma/enums';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nome do pet',
    example: 'Rex',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Espécie do pet',
    example: 'Cachorro',
  })
  @IsString()
  @IsNotEmpty()
  species: string;

  @ApiProperty({
    description: 'Raça do pet',
    example: 'Labrador',
  })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({
    description: 'Sexo do pet',
    enum: Sex,
    enumName: 'Sex',
    example: Object.values(Sex)[0], // ajuste para um valor real do seu enum
  })
  @IsEnum(Sex)
  @IsNotEmpty()
  sex: Sex;

  @ApiProperty({
    description: 'Data de nascimento do pet (formato ISO 8601)',
    example: '2022-03-15',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    description: 'Peso do pet em quilogramas (até 2 casas decimais)',
    example: 12.5,
    type: Number,
    minimum: 0,
    exclusiveMinimum: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weight: number;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o pet',
    example: 'Alérgico a frango'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'ID (UUID) do tutor responsável pelo pet',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  petOwnerId: string;
}