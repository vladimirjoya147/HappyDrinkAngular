import {Component, signal} from '@angular/core'

@Component({
    templateUrl: './hero-Page.Component.html',
    styleUrl:'./hero-Page.Component.css'
})
export class HeroPageComponent{

    name= signal("iron man");
    age= signal(45);    

    getHeroDescription(){
        return `${this.name} - ${this.age}`
    }

    changeHero(){
        this.name.set("Spiderman");
        this.age.set(22);
    }

    resetForm(){
        this.name.set("iron man");
        this.age.set(45)
    }

    changeAge(){
        this.age.set(60)
    }

}