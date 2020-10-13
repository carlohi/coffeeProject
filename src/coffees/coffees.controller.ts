import { Controller,Get, Param,Post,Body, Patch, Delete } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService){}

    @Get()
    findAll(){
        return this.coffeesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeDto){
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id:string , @Body() updateCoffeeDto: UpdateCoffeDto){
        return this.coffeesService.update(id,updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id:string ){
        return this.coffeesService.remove(id);
    }
}
