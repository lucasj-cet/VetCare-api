import { Injectable } from '@nestjs/common';
import { Prisma } from './../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetOwnerDto } from './dto/create-pet-owner.dto';

const withActivePets = {
  pets: { where: { deletedAt: null }, orderBy: { name: 'asc' as const } },
} satisfies Prisma.PetOwnerInclude;

const PAGE_SIZE = 10

@Injectable()
export class PetOwnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(search: string | undefined, page: number) {
    const term = search?.trim();
    const digits = term?.replace(/\D/g, '');

    const or: Prisma.PetOwnerWhereInput[] = term
      ? [
          { name: { contains: term, mode: 'insensitive' } },
          {
            pets: {
              some: {
                deletedAt: null,
                name: { contains: term, mode: 'insensitive' },
              },
            },
          },
          ...(digits
            ? [{ cpf: { contains: digits } }, { phone: { contains: digits } }]
            : []),
        ]
      : [];

    const where: Prisma.PetOwnerWhereInput = {
      deletedAt: null,
      ...(or.length && { OR: or }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.petOwner.findMany({
        where,
        include: withActivePets,
        orderBy: { name: 'asc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      this.prisma.petOwner.count({ where }),
    ]);
    const pageSize = PAGE_SIZE
    return { data, total, page, pageSize };
  }

  findById(id: string) {
    return this.prisma.petOwner.findFirst({
      where: { id, deletedAt: null },
      include: withActivePets,
    });
  }

  async existsByCpf(cpf: string) {
  
    const found = await this.prisma.petOwner.findUnique({
      where: { cpf },
      select: { id: true },
    });
    return !!found;
  }
    async existsByEmail(email: string) {
  
    const found = await this.prisma.petOwner.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!found;
  }

    async create(owner: Omit<CreatePetOwnerDto, 'pets'>) {
    return await this.prisma.petOwner.create({ data: owner });
    }

  
  update(
    id: string,
    data: { name?: string; phone?: string; email?: string; address?: string },
  ) {
    return this.prisma.petOwner.update({
      where: { id },
      data,
      include: withActivePets,
    });
  }

  async softDelete(id: string) {
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.pet.updateMany({
        where: { petOwnerId: id, deletedAt: null },
        data: { deletedAt: now },
      }),
      this.prisma.petOwner.update({
        where: { id },
        data: { deletedAt: now },
      }),
    ]);
  }
}