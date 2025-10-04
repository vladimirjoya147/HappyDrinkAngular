import { Productos } from "./Productos";

export interface paginado {
    page:number;
    size:number;
    totalElements:number;
    totalPages:number;
    first:boolean;
    last: boolean,
    content : Productos[];
}