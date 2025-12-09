import { Injectable } from '@angular/core';
import {Datos, DatosPaginados} from '../../datos';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'})
export class ProductService {
  datos: Datos[];

  constructor(private httpClient: HttpClient) {
    this.datos = [
      {
        id: 1, // Nuevo campo único
        nombre: 'Javascript Avanzado: Domínalo Como Un Master',
        descripcion:
          'Domina los conceptos avanzados de Javascript de la mano de un experto a través de ejercicios prácticos',
        precio: 1899,
        alumnos: 1002,
        nivel: 'Avanzado',
        calificacion: 4.8,
        categoria: 'Desarrollo Web',
        imagen: 'assets/img/img6.png',
        cantidad: 0,
      },
      {
        id: 2, // Nuevo campo único
        nombre: 'React: Crea Aplicaciones Web de Alto Nivel',
        descripcion:
          'Aprende a crear aplicaciones web de alto nivel con React y sus herramientas asociadas',
        precio: 899,
        alumnos: 200,
        nivel: 'Básico',
        calificacion: 5,
        categoria: 'Desarrollo Web',
        imagen: 'assets/img/img2.png',
        cantidad: 0,
      },

      {
        id: 3, // Nuevo campo único
        nombre: 'Python Total: Analiza Datos En Tiempo Real',
        descripcion:
          'Aprende a analizar datos en tiempo real con Python y librerías como Pandas y Matplotlib',
        precio: 299,
        alumnos: 4200,
        nivel: 'Básico',
        calificacion: 2.5,
        categoria: 'Ciencia de Datos',
        imagen: 'assets/img/img3.png',
        cantidad: 0,
      },

      {
        id: 4, // Nuevo campo único
        nombre: 'Angular: Crea Aplicaciones Web Complejas',
        descripcion:
          'Aprende a crear aplicaciones web complejas con Angular y a utilizar como un experto este framework de Javascript',
        precio: 1999,
        alumnos: 1000,
        nivel: 'Avanzado',
        calificacion: 4.5,
        categoria: 'Desarrollo Web',
        imagen: 'assets/img/img4.png',
        cantidad: 0,
      },
      {
        id: 5, // Nuevo campo único
        nombre: 'Consumo de APIS: Aprende con Node.JS',
        descripcion:
          'Aprende a consumir APIS con Node.JS y a utilizar librerías como Axios y Fetch',
        precio: 499,
        alumnos: 120,
        nivel: 'Intermedio',
        calificacion: 1.5,
        categoria: 'Desarrollo Web',
        imagen: 'assets/img/img1.png',
        cantidad: 0,
      },

      {
        id: 6, // Nuevo campo único
        nombre: 'Diseño de Interfaces: Aprende con Figma',
        descripcion:
          'Aprende a diseñar interfaces con Figma y a utilizar como un experto este herramienta de diseño',
        precio: 1100,
        alumnos: 2300,
        nivel: 'Básico',
        calificacion: 5,
        categoria: 'Diseño Gráfico',
        imagen: 'assets/img/img5.png',
        cantidad: 0,
      },
      {
        id: 7, // Nuevo campo único
        nombre: 'Desarrollo de Aplicaciones Móviles: Aprende con React Native',
        descripcion:
          'Aprende a desarrollar aplicaciones móviles con React Native y a utilizar como un experto este framework de Javascript',
        precio: 1380,
        alumnos: 1320,
        nivel: 'Avanzado',
        calificacion: 4.3,
        categoria: 'Desarrollo Web',
        imagen: 'assets/img/img8.png',
        cantidad: 0,
      },

      {
        id: 8, // Nuevo campo único
        nombre: 'Marketing Digital: Aprende con Google Analytics',
        descripcion:
          'Aprende a utilizar Google Analytics y a analizar datos para mejorar tus estregias de marketing digital',
        precio: 299,
        alumnos: 1500,
        nivel: 'Intermedio',
        calificacion: 3.8,
        categoria: 'Marketing',
        imagen: 'assets/img/img9.png',
        cantidad: 0,
      },

      {
        id: 9, // Nuevo campo único
        nombre: 'SQL : Aprende a Utilizar Bases de Datos',
        descripcion:
          'Aprende a utilizar bases de datos con SQL y a transformar tus datos en información valiosa para tu negocio',
        precio: 399,
        alumnos: 1000,
        nivel: 'Básico',
        calificacion: 5,
        categoria: 'Ciencia de Datos',
        imagen: 'assets/img/img10.png',
        cantidad: 0,
      },

      {
        id: 10, // Nuevo campo único
        nombre: 'Power Bi : Aprende a Crear Informes para tu Negocio',
        descripcion:
          'Aprende a crear informes con Power Bi y a utilizar como un expert o esta herramienta de análisis de datos',
        precio: 499,
        alumnos: 1200,
        nivel: 'Intermedio',
        calificacion: 4.8,
        categoria: 'Ciencia de Datos',
        imagen: 'assets/img/img7.png',
        cantidad: 0,
      },

      {
        id: 11, // Nuevo campo único
        nombre: 'Conoce a tu Cliente: Aprende a Crear Personas',
        descripcion:
          'Aprende a crear personas y a utilizar como un experto esta herramienta de diseño de personas',
        precio: 399,
        alumnos: 800,
        nivel: 'Básico',
        calificacion: 2.2,
        categoria: 'Marketing',
        imagen: 'assets/img/img11.png',
        cantidad: 0,
      },
      {
        id: 12, // Nuevo campo único
        nombre: 'Ilustrator : Conviértete en un Gran Ilustrador',
        descripcion:
          'Aprende a utilizar Illustrator y a transformar tus ideas en imágenes',
        precio: 422,
        alumnos: 1200,
        nivel: 'Intermedio',
        calificacion: 4.9,
        categoria: 'Diseño Gráfico',
        imagen: 'assets/img/img13.png',
        cantidad: 0,
      },

      {
        id: 13, // Nuevo campo único
        nombre: 'Fotografía Creativa: Vuélvete un Gran Fotógrafo',
        descripcion:
          'Aprende a utilizar una cámara profesional y aprende técnicas de fotografía actuales',
        precio: 1333,
        alumnos: 200,
        nivel: 'Intermedio',
        calificacion: 3.6,
        categoria: 'Diseño Gráfico',
        imagen: 'assets/img/img12.png',
        cantidad: 0,
      },
    ];
  }

  traerProductos(): Promise<DatosPaginados[]> {
    return firstValueFrom(
        this.httpClient.get<DatosPaginados[]>('http://localhost:3000/api/products/products/')
    );
  }

  // 1. Obtener todos los datos
  getTodosLosDatos(): Datos[] {
    return this.datos;
  }

  // 4. Filtrar por categoría
  filtrarPorCategoria(categoria: string): Datos[] {
    if (categoria === 'Todos') {
      return this.datos;
    } else {
      return this.datos.filter((curso) => curso.categoria === categoria);
    }
  }
}
