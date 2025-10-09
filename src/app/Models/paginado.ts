import { Productos } from "./Productos";

export interface paginado <T> {
    page:number;
    size:number;
    totalElements:number;
    totalPages:number;
    first:boolean;
    last: boolean,
    content : T[];
}