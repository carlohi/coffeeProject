import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffe.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){

}
