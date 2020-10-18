import { PartialType } from "@nestjs/swagger";
import { CreateCoffeDto } from "./create-coffe.dto";

export class UpdateCoffeDto extends PartialType(CreateCoffeDto){

}
