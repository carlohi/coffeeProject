import { Controller,Get, Param,Post,Body, Patch, Delete, Query } from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../src/common/dto/pagination-query.dto';
import { Public } from '../../src/decorators/public.decorator';
import { CoffeesService } from './coffees.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService){}

    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto){
        return this.coffeesService.findAll(paginationQuery);
    }

    @Public()
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
