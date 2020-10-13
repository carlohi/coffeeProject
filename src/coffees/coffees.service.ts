import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [{
        id:1,
        name:'Capuccino',
        brand:'Nescafe',
        flavors: ['vainilla','chocolate']
    }];

    findAll(){
        return this.coffees;
    }
    
    findOne(id:string){
        const coffee = this.coffees.find(item=>item.id===+id);
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} Not found`);
        }
        return coffee;
    }

    create(createCoffeDto: any){
        this.coffees.push(createCoffeDto);
    }

    update(id:string, updateCoffeDto: any){
        const existingCoffe = this.findOne(id);
        if(existingCoffe){
            //update the existing coffee
        }
    }

    remove(id:string){
        const coffeeIndex = this.coffees.findIndex(item => item.id ===+id);
        if (coffeeIndex>=0) {
            this.coffees.splice(coffeeIndex,1);
        }
    }


}
