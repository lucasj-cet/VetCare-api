import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';
import { ListPetOwnersQueryDto } from './dto/list-petowner-query.dto';
import { UpdatePetOwnerDto } from './dto/update-pet-owner.dto';
import { PetOwnerRepository } from './pet-owner.repository';
import { plainToInstance } from 'class-transformer';
import { PetRepository } from '../pet/pet.repository';
import { PetOwnerResponseDto } from './dto/response-pet-owner.dto';

@Injectable()
export class PetOwnerService {
  constructor(private readonly repository: PetOwnerRepository, private readonly petRepository: PetRepository) {}

async list({ search, page }: ListPetOwnersQueryDto) {
  const { data, ...pagination } = await this.repository.search(search, page);

  return {
    ...pagination,
    data: plainToInstance(PetOwnerResponseDto, data, {
      excludeExtraneousValues: false,
    }),
  };
}

  async create(dto: CreatePetOwnerDto) {
  if (await this.repository.existsByCpf(dto.cpf) || await this.repository.existsByEmail(dto.email)) {
    throw new ConflictException('Já existe um tutor com este cpf ou email');
  }

  const { pets, ...ownerData } = dto;
  const owner = await this.repository.create(ownerData);

  if (pets?.length) {
    const petsData = pets.map((pet) => ({
      ...pet,               
      petOwnerId: owner.id,
    }));
    await this.petRepository.createMany(owner.id, petsData)
  }

    return plainToInstance(PetOwnerResponseDto, this.findOne(owner.id), {excludeExtraneousValues:false});
}

  async findOne(id: string) {
    const owner = await this.repository.findById(id);
    if (!owner) throw new NotFoundException('Tutor não encontrado');
    return owner;
  }

  async update(id: string, dto: UpdatePetOwnerDto) {
    await this.findOne(id);
    const { name, phone, email, address } = dto;

    const petOwner = this.repository.update(id, { name, phone, email, address });

    return plainToInstance(PetOwnerResponseDto, petOwner, {excludeExtraneousValues:false})
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repository.softDelete(id);
  }
}