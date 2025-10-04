export interface Productos{
    idProducto: number;
    codigoBarra:string;
    nombre:string;
    descripcion :string;
    categoria:string;
    pproveedorPreferido:string;
    precioCompra:string;
    precioVenta: number;
    stock: number;
    stockMinimo: number;
    activo: boolean;
    fechaCreacion:string;
    fechaActualizacion:string;
    path:string;
}