import { Controller,Get } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {

    @Get()
    findAll(){
        return 'This method returns all coffees';
    }
}