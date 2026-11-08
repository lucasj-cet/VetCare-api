import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetWithOwnerDto } from '../pet-owner/dto/create-pet-with-owner.dto';

const withOwner = { petOwner: true } satisfies Prisma.PetInclude;

const PAGE_SIZE = 10

@Injectable()
export class PetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(search: string | undefined, page: number) {
    const term = search?.trim();

    const where: Prisma.PetWhereInput = {
      deletedAt: null,
      ...(term && {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { breed: { contains: term, mode: 'insensitive' } },
          { petOwner: { name: { contains: term, mode: 'insensitive' } } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pet.findMany({
        where,
        include: withOwner,
        orderBy: { name: 'asc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      this.prisma.pet.count({ where }),
    ]);
    const pageSize = PAGE_SIZE

    return { data, total, page, pageSize};
  }

  findById(id: string) {
    return this.prisma.pet.findFirst({
      where: { id, deletedAt: null },
      include: withOwner,
    });
  }

  async ownerExists(petOwnerId: string) {
    const owner = await this.prisma.petOwner.findFirst({
      where: { id: petOwnerId, deletedAt: null },
      select: { id: true },
    });
    return !!owner;
  }

  create(dto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...dto,
        birthDate: new Date(dto.birthDate),
        notes: dto.notes || null,
      },
      include: withOwner,
    });
  }

 createMany(petOwnerId: string, pets: CreatePetWithOwnerDto[]) {

  return this.prisma.pet.createMany(
    {data: pets.map(({ birthDate, notes, ...rest }) => ({
      ...rest,
      birthDate: new Date(birthDate),
      notes: notes || null,
      petOwnerId,
    })),
  });
}

  update(id: string, dto: UpdatePetDto) {
    const { birthDate, notes, ...rest } = dto;
    return this.prisma.pet.update({
      where: { id },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        notes: notes === undefined ? undefined : notes || null,
      },
      include: withOwner,
    });
  }

  async softDelete(id: string) {
    await this.prisma.pet.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}