import { Injectable } from '@angular/core';
import { Datos, DatosPaginados, Producto } from '../../datos';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'})
export class ProductService {
  datos: Datos[];
  // Observable para notificar cambios en los productos
  // Usamos BehaviorSubject para que los nuevos suscriptores reciban el último valor inmediatamente
  private productsUpdated$ = new BehaviorSubject<Datos[]>([]);
  public productsUpdated = this.productsUpdated$.asObservable();

  constructor(private httpClient: HttpClient) {
    // Datos iniciales locales (fallback) - se reemplazarán con datos del backend si la API responde
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

  /**
   * Mapea un producto del backend (Producto) al modelo usado en el frontend (Datos)
   */
  private mapProductoADatos(product: Producto, index: number): Datos {
    const nivelMap: Record<string, string> = {
      principiante: 'Básico',
      intermedio: 'Intermedio',
      avanzado: 'Avanzado',
    };

    return {
      id: index + 1,
      nombre: product.title,
      descripcion: product.description,
      precio: product.price,
      alumnos: product.students,
      nivel: nivelMap[product.level] || product.level,
      calificacion: product.rating,
      categoria: (product.category as any)?.name || '',
      imagen: this.getImagenParaProducto(product),
      cantidad: 0,
    };
  }

  /**
   * Determina qué imagen mostrar para un curso.
   * - Si el producto tiene una imagen distinta al placeholder de backend, se usa esa.
   * - Si es el placeholder o no tiene imagen, se asigna una imagen local según el título.
   */
  private getImagenParaProducto(product: Producto): string {
    const backendPlaceholder =
      'https://cdn.pixabay.com/photo/2023/12/15/17/09/ai-generated-8451031_1280.png';

    // Si el admin configuró una imagen personalizada en el backend, úsala
    if (product.image && product.image !== backendPlaceholder) {
      return product.image;
    }

    // Si viene con la imagen por defecto del backend o sin imagen,
    // mapeamos al mismo set de imágenes locales que usabas antes.
    switch (product.title) {
      case 'Javascript Avanzado: Domínalo Como Un Master':
        return 'assets/img/img6.png';
      case 'React: Crea Aplicaciones Web de Alto Nivel':
        return 'assets/img/img2.png';
      case 'Python Total: Analiza Datos En Tiempo Real':
        return 'assets/img/img3.png';
      case 'Angular: Crea Aplicaciones Web Complejas':
        return 'assets/img/img4.png';
      case 'Consumo de APIS: Aprende con Node.JS':
        return 'assets/img/img1.png';
      case 'Diseño de Interfaces: Aprende con Figma':
        return 'assets/img/img5.png';
      case 'Desarrollo de Aplicaciones Móviles: Aprende con React Native':
        return 'assets/img/img8.png';
      case 'Marketing Digital: Aprende con Google Analytics':
        return 'assets/img/img9.png';
      case 'SQL : Aprende a Utilizar Bases de Datos':
        return 'assets/img/img10.png';
      case 'Power Bi : Aprende a Crear Informes para tu Negocio':
        return 'assets/img/img7.png';
      case 'Conoce a tu Cliente: Aprende a Crear Personas':
        return 'assets/img/img11.png';
      case 'Ilustrator : Conviértete en un Gran Ilustrador':
        return 'assets/img/img13.png';
      case 'Fotografía Creativa: Vuélvete un Gran Fotógrafo':
        return 'assets/img/img12.png';
      default:
        // Fallback genérico
        return 'assets/img/img6.png';
    }
  }

  /**
   * Trae los cursos desde la API real y los mapea al formato `Datos`.
   * También actualiza `this.datos` para que el resto de la app use los datos actualizados.
   */
  async traerProductosDesdeApi(): Promise<Datos[]> {
    const url = `${environment.apiUrl}/products?page=1&limit=100`;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'B',location:'product.service.ts:traerProductosDesdeApi',message:'Llamando a API para obtener productos',data:{url,currentDatosLength:this.datos.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.log('📡 [ProductService] traerProductosDesdeApi() →', url);

    try {
      const respuesta = await firstValueFrom(
        this.httpClient.get<DatosPaginados>(url)
      );

      console.log('📡 [ProductService] Respuesta API productos:', respuesta);

      const datosConvertidos = respuesta.data.map((p, idx) =>
        this.mapProductoADatos(p as unknown as Producto, idx)
      );

      // Actualizar datos locales para que el resto de la app vea los cambios
      this.datos = datosConvertidos;
      // Notificar a todos los suscriptores que los datos han cambiado
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'product.service.ts:traerProductosDesdeApi:beforeNext',message:'Emitiendo evento productsUpdated$',data:{subscribersCount:'unknown',newDatosLength:this.datos.length,firstProduct:this.datos[0]?.nombre},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      this.productsUpdated$.next(datosConvertidos);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'B',location:'product.service.ts:traerProductosDesdeApi',message:'Datos actualizados en ProductService y notificados',data:{newDatosLength:this.datos.length,firstProduct:this.datos[0]?.nombre},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      return datosConvertidos;
    } catch (error) {
      console.error('❌ [ProductService] Error al traer productos desde API:', error);
      // Fallback: devolver los datos locales hardcodeados
      return this.datos;
    }
  }

  // 1. Obtener todos los datos (ya sea de API o fallback local)
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

  /**
   * Método público para refrescar los productos desde la API.
   * Útil para ser llamado desde componentes de administración después de crear/actualizar/eliminar.
   */
  async refreshProducts(): Promise<void> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'product.service.ts:refreshProducts',message:'refreshProducts() llamado explícitamente',data:{timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    await this.traerProductosDesdeApi();
  }
}
