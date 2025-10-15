import { Component } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  standalone : true,
  imports: [],
  templateUrl: './ejemplo.html',
  styleUrls: ['./ejemplo.css']
})
export class Ejemplo {

  nombre : string = 'Usuario';
}
