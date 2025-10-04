import {Component, signal} from '@angular/core'

@Component({
    templateUrl:'./Counter-PageComponent.html',
    styleUrl: './Counter-PageComponent.css'
})
export class CounterPageComponent{
    counter = 10;
    counterSignal = signal(10);

    increase(value:number){
        this.counter += value;
    }

    decrease(value:number){this.counter -= value}

    reset(){
        this.counter=10;
    }
}