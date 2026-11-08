import { OmitType, PartialType } from "@nestjs/swagger";
import { ResponsePetDto } from "../../pet/dto/response-pet.dto";

export class CreatePetWithOwner extends PartialType(
  OmitType(ResponsePetDto, ['petOwner', 'petOwnerId'] as const),
) {}