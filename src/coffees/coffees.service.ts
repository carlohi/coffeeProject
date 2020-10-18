import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from '../../src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
    
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
    ){}

    findAll(paginationQuery: PaginationQueryDto){
        const {limit,offset} = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip:offset,
            take: limit
        });
    }
    
    async findOne(id:string){
        const coffee = await this.coffeeRepository.findOne(id,{
            relations:['flavors']
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeDto: CreateCoffeDto){
        const flavors = await Promise.all(
            createCoffeDto.flavors.map(name => this.preloadFlavorByName(name))
        );
        
        const coffe = this.coffeeRepository.create({...createCoffeDto,flavors,});
        return this.coffeeRepository.save(coffe);
    }

    async update(id:string, updateCoffeDto: UpdateCoffeDto){

        const flavors = updateCoffeDto.flavors && (await Promise.all(
            updateCoffeDto.flavors.map(name => this.preloadFlavorByName(name)),
        ));

        const coffee = await this.coffeeRepository.preload({id: +id,
        ...updateCoffeDto,
        flavors
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

    async recommendCoffee(coffee:Coffee){
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffe';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = {coffeId: coffee.id};

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);
            await queryRunner.commitTransaction();
        }catch(err){
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name:string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({name});
        if(existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }


}
