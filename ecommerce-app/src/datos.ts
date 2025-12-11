export interface Datos
  {
    cantidad: number;
    id: number;  // Nuevo campo único
    nombre: string;
    descripcion: string;
    precio: number;
    alumnos: number;
    nivel:string;
    calificacion:number;
    categoria:string;
    imagen:string;

  }
export interface DatosPaginados {

    success: boolean;
    count: number;
    total: number;
    data: Producto[];
}


export interface Producto {
    "_id": string;
    "title": string;
    "description": string;
    "price": number;
    "category": {
        "_id": string;
        "name": string;
    };
    "instructor": string;
    "duration": number;
    "level": string;
    "image": string;
    "students": number;
    "rating": number;

}

