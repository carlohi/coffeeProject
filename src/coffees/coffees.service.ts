import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
    ){}

    findAll(){
        return this.coffeeRepository.find({
            relations: ['flavors']
        });
    }
    
    async findOne(id:string){
        const coffee = await this.coffeeRepository.findOne(id,{
            relations:['flavors']
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} Not found`);
        }
        return coffee;
    }

    create(createCoffeDto: CreateCoffeDto){
        const coffe = this.coffeeRepository.create(createCoffeDto);
        return this.coffeeRepository.save(coffe);
    }

    async update(id:string, updateCoffeDto: UpdateCoffeDto){
        const coffee = await this.coffeeRepository.preload({id: +id,
        ...updateCoffeDto
        })
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id:string){
        const coffee = await this.coffeeRepository.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }


}
