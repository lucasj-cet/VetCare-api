import { OmitType} from "@nestjs/swagger";
import { CreatePetDto } from "../../pet/dto/create-pet.dto";

export class CreatePetWithOwnerDto extends OmitType(CreatePetDto, [
  'petOwnerId',
] as const) {}